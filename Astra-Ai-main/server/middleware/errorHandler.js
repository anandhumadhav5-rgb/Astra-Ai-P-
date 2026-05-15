export function errorHandler(error, _req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  const statusCode = Number(error.statusCode || error.status || 500);
  const isProduction = process.env.NODE_ENV === "production";

  const payload = {
    error: error.message || "Internal server error"
  };

  if (!isProduction) {
    payload.stack = error.stack;
  }

  return res.status(statusCode).json(payload);
}
