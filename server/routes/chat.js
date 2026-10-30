const express = require("express");

// `store` saves conversations and `askAgent` calls the Python agent; both are
// injected so the route can run against Mongo in production and fakes in tests.
module.exports = function chatRoutes({ store, askAgent }) {
  const router = express.Router();
  router.post("/", async (req, res) => {
    const text = (req.body && req.body.message || "").trim();
    if (!text) return res.status(400).json({ error: "message is required" });
    try {
      const { intent, reply } = await askAgent(text);
      const conversation = await store.save([
        { role: "user", text, intent },
        { role: "assistant", text: reply, intent },
      ]);
      res.json({ conversationId: conversation.id, intent, reply });
    } catch (error) {
      res.status(502).json({ error: "the agent is unavailable" });
    }
  });
  return router;
};
