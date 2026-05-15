import "dotenv/config";
import app from "./app.js";

const port = Number(process.env.PORT) || 8000;

const server = app.listen(port, () => {
  console.log(`AI chatbot backend listening on port ${port}`);
});

function shutdown(signal) {
  console.log(`${signal} received. Closing server...`);
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
