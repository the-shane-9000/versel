/**
 * GET /api/getSignedUrl?userId=<id>
 *
 * Returns: { url: "https://app.mindstudio.ai/..." }
 * – Generates a user-specific, short-lived MindStudio signed URL.
 * – Requires two environment variables set in your host’s dashboard:
 *     MINDSTUDIO_API_KEY   · your secret developer key
 *     MINDSTUDIO_AGENT_ID  · the UUID of the agent to embed
 *
 * This file sits in the /api directory so Vercel treats it as
 * a Serverless Function (Node.js runtime).  Node 18+ ships with
 * a global fetch(), so no extra dependency is needed. :contentReference[oaicite:0]{index=0}
 */

export default async function handler(req, res) {
  // 1️⃣  Identify the visitor (optional but nice for analytics)
  const userId = req.query.userId || "anon";

  // 2️⃣  Ask MindStudio for a signed URL
  const msResp = await fetch(
    "https://api.mindstudio.ai/developer/v2/generate-signed-access-url",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.MINDSTUDIO_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        agentId: process.env.MINDSTUDIO_AGENT_ID,
        userId,
      }),
    }
  );

  if (!msResp.ok) {
    const text = await msResp.text();
    return res.status(msResp.status).json({ error: text });
  }

  const { url } = await msResp.json();

  // 3️⃣  Return JSON and open CORS so Webflow can call it
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.status(200).json({ url });
}
