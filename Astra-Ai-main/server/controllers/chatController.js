import { streamChatCompletion } from "../services/openaiService.js";

function writeSseEvent(res, eventName, payload) {
  if (eventName) {
    res.write(`event: ${eventName}\n`);
  }

  res.write(`data: ${JSON.stringify(payload)}\n\n`);
}

export async function postChat(req, res, next) {
  const { message } = req.body;
  const abortController = new AbortController();

  const onClientDisconnect = () => {
    if (!res.writableEnded) {
      abortController.abort();
    }
  };

  req.on("aborted", onClientDisconnect);
  res.on("close", onClientDisconnect);

  try {
    res.status(200);
    res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders?.();

    writeSseEvent(res, "start", { status: "streaming" });

    await streamChatCompletion({
      message,
      signal: abortController.signal,
      onToken: (token) => {
        if (!res.writableEnded) {
          writeSseEvent(res, "token", { token });
        }
      }
    });

    if (!res.writableEnded) {
      writeSseEvent(res, "done", { status: "completed" });
      res.end();
    }
  } catch (error) {
    if (abortController.signal.aborted) {
      if (!res.writableEnded) {
        writeSseEvent(res, "done", { status: "aborted" });
        res.end();
      }
      return;
    }

    if (res.headersSent && !res.writableEnded) {
      writeSseEvent(res, "error", {
        message: error.message || "Failed to generate response"
      });
      res.end();
      return;
    }

    next(error);
  } finally {
    req.off("aborted", onClientDisconnect);
    res.off("close", onClientDisconnect);
  }
}
