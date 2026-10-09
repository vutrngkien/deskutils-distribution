# DeskUtils Ko-fi goal sync

A separate Vercel project keeps the existing static website export intact.
Ko-fi sends payments to `/api/webhook`; `/api/goal` publishes only the goal,
funded percentage and last payment time. Storage uses the Upstash Redis REST API.
No supporter names, emails, messages or verification tokens are stored or exposed.

The creator's starting credit is **9% of a 99 USD goal**. It is not an exact
historical donation total. New USD tips add to this starting credit; percentages
round down and stop at 100%. Reaching 100% means funding is complete, not that
Apple has notarized the app.

## Configure and activate

1. Create a Vercel project with Root Directory `kofi-sync`, framework **Other**.
   Add an Upstash Redis database through Vercel's marketplace or Upstash. This
   directory has no dependencies and no website build step.
2. Add the server-only variables from `.env.example` in Vercel. Copy the
   verification token from [Ko-fi Webhooks](https://ko-fi.com/manage/webhooks).
   Vercel's Upstash integration supplies `KV_REST_API_URL` and
   `KV_REST_API_TOKEN` automatically. Alternatively, add
   `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` from the database.
   Keep all three secrets out of the website's `NEXT_PUBLIC_*` variables.
3. Set `KOFI_GOAL_START_AT` to a UTC ISO timestamp. It marks the boundary between
   the existing starting credit and payments delivered by the new webhook.
   Keep `KOFI_ACCEPT_PAYMENTS=false` during setup. Deploy the sync project.
4. Set Ko-fi's webhook URL to `https://YOUR-SYNC-DOMAIN/api/webhook`. Send a
   sample payment from Ko-fi's Webhooks page while acceptance is **false**.
   The expected response is `{ "ok": true, "status": "ignored" }`. Samples do
   not increase progress. Do not send samples after acceptance is enabled.
5. At activation, confirm the starting credit still matches the intended goal,
   set the start timestamp to activation time and set `KOFI_ACCEPT_PAYMENTS=true`.
   Redeploy. Reconcile any payments received during setup before activating.
   Keep the timestamp and goal ID fixed after the first real tip is recorded.
6. Set `NEXT_PUBLIC_DESKUTILS_KOFI_GOAL_ENDPOINT` on the **website** Vercel project
   to `https://YOUR-SYNC-DOMAIN/api/goal`, then rebuild its preview. The browser
   reads progress on page load, every 60 seconds while visible, and when returning
   to the tab. Confirm preview before publishing the website.
7. After a real tip, verify the public goal increases. Duplicate delivery of its
   transaction must not increase progress again. Do not create a real payment
   merely for testing; wait for an authorized tip.

Payment types `Tip`, legacy `Donation`, `Subscription` and `Commission` count. Shop orders are
excluded, matching [Ko-fi Goals](https://help.ko-fi.com/hc/en-us/articles/360004392158-Set-your-Ko-fi-Goal).
This integration does not convert currencies; non-USD payments are acknowledged
and ignored. Ko-fi only documents payment notifications, so refunds, manual goal
edits and goal resets require reconciliation. See the [official webhook guide](https://help.ko-fi.com/hc/en-us/articles/360004162298-Does-Ko-fi-have-an-API-or-webhook).

One Lua operation checks the transaction ID and increments progress atomically.
Failed storage writes return 503 so Ko-fi can retry. Successful duplicates return 200. The goal is namespaced by `KOFI_GOAL_ID`; use a new ID for a new campaign.
Changing its start timestamp after stored payments causes reads/writes to fail
safely rather than silently changing the interpretation of existing data.

The website retains its last confirmed value if the service is unavailable,
including the initial 9% when no endpoint has been configured. JavaScript-free
visits see the static snapshot in `web/content/notarization.ts`.

## Validation

Run `npm test` here. The tests cover payment authentication, ignored events,
cent precision, duplicate responses, retries, privacy and goal calculations.
They mock the Redis transport; deployment still requires verification with the
configured Ko-fi and Upstash accounts. See the [Vercel Node.js runtime](https://vercel.com/docs/functions/runtimes/node-js)
and [Upstash REST API](https://upstash.com/docs/redis/features/restapi) for hosting.
