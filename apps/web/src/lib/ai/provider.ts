/**
 * provider.ts
 *
 * Unified AI provider for BioSpark.
 *
 * All API routes that need an LLM go through `generateBioResponse`.
 * To switch models, change the model string in `generateBioResponse`
 * (currently `"gemini-1.5-flash"`) — no other files need to change.
 *
 * Current backend: Gemini 1.5 Flash via the Vercel AI SDK Google provider.
 * Previous backend: Anthropic Claude (claude-sonnet-4-20250514).
 */

import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface BioResponseOptions {
  /** System prompt / persona. */
  system: string;
  /** Ordered conversation history + the latest user message at the end. */
  messages: ChatMessage[];
  /**
   * Maximum output tokens to generate.
   * @default 300
   */
  maxOutputTokens?: number;
}

// ---------------------------------------------------------------------------
// Singleton provider
// ---------------------------------------------------------------------------

let _provider: ReturnType<typeof createGoogleGenerativeAI> | null = null;

function getProvider(): ReturnType<typeof createGoogleGenerativeAI> {
  if (_provider) return _provider;
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_GENERATIVE_AI_API_KEY environment variable is not set.");
  }
  _provider = createGoogleGenerativeAI({ apiKey });
  return _provider;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Stream a BioSpark AI response.
 *
 * Returns an `AsyncIterable<string>` of text deltas, identical in shape to
 * what the old Anthropic streaming loop produced, so existing callers only
 * need to swap the call site — not the streaming consumer.
 *
 * @example
 * ```ts
 * const stream = await generateBioResponse({ system, messages });
 * for await (const chunk of stream) {
 *   controller.enqueue(encoder.encode(chunk));
 * }
 * ```
 */
export async function generateBioResponse(
  options: BioResponseOptions,
): Promise<AsyncIterable<string>> {
  const { system, messages, maxOutputTokens = 300 } = options;

  const provider = getProvider();
  const model = provider("gemini-1.5-flash");

  const result = await streamText({
    model,
    system,
    messages,
    maxOutputTokens,
  });

  return result.textStream;
}
