import {
  applyPayment,
  centsFromAmount,
  configuration,
  verifiedToken,
} from "../lib/goal.mjs";

export default {
  async fetch(request) {
    if (request.method !== "POST") {
      return Response.json(
        { error: "Method not allowed" },
        { status: 405, headers: { Allow: "POST" } },
      );
    }
    if (!process.env.KOFI_VERIFICATION_TOKEN) {
      return Response.json(
        { error: "Webhook not configured" },
        { status: 503 },
      );
    }
    if (
      !(request.headers.get("content-type") ?? "").startsWith(
        "application/x-www-form-urlencoded",
      )
    ) {
      return Response.json({ error: "Expected form data" }, { status: 415 });
    }
    let event;
    try {
      // Bound streamed input as well as Content-Length before parsing JSON.
      const reader = request.body?.getReader();
      if (!reader) throw new Error("Missing body");
      const chunks = [];
      let size = 0;
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        size += value.length;
        if (size > 65536) {
          await reader.cancel();
          return Response.json({ error: "Payload too large" }, { status: 413 });
        }
        chunks.push(value);
      }
      const raw = Buffer.concat(chunks).toString("utf8");
      event = JSON.parse(new URLSearchParams(raw).get("data") ?? "null");
      if (!event || typeof event !== "object" || Array.isArray(event))
        throw new Error("Invalid event");
    } catch {
      return Response.json(
        { error: "Invalid payment payload" },
        { status: 400 },
      );
    }
    if (
      !verifiedToken(
        event.verification_token,
        process.env.KOFI_VERIFICATION_TOKEN,
      )
    ) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
      const config = configuration(process.env);
      // Ko-fi goals exclude shop orders. Only this USD goal is supported; do not
      // silently convert other currencies or count preview/test deliveries.
      if (
        !config.acceptPayments ||
        !["Tip", "Donation", "Subscription", "Commission"].includes(
          event.type,
        ) ||
        event.currency !== "USD"
      ) {
        return Response.json({ ok: true, status: "ignored" });
      }
      const cents = centsFromAmount(event.amount);
      const timestamp = Date.parse(event.timestamp ?? "");
      const transactionId = event.kofi_transaction_id;
      if (
        cents === null ||
        !Number.isFinite(timestamp) ||
        typeof transactionId !== "string" ||
        !/^[\w-]{1,128}$/.test(transactionId)
      ) {
        return Response.json(
          { error: "Invalid payment fields" },
          { status: 400 },
        );
      }
      if (timestamp < config.startAt)
        return Response.json({ ok: true, status: "before_start" });
      if (timestamp > Date.now() + 300000)
        return Response.json(
          { error: "Invalid payment timestamp" },
          { status: 400 },
        );
      const accepted = await applyPayment(config, {
        transactionId,
        cents,
        timestamp,
      });
      return Response.json({
        ok: true,
        status: accepted === 1 ? "accepted" : "duplicate",
      });
    } catch {
      // Non-200 means Ko-fi can retry; do not acknowledge an unrecorded payment.
      return Response.json(
        { error: "Payment sync temporarily unavailable" },
        { status: 503 },
      );
    }
  },
};
