import { NextRequest, NextResponse } from "next/server";
import type { TutorChatRequest, TutorChatResponse } from "@/types/tutor";
import { LEARNING_UNITS } from "@/lib/learningHubContent";
import {
  buildTutorSystemPrompt,
  buildGlobalTutorSystemPrompt,
} from "@/lib/tutor";
import {
  computeInterventionTier,
  deriveLearningLevel,
} from "@/lib/intelligence";
import { generateBioResponse } from "@/lib/ai/provider";

export const runtime = "nodejs";

const MAX_MESSAGE_CHARS = 500;
const MAX_HISTORY_ENTRIES = 20;

/**
 * Find a lesson across all curriculum units by its slug.
 * Returns undefined if no lesson matches.
 */
function findLessonBySlug(lessonSlug: string) {
  for (const unit of LEARNING_UNITS) {
    const lesson = unit.lessons.find((l) => l.slug === lessonSlug);
    if (lesson) return { unit, lesson };
  }
  return undefined;
}

/**
 * Fetch the student's mastery records.
 * Returns both:
 * - `contextString`: human-readable TEKS summary for the system prompt
 * - `rawMap`: raw score map for deriving learningLevel / interventionTier
 *
 * Returns null values if the fetch fails or no records exist.
 */
async function fetchMasteryData(
  studentId: string,
  baseUrl: string,
): Promise<{ contextString: string | null; rawMap: Record<string, number> | null }> {
  try {
    const url = new URL("/api/mastery", baseUrl);
    url.searchParams.set("studentId", studentId);
    const res = await fetch(url.toString());
    if (!res.ok) return { contextString: null, rawMap: null };
    const data = (await res.json()) as Record<string, number>;
    const entries = Object.entries(data);
    if (entries.length === 0) return { contextString: null, rawMap: null };
    const contextString = entries
      .map(([teks, score]) => {
        const pct = Math.round(score * 100);
        const level =
          pct >= 80 ? "Proficient" : pct >= 60 ? "Progressing" : "Developing";
        return `${teks}: ${pct}% (${level})`;
      })
      .join(", ");
    return { contextString, rawMap: data };
  } catch {
    return { contextString: null, rawMap: null };
  }
}

// ---------------------------------------------------------------------------
// POST /api/tutor/chat
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  // ------------------------------------------------------------------
  // 1. Auth check — student role required.
  // ------------------------------------------------------------------
  const studentIdHeader = req.headers.get("x-student-id")?.trim();
  if (!studentIdHeader) {
    return NextResponse.json(
      {
        error: "unauthorized",
        message:
          "A valid x-student-id header is required to access the tutor.",
      },
      { status: 401 },
    );
  }

  // ------------------------------------------------------------------
  // 2. Parse and validate request body
  // ------------------------------------------------------------------
  let body: TutorChatRequest;
  try {
    body = (await req.json()) as TutorChatRequest;
  } catch {
    return NextResponse.json(
      { error: "invalid_json", message: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  const { message, lessonSlug, studentId, conversationHistory, triggeredBy, unitId, systemPrompt: clientSystemPrompt } =
    body;

  // Ensure the authenticated header identity matches the request body identity
  if (studentId !== studentIdHeader) {
    return NextResponse.json(
      {
        error: "unauthorized",
        message: "studentId in the request body must match the x-student-id header.",
      },
      { status: 401 },
    );
  }
  if (!message || message.trim() === "") {
    return NextResponse.json(
      { error: "invalid_message", message: "message must not be empty." },
      { status: 400 },
    );
  }

  if (message.length > MAX_MESSAGE_CHARS) {
    return NextResponse.json(
      {
        error: "message_too_long",
        message: `message must be ${MAX_MESSAGE_CHARS} characters or fewer.`,
      },
      { status: 400 },
    );
  }

  if (!Array.isArray(conversationHistory)) {
    return NextResponse.json(
      {
        error: "invalid_history",
        message: "conversationHistory must be an array.",
      },
      { status: 400 },
    );
  }

  if (conversationHistory.length > MAX_HISTORY_ENTRIES) {
    return NextResponse.json(
      {
        error: "history_too_long",
        message: `conversationHistory must have at most ${MAX_HISTORY_ENTRIES} entries.`,
      },
      { status: 400 },
    );
  }

  // ------------------------------------------------------------------
  // 3. Resolve lesson context vs. global context
  // ------------------------------------------------------------------

  // If the client provides its own system prompt, use it directly
  // and skip server-side prompt building entirely (used by the Axo page).
  if (clientSystemPrompt) {
    const messagesForAI: Array<{ role: "user" | "assistant"; content: string }> = [
      ...conversationHistory.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      { role: "user" as const, content: message },
    ];

    let textStream: AsyncIterable<string>;
    try {
      textStream = await generateBioResponse({
        system: clientSystemPrompt,
        messages: messagesForAI,
        maxOutputTokens: 350,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Configuration error.";
      return NextResponse.json(
        { error: "service_unavailable", message: msg },
        { status: 503 },
      );
    }

    const encoder = new TextEncoder();
    const metadata: TutorChatResponse = {
      interventionTier: null,
      lessonSlug: "general",
      teks: [],
    };

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of textStream) {
            const sanitised = chunk.replace(/\u2014/g, " - ");
            controller.enqueue(encoder.encode(sanitised));
          }
          const footer = `\n\n${JSON.stringify(metadata)}`;
          controller.enqueue(encoder.encode(footer));
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : "AI stream error.";
          controller.enqueue(encoder.encode(`\n\n${JSON.stringify({ error: msg })}`));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "X-Content-Type-Options": "nosniff",
      },
    });
  }

  const isGeneralMode = !lessonSlug || lessonSlug.trim() === "" || lessonSlug === "general";

  const baseUrl = `${req.nextUrl.protocol}//${req.nextUrl.host}`;
  const { contextString: masteryContext, rawMap: masteryRaw } =
    await fetchMasteryData(studentIdHeader, baseUrl);

  let systemPrompt: string;
  let responseTeks: string[] = [];
  let interventionTier: 2 | 3 | null = null;

  if (isGeneralMode) {
    // Global Tutor mode: use full curriculum roadmap as context
    systemPrompt = buildGlobalTutorSystemPrompt(
      LEARNING_UNITS,
      unitId,
      masteryContext ?? undefined,
    );
    responseTeks = [];
  } else {
    // Lesson-specific mode: resolve the lesson and build a targeted prompt
    const found = findLessonBySlug(lessonSlug);
    if (!found) {
      return NextResponse.json(
        {
          error: "lesson_not_found",
          message: `No lesson found with slug "${lessonSlug}".`,
        },
        { status: 400 },
      );
    }
    const { lesson } = found;
    responseTeks = lesson.teks ?? [];

    // ------------------------------------------------------------------
    // 4. Derive learningLevel and interventionTier from already-fetched mastery data
    // ------------------------------------------------------------------
    let learningLevel: "developing" | "progressing" | "proficient" | "advanced" =
      "developing";

    if (masteryRaw) {
      const teks = lesson.teks ?? [];
      if (teks.length > 0) {
        const firstTeksScore = masteryRaw[teks[0]];
        if (firstTeksScore !== undefined) {
          learningLevel = deriveLearningLevel(firstTeksScore * 100);
          interventionTier = computeInterventionTier(firstTeksScore, 0);
        }
      }
    }

    systemPrompt = buildTutorSystemPrompt(
      lesson,
      learningLevel,
      interventionTier,
      triggeredBy,
      masteryContext ?? undefined,
    );
  }

  // ------------------------------------------------------------------
  // 5. Stream the Gemini response back to the client
  // ------------------------------------------------------------------
  const messagesForAI: Array<{ role: "user" | "assistant"; content: string }> =
    [
      ...conversationHistory.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      { role: "user" as const, content: message },
    ];

  let textStream: AsyncIterable<string>;
  try {
    textStream = await generateBioResponse({
      system: systemPrompt,
      messages: messagesForAI,
      maxOutputTokens: 350,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Configuration error.";
    return NextResponse.json(
      { error: "service_unavailable", message: msg },
      { status: 503 },
    );
  }

  const encoder = new TextEncoder();

  const metadata: TutorChatResponse = {
    interventionTier,
    lessonSlug: lessonSlug ?? "general",
    teks: responseTeks,
  };

  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of textStream) {
          // Strip any em dashes that the model emits despite the system-prompt instruction
          const sanitised = chunk.replace(/\u2014/g, " - ");
          controller.enqueue(encoder.encode(sanitised));
        }

        // ------------------------------------------------------------------
        // 6. Append JSON metadata footer after the streamed text
        // ------------------------------------------------------------------
        const footer = `\n\n${JSON.stringify(metadata)}`;
        controller.enqueue(encoder.encode(footer));
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "AI stream error.";
        controller.enqueue(
          encoder.encode(`\n\n${JSON.stringify({ error: msg })}`),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
