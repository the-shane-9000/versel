export default async function handler(req, res) {
  const userId = req.query.userId || "anon";

  const msResp = await fetch(
    "https://api.mindstudio.ai/developer/v2/generate-signed-access-url",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.MINDSTUDIO_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        agentId: process.env.MINDSTUDIO_AGENT_ID,
        userId
      })
    }
  );

  if (!msResp.ok) {
    const text = await msResp.text();
    return res.status(msResp.status).json({ error: text });
  }

  const { url } = await msResp.json();
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.status(200).json({ url });
}
