export function validateChatRequest(req, res, next) {
  const { message } = req.body ?? {};

  if (typeof message !== "string" || !message.trim()) {
    return res.status(400).json({
      error: "Invalid request body. 'message' must be a non-empty string."
    });
  }

  if (message.length > 8_000) {
    return res.status(400).json({
      error: "Message is too long. Maximum length is 8000 characters."
    });
  }

  return next();
}
