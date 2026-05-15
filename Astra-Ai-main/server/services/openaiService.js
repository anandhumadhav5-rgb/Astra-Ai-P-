import OpenAI from "openai";

let cachedClient;

function getEnvValue(key, fallback = "") {
  const value = process.env[key];
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function getFirstNonEmptyEnvValue(keys, fallback = "") {
  for (const key of keys) {
    const value = getEnvValue(key);
    if (value) {
      return value;
    }
  }

  return fallback;
}

function getApiClient() {
  if (cachedClient) {
    return cachedClient;
  }

  const openRouterKey = getEnvValue("OPENROUTER_API_KEY");
  const openAiKey = getEnvValue("OPENAI_API_KEY");

  const apiKey = openRouterKey || openAiKey;
  let baseURL = getFirstNonEmptyEnvValue(["OPENROUTER_BASE_URL", "OPENAI_BASE_URL"]);

  if (!apiKey) {
    const error = new Error(
      "API Key is missing. Please add OPENROUTER_API_KEY or OPENAI_API_KEY to your environment."
    );
    error.statusCode = 500;
    throw error;
  }

  if (!baseURL) {
    baseURL = openRouterKey
      ? "https://openrouter.ai/api/v1"
      : "https://api.openai.com/v1";
  }

  const siteUrl = getEnvValue("OPENROUTER_SITE_URL");
  const appName = getEnvValue("OPENROUTER_APP_NAME");

  const defaultHeaders = {};
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

function normalizeContentParts(content) {
  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === "string") {
          return part;
        }

        if (typeof part?.text === "string") {
          return part.text;
        }

        if (typeof part?.content === "string") {
          return part.content;
        }

        return "";
      })
      .join("");
  }

  return "";
}

function extractTokenFromChunk(chunk) {
  const choice = chunk?.choices?.[0];
  const delta = choice?.delta;

  const deltaContent = normalizeContentParts(delta?.content);
  if (deltaContent) {
    return deltaContent;
  }

  if (typeof delta?.reasoning_content === "string" && delta.reasoning_content) {
    return delta.reasoning_content;
  }

  if (typeof choice?.text === "string" && choice.text) {
    return choice.text;
  }

  return "";
}

function extractFinalMessageContent(completion) {
  const message = completion?.choices?.[0]?.message;
  const content = normalizeContentParts(message?.content);
  return content || "";
}

export async function streamChatCompletion({ message, onToken, signal }) {
  const client = getApiClient();

  const openRouterKey = getEnvValue("OPENROUTER_API_KEY");
  const defaultModel = openRouterKey ? "openrouter/auto" : "gpt-4o-mini";

  const model = getFirstNonEmptyEnvValue(
    ["OPENROUTER_MODEL", "OPENAI_MODEL"],
    defaultModel
  );
  const systemPrompt = getFirstNonEmptyEnvValue(
    ["OPENROUTER_SYSTEM_PROMPT", "OPENAI_SYSTEM_PROMPT"],
    "You are a helpful AI assistant."
  );
  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: message }
  ];

  try {
    const stream = await client.chat.completions.create(
      {
        model,
        temperature: 0.7,
        stream: true,
        messages
      },
      { signal }
    );

    let emittedAnyToken = false;

    for await (const chunk of stream) {
      const token = extractTokenFromChunk(chunk);
      if (token) {
        emittedAnyToken = true;
        onToken(token);
      }
    }

    if (!emittedAnyToken) {
      const completion = await client.chat.completions.create(
        {
          model,
          temperature: 0.7,
          stream: false,
          messages
        },
        { signal }
      );

      const fallbackContent = extractFinalMessageContent(completion);
      if (!fallbackContent) {
        throw new Error("Model returned an empty response.");
      }

      onToken(fallbackContent);
    }
  } catch (error) {
    const normalizedError = new Error(
      error?.message || "API request failed."
    );
    normalizedError.statusCode = error?.status || error?.statusCode || 500;
    throw normalizedError;
  }
}
