const test = require("node:test");
const assert = require("node:assert");
const createApp = require("./app");

function start(dependencies) {
  return new Promise((resolve) => {
    const server = createApp(dependencies).listen(0, () => resolve(server));
  });
}

test("chat saves both turns and returns the agent's reply", async () => {
  const saved = [];
  const server = await start({
    store: { save: async (messages) => { saved.push(...messages); return { id: "c1" }; } },
    askAgent: async () => ({ intent: "billing", reply: "ticket opened" }),
  });
  const response = await fetch(`http://localhost:${server.address().port}/api/chat`, {
    method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ message: "refund me" }),
  });
  server.close();
  assert.strictEqual(response.status, 200);
  assert.deepStrictEqual(await response.json(), { conversationId: "c1", intent: "billing", reply: "ticket opened" });
  assert.strictEqual(saved.length, 2);
});

test("empty messages are rejected", async () => {
  const server = await start({ store: {}, askAgent: async () => ({}) });
  const response = await fetch(`http://localhost:${server.address().port}/api/chat`, {
    method: "POST", headers: { "content-type": "application/json" }, body: "{}",
  });
  server.close();
  assert.strictEqual(response.status, 400);
});
