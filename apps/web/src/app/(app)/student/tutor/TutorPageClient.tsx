"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { TutorMessage, TutorChatResponse } from "@/types/tutor";
import { useStudentAuth } from "@/lib/studentAuth";

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

interface Props {
  units: UnitOption[];
}

// ── Stream helpers ─────────────────────────────────────────────────────────────

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

// ── Constants ─────────────────────────────────────────────────────────────────

const MAX_MESSAGE_LENGTH = 500;

const C = {
  bg: "#0d1e2c",
  surface: "#132638",
  header: "#1a3148",
  accent: "#00d4aa",
  accentDim: "rgba(0,212,170,0.12)",
  danger: "#ff6b6b",
  text: "#e8f4f0",
  textSub: "#9abcb0",
  textMuted: "#5a8070",
  border: "#1e3547",
  userBubble: "#00543f",
  userBubbleBorder: "#00d4aa",
  assistantBubble: "#132638",
  assistantBubbleBorder: "#1e3547",
  sidebar: "#101c28",
  sidebarBorder: "#182d40",
};

const SPARK = "✦";

// ── Main component ─────────────────────────────────────────────────────────────

export default function TutorPageClient({ units }: Props) {
  const { student } = useStudentAuth();
  const studentId = student?.id ?? "student";

  const [selectedUnitId, setSelectedUnitId] = useState<string>("general");
  const [messages, setMessages] = useState<ChatEntry[]>([]);
  const [inputText, setInputText] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const selectedUnit = units.find((u) => u.id === selectedUnitId) ?? null;

  const sendMessage = useCallback(async () => {
    const text = inputText.trim();
    if (!text || streaming) return;

    setError(null);
    setInputText("");

    const history: TutorMessage[] = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setStreaming(true);
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

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
          unitId: selectedUnitId === "general" ? undefined : selectedUnitId,
          studentId,
          conversationHistory: history,
          triggeredBy: "student",
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
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { role: "assistant", content: visible };
          return next;
        });
      }

      const meta = extractMetadata(accumulated);
      const visible = stripMetadataFooter(accumulated);
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = {
          role: "assistant",
          content: visible,
          metadata: meta ?? undefined,
        };
        return next;
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setError(msg);
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setStreaming(false);
      inputRef.current?.focus();
    }
  }, [inputText, messages, selectedUnitId, streaming, studentId]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage],
  );

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  // sidebar: conversation history grouped by unit label
  const historyItems = messages
    .filter((m) => m.role === "user")
    .slice(-12)
    .reverse();

  return (
    <div
      style={{
        display: "flex",
        height: "100dvh",
        width: "100%",
        background: C.bg,
        fontFamily: "DM Sans, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* ── Sidebar ── */}
      <aside
        style={{
          width: "260px",
          flexShrink: 0,
          background: C.sidebar,
          borderRight: `1px solid ${C.sidebarBorder}`,
          display: "flex",
          flexDirection: "column",
          padding: "0",
        }}
        aria-label="Conversation history and curriculum picker"
      >
        {/* Sidebar header */}
        <div
          style={{
            padding: "20px 18px 14px",
            borderBottom: `1px solid ${C.sidebarBorder}`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "4px",
            }}
          >
            <span style={{ fontSize: "18px", color: C.accent }} aria-hidden="true">
              {SPARK}
            </span>
            <span
              style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 700,
                fontSize: "15px",
                color: C.text,
              }}
            >
              BioSpark Tutor
            </span>
          </div>
          <p style={{ margin: 0, fontSize: "11px", color: C.textMuted }}>
            Global Biology Guide
          </p>
        </div>

        {/* Curriculum Picker */}
        <div
          style={{
            padding: "14px 18px",
            borderBottom: `1px solid ${C.sidebarBorder}`,
          }}
        >
          <label
            htmlFor="curriculum-picker"
            style={{
              display: "block",
              fontSize: "10px",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: C.textMuted,
              marginBottom: "8px",
            }}
          >
            Curriculum Context
          </label>
          <select
            id="curriculum-picker"
            value={selectedUnitId}
            onChange={(e) => {
              setSelectedUnitId(e.target.value);
              clearChat();
            }}
            style={{
              width: "100%",
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: "8px",
              padding: "8px 10px",
              fontSize: "12px",
              color: C.text,
              cursor: "pointer",
              outline: "none",
              appearance: "none",
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%235a8070'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 10px center",
              paddingRight: "28px",
            }}
            aria-label="Select curriculum context"
          >
            <option value="general">All Units (Full Roadmap)</option>
            {units.map((u) => (
              <option key={u.id} value={u.id}>
                Unit {u.unitNumber}: {u.title}
              </option>
            ))}
          </select>
          {selectedUnit && (
            <p
              style={{
                marginTop: "8px",
                fontSize: "10px",
                color: C.textMuted,
                lineHeight: 1.4,
              }}
            >
              Priority TEKS: {selectedUnit.teks.join(", ")}
            </p>
          )}
        </div>

        {/* Chat history */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "14px 18px",
            scrollbarWidth: "thin",
            scrollbarColor: `${C.border} transparent`,
          }}
        >
          <p
            style={{
              fontSize: "10px",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: C.textMuted,
              marginBottom: "10px",
            }}
          >
            Recent Questions
          </p>
          {historyItems.length === 0 ? (
            <p style={{ fontSize: "12px", color: C.textMuted, lineHeight: 1.5 }}>
              Your questions will appear here.
            </p>
          ) : (
            historyItems.map((m, i) => (
              <div
                key={i}
                style={{
                  padding: "8px 10px",
                  borderRadius: "8px",
                  marginBottom: "6px",
                  background: C.accentDim,
                  border: `1px solid ${C.border}`,
                  fontSize: "12px",
                  color: C.textSub,
                  lineHeight: 1.4,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                title={m.content}
              >
                {m.content}
              </div>
            ))
          )}
        </div>

        {/* New chat button */}
        <div style={{ padding: "14px 18px", borderTop: `1px solid ${C.sidebarBorder}` }}>
          <button
            type="button"
            onClick={clearChat}
            style={{
              width: "100%",
              padding: "9px",
              borderRadius: "8px",
              background: "transparent",
              border: `1px solid ${C.border}`,
              color: C.textSub,
              fontSize: "12px",
              cursor: "pointer",
              transition: "border-color 0.15s, color 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = C.accent;
              (e.currentTarget as HTMLButtonElement).style.color = C.accent;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = C.border;
              (e.currentTarget as HTMLButtonElement).style.color = C.textSub;
            }}
          >
            + New Conversation
          </button>
        </div>
      </aside>

      {/* ── Main conversation area ── */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
        aria-label="Tutor conversation"
      >
        {/* Top bar */}
        <div
          style={{
            padding: "16px 28px",
            borderBottom: `1px solid ${C.border}`,
            background: C.header,
            display: "flex",
            alignItems: "center",
            gap: "14px",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              background: C.accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              color: C.bg,
              flexShrink: 0,
              boxShadow: streaming
                ? "0 0 14px rgba(0,212,170,0.6), 0 0 0 2px rgba(0,212,170,0.3)"
                : "0 0 8px rgba(0,212,170,0.2)",
              transition: "box-shadow 0.3s ease",
            }}
            aria-hidden="true"
          >
            {SPARK}
          </div>
          <div>
            <h1
              style={{
                margin: 0,
                fontFamily: "Syne, sans-serif",
                fontWeight: 700,
                fontSize: "16px",
                color: C.text,
                lineHeight: 1.2,
              }}
            >
              {selectedUnit
                ? `Unit ${selectedUnit.unitNumber}: ${selectedUnit.title}`
                : "FBISD Biology — Full Curriculum"}
            </h1>
            <p style={{ margin: 0, fontSize: "12px", color: C.textMuted, marginTop: "2px" }}>
              {streaming ? (
                <span style={{ color: C.accent }}>Thinking...</span>
              ) : (
                "Ask me anything about your biology coursework"
              )}
            </p>
          </div>
        </div>

        {/* Messages */}
        <div
          ref={listRef}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "28px",
            maxWidth: "760px",
            width: "100%",
            margin: "0 auto",
            alignSelf: "center",
            boxSizing: "border-box",
            scrollbarWidth: "thin",
            scrollbarColor: `${C.border} transparent`,
          }}
          aria-live="polite"
        >
          {messages.length === 0 && !error && (
            <EmptyState
              unitTitle={
                selectedUnit
                  ? `Unit ${selectedUnit.unitNumber}: ${selectedUnit.title}`
                  : undefined
              }
            />
          )}

          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22 }}
            >
              <MessageBubble entry={msg} />
            </motion.div>
          ))}

          {error && (
            <div
              role="alert"
              style={{
                marginTop: "12px",
                padding: "12px 16px",
                borderRadius: "12px",
                fontSize: "13px",
                background: "#1a0d0d",
                border: `1px solid ${C.danger}`,
                color: C.danger,
              }}
            >
              <strong>Error:</strong> {error}
            </div>
          )}
        </div>

        {/* Input area */}
        <div
          style={{
            padding: "16px 28px 20px",
            borderTop: `1px solid ${C.border}`,
            background: C.header,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              maxWidth: "760px",
              margin: "0 auto",
              display: "flex",
              alignItems: "flex-end",
              gap: "10px",
            }}
          >
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                selectedUnit
                  ? `Ask about ${selectedUnit.title}...`
                  : "Ask anything about FBISD Biology..."
              }
              rows={2}
              maxLength={MAX_MESSAGE_LENGTH}
              disabled={streaming}
              aria-label="Message input"
              style={{
                flex: 1,
                resize: "none",
                background: C.bg,
                border: `1px solid ${C.border}`,
                borderRadius: "12px",
                padding: "12px 16px",
                fontSize: "14px",
                color: C.text,
                outline: "none",
                lineHeight: 1.5,
                fontFamily: "inherit",
              }}
            />
            <button
              type="button"
              onClick={sendMessage}
              disabled={!inputText.trim() || streaming}
              aria-label="Send message"
              style={{
                width: "44px",
                height: "44px",
                flexShrink: 0,
                borderRadius: "10px",
                background:
                  !inputText.trim() || streaming ? C.surface : C.accent,
                border: `1px solid ${!inputText.trim() || streaming ? C.border : C.accent}`,
                color: !inputText.trim() || streaming ? C.textMuted : C.bg,
                cursor: !inputText.trim() || streaming ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.15s, border-color 0.15s",
              }}
            >
              <SendIcon />
            </button>
          </div>
          <p
            style={{
              maxWidth: "760px",
              margin: "6px auto 0",
              fontSize: "11px",
              color: C.textMuted,
              textAlign: "right",
            }}
          >
            {inputText.length}/{MAX_MESSAGE_LENGTH}
          </p>
        </div>
      </main>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function EmptyState({ unitTitle }: { unitTitle?: string }) {
  const suggestions = unitTitle
    ? [
        `What should I focus on in ${unitTitle}?`,
        "Can you give me a Texas example for this?",
        "How does this connect to what I learned before?",
      ]
    : [
        "What are we learning this year in Biology?",
        "How does Unit 1 connect to Unit 2?",
        "What TEKS do I need to master first?",
      ];

  return (
    <div style={{ textAlign: "center", paddingTop: "60px" }}>
      <div
        style={{
          width: "64px",
          height: "64px",
          borderRadius: "18px",
          background: C.accentDim,
          border: `1px solid rgba(0,212,170,0.2)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "28px",
          color: C.accent,
          margin: "0 auto 18px",
        }}
        aria-hidden="true"
      >
        {SPARK}
      </div>
      <h2
        style={{
          fontFamily: "Syne, sans-serif",
          fontWeight: 700,
          fontSize: "20px",
          color: C.text,
          margin: "0 0 8px",
        }}
      >
        {unitTitle ? `Ready to explore ${unitTitle}` : "BioSpark Global Tutor"}
      </h2>
      <p style={{ fontSize: "14px", color: C.textMuted, margin: "0 0 28px", lineHeight: 1.5 }}>
        {unitTitle
          ? "Ask me anything about this unit. I will use Texas-centered examples to help you connect the concepts."
          : "Ask anything about the FBISD Biology curriculum. I will guide you using Texas examples and Socratic questions."}
      </p>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          maxWidth: "400px",
          margin: "0 auto",
        }}
      >
        {suggestions.map((s, i) => (
          <div
            key={i}
            style={{
              padding: "10px 16px",
              borderRadius: "10px",
              background: C.surface,
              border: `1px solid ${C.border}`,
              fontSize: "13px",
              color: C.textSub,
              textAlign: "left",
              lineHeight: 1.4,
            }}
          >
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}

function MessageBubble({ entry }: { entry: ChatEntry }) {
  const isUser = entry.role === "user";
  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: "14px",
      }}
    >
      <div
        style={{
          maxWidth: "78%",
          padding: "12px 16px",
          borderRadius: isUser ? "18px 18px 4px 18px" : "4px 18px 18px 18px",
          background: isUser ? C.userBubble : C.assistantBubble,
          border: `1px solid ${isUser ? C.userBubbleBorder : C.assistantBubbleBorder}`,
          fontSize: "14px",
          color: C.text,
          lineHeight: 1.6,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {entry.content || (
          <span
            style={{ color: C.textMuted, fontSize: "12px" }}
            aria-label="Typing"
          >
            ●●●
          </span>
        )}
      </div>
    </div>
  );
}

function SendIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}
