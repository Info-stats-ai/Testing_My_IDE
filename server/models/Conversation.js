const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  { role: { type: String, enum: ["user", "assistant"], required: true }, text: { type: String, required: true }, intent: String },
  { timestamps: true },
);

module.exports = mongoose.model("Conversation", new mongoose.Schema({ messages: [messageSchema] }, { timestamps: true }));
