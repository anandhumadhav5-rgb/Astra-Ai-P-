import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: Number(import.meta.env.VITE_API_TIMEOUT_MS || 120000),
  headers: {
    "Content-Type": "application/json"
  }
});

function safeJsonParse(value) {
  if (typeof value !== "string") {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function parseSseBlock(block) {
  const lines = block.split(/\r?\n/);
  let eventName = "";
  const dataLines = [];

  for (const line of lines) {
    if (!line.trim()) {
      continue;
    }

    if (line.startsWith("event:")) {
      eventName = line.slice("event:".length).trim();
      continue;
    }

    if (line.startsWith("data:")) {
      dataLines.push(line.slice("data:".length).trimStart());
    }
  }

  if (!dataLines.length) {
    return null;
  }

  return {
    eventName,
    payload: safeJsonParse(dataLines.join("\n"))
  };
}

function dispatchSseEvent(parsedEvent, handlers) {
  if (!parsedEvent) {
    return;
  }

  const { eventName, payload } = parsedEvent;

  if (eventName === "token") {
    const token = payload?.token;
    if (typeof token === "string" && token) {
      handlers.onToken?.(token);
    }
    return;
  }

  if (eventName === "error") {
    const message =
      payload?.message || "The backend returned an error while streaming the response.";
    handlers.onStreamError?.(new Error(message));
    return;
  }

  if (eventName === "done") {
    handlers.onDone?.();
  }
}

function consumeSseChunk(chunk, state, handlers) {
  if (!chunk) {
    return;
  }

  state.buffer += chunk;
  const blocks = state.buffer.split(/\r?\n\r?\n/);
  state.buffer = blocks.pop() || "";

  for (const block of blocks) {
    dispatchSseEvent(parseSseBlock(block), handlers);
  }
}

function toChatError(error) {
  if (axios.isCancel(error) || error?.code === "ERR_CANCELED") {
    return new Error("Request was cancelled.");
  }

  const serverError = error?.response?.data?.error;
  if (typeof serverError === "string" && serverError) {
    return new Error(serverError);
  }

  if (typeof error?.message === "string" && error.message) {
    return new Error(error.message);
  }

  return new Error("Unable to reach the chatbot backend.");
}

export async function streamChatResponse(message, options = {}) {
  const streamState = { buffer: "", consumedLength: 0 };
  let streamError = null;

  try {
    const response = await apiClient.post(
      "/chat",
      { message },
      {
        signal: options.signal,
        headers: {
          Accept: "text/event-stream"
        },
        responseType: "text",
        onDownloadProgress: (progressEvent) => {
          const nativeEvent = progressEvent?.event;
          const target =
            nativeEvent?.target ||
            nativeEvent?.currentTarget ||
            progressEvent?.target ||
            progressEvent?.currentTarget;

          const responseText =
            typeof target?.responseText === "string" ? target.responseText : "";

          if (!responseText) {
            return;
          }

          const freshChunk = responseText.slice(streamState.consumedLength);
          streamState.consumedLength = responseText.length;

          consumeSseChunk(freshChunk, streamState, {
            onToken: options.onToken,
            onDone: options.onDone,
            onStreamError: (error) => {
              streamError = error;
            }
          });
        }
      }
    );

    if (typeof response.data === "string" && response.data.length > streamState.consumedLength) {
      const tail = response.data.slice(streamState.consumedLength);
      streamState.consumedLength = response.data.length;
      consumeSseChunk(tail, streamState, {
        onToken: options.onToken,
        onDone: options.onDone,
        onStreamError: (error) => {
          streamError = error;
        }
      });
    }

    if (streamState.buffer.trim()) {
      dispatchSseEvent(parseSseBlock(streamState.buffer), {
        onToken: options.onToken,
        onDone: options.onDone,
        onStreamError: (error) => {
          streamError = error;
        }
      });
    }

    if (streamError) {
      throw streamError;
    }
  } catch (error) {
    throw toChatError(error);
  }
}
