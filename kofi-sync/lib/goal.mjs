import { createHash, timingSafeEqual } from "node:crypto";

const targetCents = 9900;
const startingPercent = 9;

export class SetupError extends Error {}

export function configuration(env) {
  const redisURL = env.UPSTASH_REDIS_REST_URL || env.KV_REST_API_URL;
  const redisToken = env.UPSTASH_REDIS_REST_TOKEN || env.KV_REST_API_TOKEN;
  const startAt = Date.parse(env.KOFI_GOAL_START_AT ?? "");
  const goalId = env.KOFI_GOAL_ID || "apple-developer-year-one";
  if (
    !redisURL ||
    !redisToken ||
    !Number.isFinite(startAt) ||
    !/^[a-z0-9_-]{1,64}$/.test(goalId)
  ) {
    throw new SetupError("Missing goal configuration");
  }
  let url;
  try {
    url = new URL(redisURL);
  } catch {
    throw new SetupError("Invalid storage URL");
  }
  if (
    url.protocol !== "https:" ||
    !url.hostname.endsWith(".upstash.io") ||
    url.username ||
    url.password ||
    url.search
  ) {
    throw new SetupError("Invalid storage URL");
  }
  return {
    redisURL: url.origin,
    redisToken,
    startAt,
    key: `deskutils:kofi:${goalId}`,
    fingerprint: JSON.stringify({ targetCents, startingPercent, startAt }),
    acceptPayments: env.KOFI_ACCEPT_PAYMENTS === "true",
  };
}

export function verifiedToken(received, expected) {
  if (typeof received !== "string" || !expected) return false;
  const hash = (value) => createHash("sha256").update(value).digest();
  return timingSafeEqual(hash(received), hash(expected));
}

export function centsFromAmount(amount) {
  if (typeof amount !== "string" || !/^\d{1,9}(\.\d{1,2})?$/.test(amount))
    return null;
  const [whole, fraction = ""] = amount.split(".");
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  return Number.isSafeInteger(cents) && cents > 0 ? cents : null;
}

export async function redis(config, command, fetcher = fetch) {
  const response = await fetcher(config.redisURL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.redisToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    signal: AbortSignal.timeout(7000),
  });
  if (!response.ok) throw new Error("Storage unavailable");
  const data = await response.json();
  if (data.error || !Object.hasOwn(data, "result"))
    throw new Error("Storage command failed");
  return data.result;
}

// One hash and one atomic script: a retry or simultaneous delivery cannot add a
// transaction twice. Store only transaction IDs, cents and a timestamp; no PII.
export const applyPaymentScript = `
local current = redis.call('HGET', KEYS[1], 'configuration')
if current and current ~= ARGV[1] then
  return redis.error_reply('GOAL_CONFIG_CHANGED')
end
if not current then
  redis.call('HSET', KEYS[1], 'configuration', ARGV[1], 'additionalCents', '0')
end
local seen = 'transaction:' .. ARGV[2]
if redis.call('HEXISTS', KEYS[1], seen) == 1 then
  return 0
end
redis.call('HINCRBY', KEYS[1], 'additionalCents', ARGV[3])
redis.call('HSET', KEYS[1], seen, '1')
local updated = tonumber(redis.call('HGET', KEYS[1], 'updatedAt') or '0')
if tonumber(ARGV[4]) > updated then
  redis.call('HSET', KEYS[1], 'updatedAt', ARGV[4])
end
return 1
`;

export async function applyPayment(config, payment, fetcher) {
  return redis(
    config,
    [
      "EVAL",
      applyPaymentScript,
      "1",
      config.key,
      config.fingerprint,
      payment.transactionId,
      String(payment.cents),
      String(payment.timestamp),
    ],
    fetcher,
  );
}

export async function publicGoal(config, fetcher) {
  const fields = await redis(
    config,
    ["HMGET", config.key, "configuration", "additionalCents", "updatedAt"],
    fetcher,
  );
  if (!Array.isArray(fields) || fields.length !== 3)
    throw new Error("Invalid stored goal");
  const [fingerprint, storedCents, timestamp] = fields;
  if (fingerprint !== null && fingerprint !== config.fingerprint)
    throw new SetupError("Goal configuration changed");
  const additionalCents = storedCents === null ? 0 : Number(storedCents);
  if (!Number.isSafeInteger(additionalCents) || additionalCents < 0)
    throw new Error("Invalid stored amount");
  return {
    currency: "USD",
    targetUSD: targetCents / 100,
    // 9% is creator-defined starting credit, not an inferred donation amount.
    fundedPercent: Math.min(
      100,
      Math.floor(startingPercent + (additionalCents * 100) / targetCents),
    ),
    updatedAt:
      timestamp === null ? null : new Date(Number(timestamp)).toISOString(),
  };
}
