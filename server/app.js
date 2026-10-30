const express = require("express");
const chatRoutes = require("./routes/chat");

module.exports = function createApp(dependencies) {
  const app = express();
  app.use(express.json());
  app.use("/api/chat", chatRoutes(dependencies));
  app.get("/health", (_req, res) => res.json({ ok: true }));
  return app;
};
