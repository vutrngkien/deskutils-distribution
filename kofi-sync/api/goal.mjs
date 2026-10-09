import { configuration, publicGoal } from "../lib/goal.mjs";

export default {
  async fetch(request) {
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=0, s-maxage=60",
    };
    if (request.method !== "GET") {
      return Response.json(
        { error: "Method not allowed" },
        { status: 405, headers: { Allow: "GET" } },
      );
    }
    try {
      const goal = await publicGoal(configuration(process.env));
      return Response.json(goal, { headers });
    } catch {
      return Response.json(
        { error: "Goal temporarily unavailable" },
        {
          status: 503,
          headers: { ...headers, "Cache-Control": "no-store" },
        },
      );
    }
  },
};
