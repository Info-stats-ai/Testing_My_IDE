import { useState } from "react";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");

  async function send(event) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    setMessages((previous) => [...previous, { role: "user", text }]);
    const response = await fetch("/api/chat", {
      method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ message: text }),
    });
    const data = await response.json();
    setMessages((previous) => [...previous, { role: "assistant", text: data.reply ?? data.error, intent: data.intent }]);
  }

  return (
    <div className="chat">
      {messages.map((message, index) => (
        <p key={index} className={message.role}>{message.text}{message.intent && <small> · {message.intent}</small>}</p>
      ))}
      <form onSubmit={send}>
        <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="How can we help?" />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
