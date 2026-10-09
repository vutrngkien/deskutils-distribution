import { afterEach, beforeEach, test } from "node:test";
import assert from "node:assert/strict";
import webhook from "../api/webhook.mjs";
import goal from "../api/goal.mjs";
import { centsFromAmount, configuration } from "../lib/goal.mjs";

const originalEnv = { ...process.env };
const originalFetch = globalThis.fetch;
let commands;
let result;

beforeEach(() => {
  Object.assign(process.env, {
    KOFI_VERIFICATION_TOKEN: "test-secret",
    UPSTASH_REDIS_REST_URL: "https://example.upstash.io",
    UPSTASH_REDIS_REST_TOKEN: "test-storage-secret",
    KOFI_GOAL_START_AT: "2026-01-01T00:00:00Z",
    KOFI_GOAL_ID: "apple-developer-year-one",
    KOFI_ACCEPT_PAYMENTS: "true",
  });
  commands = [];
  result = 1;
  globalThis.fetch = async (url, options) => {
    assert.equal(url, "https://example.upstash.io");
    assert.equal(options.headers.Authorization, "Bearer test-storage-secret");
    commands.push(JSON.parse(options.body));
    return Response.json({ result });
  };
});

afterEach(() => {
  for (const name of Object.keys(process.env))
    if (!(name in originalEnv)) delete process.env[name];
  Object.assign(process.env, originalEnv);
  globalThis.fetch = originalFetch;
});

function payment(overrides = {}) {
  const event = {
    verification_token: "test-secret",
    type: "Donation",
    currency: "USD",
    amount: "2.00",
    timestamp: "2026-01-02T00:00:00Z",
    kofi_transaction_id: "transaction-123",
    message_id: "message-1",
    from_name: "Private supporter",
    email: "private@example.com",
    message: "Private message",
    is_public: false,
    ...overrides,
  };
  return new Request("https://sync.example/api/webhook", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ data: JSON.stringify(event) }),
  });
}

test("Vercel marketplace credentials configure Redis without copying secrets", () => {
  const env = {
    ...process.env,
    UPSTASH_REDIS_REST_URL: undefined,
    UPSTASH_REDIS_REST_TOKEN: undefined,
    KV_REST_API_URL: "https://marketplace.upstash.io",
    KV_REST_API_TOKEN: "marketplace-secret",
  };
  const config = configuration(env);
  assert.equal(config.redisURL, "https://marketplace.upstash.io");
  assert.equal(config.redisToken, "marketplace-secret");
});

test("real tips are recorded once by transaction ID, without supporter details", async () => {
  const response = await webhook.fetch(payment());
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true, status: "accepted" });
  assert.equal(commands.length, 1);
  const command = commands[0];
  assert.equal(command[0], "EVAL");
  assert.equal(command[2], "1");
  assert.deepEqual(command.slice(5), [
    "transaction-123",
    "200",
    String(Date.parse("2026-01-02T00:00:00Z")),
  ]);
  assert(!JSON.stringify(command).includes("private@example.com"));
  assert(!JSON.stringify(command).includes("Private supporter"));
  assert(!JSON.stringify(command).includes("Private message"));
  assert(!JSON.stringify(command).includes("test-secret"));
  // Redis reports an already-recorded transaction, even with a new message ID.
  result = 0;
  assert.deepEqual(
    await (await webhook.fetch(payment({ message_id: "retry-2" }))).json(),
    { ok: true, status: "duplicate" },
  );
  assert.equal(commands[1][5], "transaction-123");
});

test("invalid verification never reaches storage", async () => {
  const response = await webhook.fetch(
    payment({ verification_token: "wrong" }),
  );
  assert.equal(response.status, 401);
  assert.equal(commands.length, 0);
});

test("Ko-fi's current Tip event contributes to the goal", async () => {
  const response = await webhook.fetch(payment({ type: "Tip" }));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true, status: "accepted" });
  assert.equal(commands.length, 1);
});

test("shop sales, other currencies and deliveries before the baseline are excluded", async () => {
  for (const overrides of [
    { type: "Shop Order" },
    { currency: "EUR" },
    { timestamp: "2025-12-31T23:59:59Z" },
  ]) {
    const response = await webhook.fetch(payment(overrides));
    assert.equal(response.status, 200);
    assert.equal(commands.length, 0);
  }
});

test("monthly tips and commissions contribute to this goal", async () => {
  for (const type of ["Subscription", "Commission"]) {
    assert.equal(
      (await (await webhook.fetch(payment({ type }))).json()).status,
      "accepted",
    );
  }
  assert.equal(commands.length, 2);
});

test("setup mode acknowledges sample payments without increasing the goal", async () => {
  process.env.KOFI_ACCEPT_PAYMENTS = "false";
  assert.equal(
    (await (await webhook.fetch(payment())).json()).status,
    "ignored",
  );
  assert.equal(commands.length, 0);
});

test("malformed amounts and missing transaction identity cannot change progress", async () => {
  for (const overrides of [
    { amount: "-2" },
    { amount: "2.005" },
    { amount: "NaN" },
    { amount: 2 },
    { amount: "0" },
    { kofi_transaction_id: "" },
    { timestamp: "bad date" },
  ]) {
    assert.equal((await webhook.fetch(payment(overrides))).status, 400);
  }
  assert.equal(commands.length, 0);
});

test("a storage failure returns a retryable error rather than acknowledging a lost tip", async () => {
  globalThis.fetch = async () =>
    Response.json({ error: "unavailable" }, { status: 503 });
  assert.equal((await webhook.fetch(payment())).status, 503);
});

test("missing setup and oversized or invalid payloads are rejected", async () => {
  assert.equal(
    (await webhook.fetch(payment({ message: "x".repeat(70000) }))).status,
    413,
  );
  assert.equal(
    (
      await webhook.fetch(
        new Request("https://sync.example/api/webhook", { method: "GET" }),
      )
    ).status,
    405,
  );
  assert.equal(
    (
      await webhook.fetch(
        new Request("https://sync.example/api/webhook", {
          method: "POST",
          body: "{}",
        }),
      )
    ).status,
    415,
  );
  delete process.env.KOFI_VERIFICATION_TOKEN;
  assert.equal((await webhook.fetch(payment())).status, 503);
  assert.equal(commands.length, 0);
});

test("public progress starts at the confirmed 9%, without inventing a received dollar total", async () => {
  result = [null, null, null];
  const response = await goal.fetch(
    new Request("https://sync.example/api/goal"),
  );
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("access-control-allow-origin"), "*");
  assert.deepEqual(await response.json(), {
    currency: "USD",
    targetUSD: 99,
    fundedPercent: 9,
    updatedAt: null,
  });
});

test("new tips increase progress and completion is capped at 100%", async () => {
  const fingerprint = configuration(process.env).fingerprint;
  result = [fingerprint, "200", String(Date.parse("2026-01-02T00:00:00Z"))];
  const response = await goal.fetch(
    new Request("https://sync.example/api/goal"),
  );
  const publicData = await response.json();
  assert.equal(publicData.fundedPercent, 11);
  assert(!JSON.stringify(publicData).includes("transaction-123"));
  result = [fingerprint, "100000", null];
  assert.equal(
    (
      await (
        await goal.fetch(new Request("https://sync.example/api/goal"))
      ).json()
    ).fundedPercent,
    100,
  );
});

test("changing the baseline fails safely instead of silently reinterpreting existing tips", async () => {
  result = ["old-configuration", "200", null];
  const response = await goal.fetch(
    new Request("https://sync.example/api/goal"),
  );
  assert.equal(response.status, 503);
  assert.equal(response.headers.get("cache-control"), "no-store");
});

test("currency parsing preserves cents exactly", () => {
  assert.equal(centsFromAmount("2.01"), 201);
  assert.equal(centsFromAmount("0.1"), 10);
  assert.equal(centsFromAmount("99"), 9900);
  assert.equal(centsFromAmount("1e3"), null);
});
