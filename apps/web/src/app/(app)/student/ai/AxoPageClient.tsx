"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { TutorMessage, TutorChatResponse } from "@/types/tutor";
import { useStudentAuth } from "@/lib/studentAuth";
import AxoAvatar from "@/components/tutor/AxoAvatar";

// ── Config constants ───────────────────────────────────────────────────────────

const STAAR_DATE = "Apr 16";

const AXO_SYSTEM_PROMPT =
  "You are Axo, a biology tutor for 9th grade students. You know the full BioSpark curriculum: all units, all TEKS, vocabulary, and common misconceptions. You are ready to explain concepts, create STAAR-style practice problems, help with vocab, and give study advice. Your tone is calm and direct, like a knowledgeable older sibling. Keep responses concise. Use plain-language analogies when something is abstract. Never start a response with Great question, Certainly, or Absolutely. Never use em dashes, emoji, or any slang or acronyms. Never repeat the student's question back to them. Never talk down or over-explain. If a student gets a quiz question wrong, give one targeted hint and let them try again. If they get it wrong a second time, explain the answer clearly and move on with no judgment. If a student asks something off-topic, redirect warmly but briefly. Never mention the school district.";

// ── Design tokens ──────────────────────────────────────────────────────────────

const AXO = {
  coral: "#e05a2a",
  coralLight: "#fde8e0",
  coralText: "#c04a20",
  coralHover: "#f06a38",
  coralDark: "#a03a14",
  pageBg: "#eef3ee",
  surface: "#ffffff",
  bodyText: "#1a2e22",
  subText: "#5a7a66",
  labelText: "#6a9a82",
  border: "rgba(10,60,30,0.10)",
} as const;

// ── Types ──────────────────────────────────────────────────────────────────────

interface UnitOption {
  id: string;
  unitNumber: number;
  title: string;
  teks: string[];
}

interface ChatEntry {
  role: "user" | "assistant";
  content: string;
  metadata?: TutorChatResponse;
}

interface Conversation {
  id: string;
  messages: ChatEntry[];
  createdAt: Date;
}

interface Props {
  units: UnitOption[];
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function extractMetadata(text: string): TutorChatResponse | null {
  const sep = text.lastIndexOf("\n\n");
  if (sep === -1) return null;
  const candidate = text.slice(sep + 2).trim();
  if (!candidate.startsWith("{")) return null;
  try {
    return JSON.parse(candidate) as TutorChatResponse;
  } catch {
    return null;
  }
}

function stripMetadataFooter(text: string): string {
  const sep = text.lastIndexOf("\n\n");
  if (sep === -1) return text;
  const candidate = text.slice(sep + 2).trim();
  if (!candidate.startsWith("{")) return text;
  return text.slice(0, sep).trimEnd();
}

function getConversationTitle(messages: ChatEntry[]): string {
  const firstUser = messages.find((m) => m.role === "user");
  if (!firstUser) return "New conversation";
  const text = firstUser.content.trim();
  if (text.length < 4) return "New conversation";
  return text.length > 52 ? text.slice(0, 52) + "…" : text;
}

function formatTimestamp(date: Date): string {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart.getTime() - 86400000);
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  if (d.getTime() === todayStart.getTime()) return "Today";
  if (d.getTime() === yesterdayStart.getTime()) return "Yesterday";
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[date.getMonth()]} ${date.getDate()}`;
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

// ── Starter chips ──────────────────────────────────────────────────────────────

const STARTER_CHIPS: { label: string; value: string }[] = [
  { label: "Explain something", value: "Explain something to me" },
  { label: "Quiz me", value: "Quiz me on a biology topic" },
  { label: "STAAR prep", value: "Help me prep for STAAR" },
  { label: "Vocab help", value: "What does this vocab word mean?" },
];

const QUICK_REPLY_CHIPS = [
  "Give an example",
  "Quiz me on this",
  "Simplify it",
  "STAAR angle",
];

const MAX_MESSAGE_LENGTH = 500;

// ── Main component ─────────────────────────────────────────────────────────────

export default function AxoPageClient(_props: Props) {

  const { student } = useStudentAuth();
  const studentId = student?.id ?? "student";

  const [conversations, setConversations] = useState<Conversation[]>(() => [
    { id: generateId(), messages: [], createdAt: new Date() },
  ]);
  const [activeId, setActiveId] = useState<string>(() => conversations[0].id);
  const [inputText, setInputText] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [waitingLong, setWaitingLong] = useState(false);

  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const waitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeConv = conversations.find((c) => c.id === activeId) ?? conversations[0];
  const activeMessages = activeConv.messages;
  const hasMessages = activeMessages.length > 0;

  // Auto-scroll on new messages
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [activeMessages]);

  // Reset waiting label when streaming stops
  useEffect(() => {
    if (!streaming) {
      setWaitingLong(false);
      if (waitTimerRef.current) {
        clearTimeout(waitTimerRef.current);
        waitTimerRef.current = null;
      }
    }
  }, [streaming]);

  const sendMessage = useCallback(
    async (overrideText?: string) => {
      const text = (overrideText ?? inputText).trim();
      if (!text || streaming) return;

      setError(null);
      setInputText("");

      const history: TutorMessage[] = activeMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      // Append user message to active conversation
      const userEntry: ChatEntry = { role: "user", content: text };
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeId
            ? { ...c, messages: [...c.messages, userEntry] }
            : c,
        ),
      );

      setStreaming(true);

      // Append placeholder assistant entry
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeId
            ? { ...c, messages: [...c.messages, userEntry, { role: "assistant", content: "" }] }
            : c,
        ),
      );

      // Start 8-second "waiting long" timer
      waitTimerRef.current = setTimeout(() => setWaitingLong(true), 8000);

      try {
        const res = await fetch("/api/tutor/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-student-id": studentId,
          },
          body: JSON.stringify({
            message: text,
            lessonSlug: "general",
            studentId,
            conversationHistory: history,
            triggeredBy: "student",
            systemPrompt: AXO_SYSTEM_PROMPT,
          }),
        });

        if (!res.ok) {
          const errData = (await res.json().catch(() => ({}))) as {
            error?: string;
            message?: string;
          };
          throw new Error(
            errData.message ?? `HTTP ${res.status}: ${errData.error ?? "unknown"}`,
          );
        }

        if (!res.body) throw new Error("Empty response body.");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += decoder.decode(value, { stream: true });
          const visible = stripMetadataFooter(accumulated);
          setConversations((prev) =>
            prev.map((c) => {
              if (c.id !== activeId) return c;
              const msgs = [...c.messages];
              msgs[msgs.length - 1] = { role: "assistant", content: visible };
              return { ...c, messages: msgs };
            }),
          );
        }

        const meta = extractMetadata(accumulated);
        const visible = stripMetadataFooter(accumulated);
        setConversations((prev) =>
          prev.map((c) => {
            if (c.id !== activeId) return c;
            const msgs = [...c.messages];
            msgs[msgs.length - 1] = {
              role: "assistant",
              content: visible,
              metadata: meta ?? undefined,
            };
            return { ...c, messages: msgs };
          }),
        );
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Something went wrong.";
        setError(msg);
        // Remove the placeholder assistant entry
        setConversations((prev) =>
          prev.map((c) => {
            if (c.id !== activeId) return c;
            return { ...c, messages: c.messages.slice(0, -1) };
          }),
        );
      } finally {
        setStreaming(false);
        inputRef.current?.focus();
      }
    },
    [inputText, activeMessages, activeId, streaming, studentId],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage],
  );

  const startNewConversation = useCallback(() => {
    const newConv: Conversation = {
      id: generateId(),
      messages: [],
      createdAt: new Date(),
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveId(newConv.id);
    setError(null);
    setInputText("");
    inputRef.current?.focus();
  }, []);

  const switchConversation = useCallback((id: string) => {
    setActiveId(id);
    setError(null);
    setInputText("");
  }, []);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div
      style={{
        display: "flex",
        height: "100dvh",
        width: "100%",
        background: AXO.pageBg,
        fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* ── Sidebar ── */}
      <aside
        style={{
          width: "200px",
          flexShrink: 0,
          background: AXO.surface,
          borderRight: `1px solid ${AXO.border}`,
          display: "flex",
          flexDirection: "column",
        }}
        aria-label="Axo conversation history"
      >
        {/* Sidebar header */}
        <div
          style={{
            padding: "18px 16px 14px",
            borderBottom: `1px solid ${AXO.border}`,
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <AxoAvatar size={36} />
          <div>
            <p
              style={{
                margin: 0,
                fontFamily: "var(--font-lora), Georgia, serif",
                fontStyle: "italic",
                fontWeight: 700,
                fontSize: "15px",
                color: AXO.coralText,
                lineHeight: 1.1,
              }}
            >
              Axo
            </p>
            <p
              style={{
                margin: 0,
                fontFamily: "var(--font-dm-mono), monospace",
                fontSize: "9px",
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                color: AXO.labelText,
                marginTop: "2px",
              }}
            >
              Biology Tutor
            </p>
          </div>
        </div>

        {/* History */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "12px 12px 6px",
            scrollbarWidth: "thin",
            scrollbarColor: `${AXO.border} transparent`,
          }}
        >
          <p
            style={{
              margin: "0 0 8px",
              fontFamily: "var(--font-dm-mono), monospace",
              fontSize: "8.5px",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: AXO.labelText,
            }}
          >
            Recent chats
          </p>

          {conversations.map((conv) => {
            const isActive = conv.id === activeId;
            const title = getConversationTitle(conv.messages);
            const ts = formatTimestamp(conv.createdAt);
            return (
              <button
                key={conv.id}
                type="button"
                onClick={() => switchConversation(conv.id)}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "7px 9px",
                  borderRadius: "8px",
                  marginBottom: "4px",
                  background: isActive ? AXO.coralLight : "transparent",
                  border: isActive
                    ? "1px solid rgba(224,90,42,0.2)"
                    : "1px solid transparent",
                  cursor: "pointer",
                  transition: "background 0.12s, border-color 0.12s",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      AXO.coralLight;
                    (e.currentTarget as HTMLButtonElement).style.color =
                      AXO.coralText;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "transparent";
                    (e.currentTarget as HTMLButtonElement).style.color =
                      AXO.bodyText;
                  }
                }}
                aria-pressed={isActive}
                aria-label={`Conversation: ${title}`}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: "12px",
                    fontWeight: 500,
                    color: isActive ? AXO.coralText : AXO.bodyText,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    lineHeight: 1.3,
                  }}
                >
                  {title}
                </p>
                <p
                  style={{
                    margin: "2px 0 0",
                    fontFamily: "var(--font-dm-mono), monospace",
                    fontSize: "8.5px",
                    color: AXO.labelText,
                  }}
                >
                  {ts}
                </p>
              </button>
            );
          })}
        </div>

        {/* New conversation button */}
        <div style={{ padding: "12px 10px" }}>
          <button
            type="button"
            onClick={startNewConversation}
            style={{
              width: "100%",
              padding: "9px 0",
              borderRadius: "20px",
              background: AXO.coral,
              border: "none",
              color: "white",
              fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
              fontWeight: 500,
              fontSize: "12px",
              cursor: "pointer",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                AXO.coralHover;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = AXO.coral;
            }}
            aria-label="Start a new conversation"
          >
            New conversation
          </button>
        </div>
      </aside>

      {/* ── Main area ── */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          background: AXO.pageBg,
        }}
        aria-label="Chat with Axo"
      >
        {/* Header bar */}
        <div
          style={{
            padding: "12px 24px",
            background: AXO.surface,
            borderBottom: `1px solid ${AXO.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-lora), Georgia, serif",
              fontStyle: "italic",
              fontWeight: 700,
              fontSize: "15px",
              color: AXO.coralText,
            }}
          >
            Ask Axo anything
          </span>
          <span
            style={{
              fontFamily: "var(--font-dm-mono), monospace",
              fontSize: "9px",
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              color: AXO.coralText,
              background: AXO.coralLight,
              padding: "4px 10px",
              borderRadius: "20px",
            }}
          >
            STAAR — {STAAR_DATE}
          </span>
        </div>

        {/* Messages / empty state */}
        <div
          ref={listRef}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "24px 28px",
            scrollbarWidth: "thin",
            scrollbarColor: `${AXO.border} transparent`,
          }}
          aria-live="polite"
          aria-label="Conversation messages"
        >
          {!hasMessages && !error && <AxoWelcomeState onSend={sendMessage} />}

          {activeMessages.map((msg, i) => {
            const isLast = i === activeMessages.length - 1;
            const isTyping =
              isLast &&
              msg.role === "assistant" &&
              msg.content === "" &&
              streaming;
            return (
              <motion.div
                key={`${activeId}-${i}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MessageBubble
                  entry={msg}
                  isTyping={isTyping}
                  waitingLong={waitingLong}
                />
              </motion.div>
            );
          })}

          {error && (
            <div
              role="alert"
              style={{
                marginTop: "12px",
                padding: "12px 16px",
                borderRadius: "12px",
                fontSize: "13px",
                background: "#fff0ed",
                border: `1px solid ${AXO.coral}`,
                color: AXO.coralDark,
              }}
            >
              <strong>Error:</strong> {error}
            </div>
          )}
        </div>

        {/* Input area */}
        <div
          style={{
            padding: "12px 24px 16px",
            background: AXO.surface,
            borderTop: `1px solid ${AXO.border}`,
            flexShrink: 0,
          }}
        >
          {/* Quick-reply chips — shown only after first message sent */}
          <AnimatePresence>
            {hasMessages && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "6px",
                  marginBottom: "10px",
                }}
              >
                {QUICK_REPLY_CHIPS.map((chip) => (
                  <QuickChip
                    key={chip}
                    label={chip}
                    onSend={sendMessage}
                    disabled={streaming}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input row */}
          <InputRow
            inputText={inputText}
            setInputText={setInputText}
            onSend={sendMessage}
            onKeyDown={handleKeyDown}
            streaming={streaming}
            inputRef={inputRef}
          />

          {/* Character count */}
          <p
            style={{
              margin: "5px 0 0",
              fontFamily: "var(--font-dm-mono), monospace",
              fontSize: "9px",
              color: AXO.labelText,
              textAlign: "right",
            }}
            aria-live="polite"
            aria-label={`${inputText.length} of ${MAX_MESSAGE_LENGTH} characters`}
          >
            {inputText.length} / {MAX_MESSAGE_LENGTH}
          </p>
        </div>
      </main>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function AxoWelcomeState({ onSend }: { onSend: (text: string) => void }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        minHeight: "320px",
        textAlign: "center",
        padding: "0 24px",
      }}
    >
      <AxoAvatar size={52} />
      <div style={{ height: "8px" }} />
      <p
        style={{
          margin: 0,
          fontFamily: "var(--font-lora), Georgia, serif",
          fontStyle: "italic",
          fontWeight: 700,
          fontSize: "18px",
          color: AXO.coralText,
        }}
      >
        Hey, what are we working on?
      </p>
      <p
        style={{
          margin: "8px 0 24px",
          fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
          fontSize: "12.5px",
          color: AXO.subText,
          lineHeight: 1.5,
          maxWidth: "340px",
        }}
      >
        Ask me anything — concepts, practice questions, STAAR prep.
      </p>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "8px",
          maxWidth: "420px",
        }}
      >
        {STARTER_CHIPS.map((chip) => (
          <StarterChip key={chip.label} chip={chip} onSend={onSend} />
        ))}
      </div>
    </div>
  );
}

function StarterChip({
  chip,
  onSend,
}: {
  chip: { label: string; value: string };
  onSend: (text: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      onClick={() => onSend(chip.value)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "8px 16px",
        borderRadius: "20px",
        background: hovered ? AXO.coralLight : AXO.surface,
        border: hovered
          ? "1px solid rgba(224,90,42,0.25)"
          : `1px solid ${AXO.border}`,
        color: AXO.coralText,
        fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
        fontWeight: 500,
        fontSize: "12px",
        cursor: "pointer",
        transition: "background 0.12s, border-color 0.12s",
      }}
    >
      {chip.label}
    </button>
  );
}

function QuickChip({
  label,
  onSend,
  disabled,
}: {
  label: string;
  onSend: (text: string) => void;
  disabled: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      onClick={() => !disabled && onSend(label)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      disabled={disabled}
      style={{
        padding: "5px 12px",
        borderRadius: "20px",
        background: hovered ? "#f9d0c0" : AXO.coralLight,
        border: "1px solid rgba(224,90,42,0.15)",
        color: AXO.coralText,
        fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
        fontSize: "11px",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "background 0.12s",
      }}
      aria-label={`Quick reply: ${label}`}
    >
      {label}
    </button>
  );
}

function MessageBubble({
  entry,
  isTyping,
  waitingLong,
}: {
  entry: ChatEntry;
  isTyping: boolean;
  waitingLong: boolean;
}) {
  const isUser = entry.role === "user";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        alignItems: "flex-end",
        gap: "8px",
        marginBottom: "14px",
      }}
    >
      {!isUser && <AxoAvatar size={26} />}

      {isTyping ? (
        <TypingIndicator waitingLong={waitingLong} />
      ) : (
        <div
          style={{
            maxWidth: "72%",
            padding: "11px 15px",
            borderRadius: isUser
              ? "14px 14px 4px 14px"
              : "4px 14px 14px 14px",
            background: isUser ? AXO.coral : AXO.surface,
            border: isUser ? "none" : `1px solid ${AXO.border}`,
            color: isUser ? "white" : AXO.bodyText,
            fontSize: "13.5px",
            lineHeight: 1.6,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {entry.content}
        </div>
      )}
    </div>
  );
}

function TypingIndicator({ waitingLong }: { waitingLong: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "12px 14px",
        background: AXO.surface,
        border: `1px solid ${AXO.border}`,
        borderRadius: "4px 14px 14px 14px",
      }}
      aria-label="Axo is typing"
      role="status"
    >
      <style>{`
        @keyframes axo-bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.35; }
          30% { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes axo-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
      <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
        {[0, 0.2, 0.4].map((delay, i) => (
          <span
            key={i}
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: AXO.coral,
              display: "inline-block",
              animation: `axo-bounce 1.3s ease-in-out ${delay}s infinite`,
            }}
          />
        ))}
      </div>
      <span
        style={{
          fontFamily: "var(--font-dm-mono), monospace",
          fontSize: "9.5px",
          color: AXO.labelText,
          animation: "axo-pulse 2s ease-in-out infinite",
        }}
      >
        {waitingLong ? "Almost there — hang tight" : "Axo is thinking..."}
      </span>
    </div>
  );
}

function InputRow({
  inputText,
  setInputText,
  onSend,
  onKeyDown,
  streaming,
  inputRef,
}: {
  inputText: string;
  setInputText: (v: string) => void;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  streaming: boolean;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
}) {
  const [focused, setFocused] = useState(false);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const el = e.target;
    // Auto-grow
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 80)}px`;
    setInputText(el.value);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: "8px",
        background: AXO.pageBg,
        border: focused
          ? "1.5px solid rgba(224,90,42,0.4)"
          : `1.5px solid ${AXO.border}`,
        borderRadius: "12px",
        padding: "9px 9px 9px 14px",
        transition: "border-color 0.15s",
      }}
    >
      <textarea
        ref={inputRef}
        value={inputText}
        onChange={handleInput}
        onKeyDown={onKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Ask anything about biology..."
        maxLength={MAX_MESSAGE_LENGTH}
        disabled={streaming}
        rows={1}
        aria-label="Message input"
        style={{
          flex: 1,
          resize: "none",
          background: "transparent",
          border: "none",
          outline: "none",
          fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
          fontSize: "13px",
          color: AXO.bodyText,
          lineHeight: 1.5,
          minHeight: "20px",
          maxHeight: "80px",
          overflowY: "auto",
        }}
      />
      <button
        type="button"
        onClick={onSend}
        disabled={!inputText.trim() || streaming}
        aria-label="Send message"
        style={{
          width: "32px",
          height: "32px",
          flexShrink: 0,
          borderRadius: "50%",
          background:
            !inputText.trim() || streaming
              ? "rgba(224,90,42,0.25)"
              : AXO.coral,
          border: "none",
          cursor: !inputText.trim() || streaming ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) => {
          if (inputText.trim() && !streaming) {
            (e.currentTarget as HTMLButtonElement).style.background =
              AXO.coralHover;
          }
        }}
        onMouseLeave={(e) => {
          if (inputText.trim() && !streaming) {
            (e.currentTarget as HTMLButtonElement).style.background = AXO.coral;
          }
        }}
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      </button>
    </div>
  );
}
