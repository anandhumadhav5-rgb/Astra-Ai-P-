import OpenAI from "openai";
import { auth as adminAuth } from "@/lib/firebase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

let cachedClient: OpenAI | null = null;

function getEnvValue(key: string, fallback = "") {
  const value = process.env[key];
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function getFirstNonEmptyEnvValue(keys: string[], fallback = "") {
  for (const key of keys) {
    const value = getEnvValue(key);
    if (value) {
      return value;
    }
  }

  return fallback;
}

function getOpenRouterClient() {
  if (cachedClient) {
    return cachedClient;
  }

  const apiKey = getFirstNonEmptyEnvValue(["GROQ_API_KEY", "OPENROUTER_API_KEY", "OPENAI_API_KEY"]);
  const baseURL = getFirstNonEmptyEnvValue(
    ["GROQ_BASE_URL", "OPENROUTER_BASE_URL", "OPENAI_BASE_URL"],
    "https://api.groq.com/openai/v1" // Default to Groq
  );
  const siteUrl = getEnvValue("OPENROUTER_SITE_URL");
  const appName = getEnvValue("OPENROUTER_APP_NAME");

  if (!apiKey) {
    throw new Error("GROQ_API_KEY is missing. Add it to your environment.");
  }

  const defaultHeaders: Record<string, string> = {};
  if (siteUrl) {
    defaultHeaders["HTTP-Referer"] = siteUrl;
  }
  if (appName) {
    defaultHeaders["X-Title"] = appName;
  }

  cachedClient = new OpenAI({
    apiKey,
    baseURL,
    ...(Object.keys(defaultHeaders).length ? { defaultHeaders } : {}),
    maxRetries: 2,
    timeout: 60_000
  });

  return cachedClient;
}

function normalizeContentParts(content: unknown) {
  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === "string") {
          return part;
        }

        if (part && typeof part === "object" && "text" in part && typeof part.text === "string") {
          return part.text;
        }

        if (part && typeof part === "object" && "content" in part && typeof part.content === "string") {
          return part.content;
        }

        return "";
      })
      .join("");
  }

  return "";
}

function formatSseEvent(eventName: string, payload: unknown) {
  return `event: ${eventName}\ndata: ${JSON.stringify(payload)}\n\n`;
}

export async function POST(request: Request) {
  // Authentication check
  const authHeader = request.headers.get("Authorization") || request.headers.get("X-Firebase-Auth");
  if (!authHeader?.startsWith("Bearer ")) {
    console.error("[chat/route] Missing or invalid Authorization header");
    return Response.json({ error: "Missing or invalid Authorization header." }, { status: 401 });
  }

  const token = authHeader.substring(7);
  let decodedToken;
  
  try {
    decodedToken = await adminAuth.verifyIdToken(token);
  } catch (error) {
    console.error("Token verification failed:", error);
    return Response.json({ error: "Authentication failed. Please sign in again." }, { status: 401 });
  }

  // User is authenticated, we can use decodedToken.uid if needed
  const userId = decodedToken.uid;

  let body: { message?: unknown };

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON request body." }, { status: 400 });
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!message) {
    return Response.json({ error: "Invalid request body. 'message' must be a non-empty string." }, { status: 400 });
  }

  if (message.length > 8_000) {
    return Response.json({ error: "Message is too long. Maximum length is 8000 characters." }, { status: 400 });
  }

  const encoder = new TextEncoder();
  const client = getOpenRouterClient();
  const model = getFirstNonEmptyEnvValue(["GROQ_MODEL", "OPENROUTER_MODEL", "OPENAI_MODEL"], "llama-3.3-70b-versatile");
  const systemPrompt = getFirstNonEmptyEnvValue(
    ["OPENROUTER_SYSTEM_PROMPT", "OPENAI_SYSTEM_PROMPT"],
    "You are a helpful AI assistant."
  );

  const stream = new ReadableStream({
    async start(controller) {
      const send = (eventName: string, payload: unknown) => {
        controller.enqueue(encoder.encode(formatSseEvent(eventName, payload)));
      };

      try {
        send("start", { status: "streaming" });

        const completionStream = await client.chat.completions.create({
          model,
          temperature: 0.7,
          stream: true,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message }
          ]
        });

        let emittedAnyToken = false;

        for await (const chunk of completionStream) {
          const choice = chunk.choices?.[0] as
            | {
                delta?: {
                  content?: unknown;
                  reasoning_content?: unknown;
                };
                text?: unknown;
              }
            | undefined;
          const delta = choice?.delta;
          const token =
            normalizeContentParts(delta?.content) ||
            (typeof delta?.reasoning_content === "string" ? delta.reasoning_content : "") ||
            (typeof choice?.text === "string" ? choice.text : "");

          if (token) {
            emittedAnyToken = true;
            send("token", { token });
          }
        }

        if (!emittedAnyToken) {
          send("token", { token: "I could not generate a response for that request." });
        }

        send("done", { status: "completed" });
      } catch (error) {
        send("error", {
          message: error instanceof Error ? error.message : "Failed to generate response."
        });
      } finally {
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no"
    }
  });
}
