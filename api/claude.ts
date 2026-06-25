const MODEL = "claude-sonnet-4-20250514";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "ANTHROPIC_API_KEY is not set on the server.",
    });
  }

  const { system, userContent } = req.body || {};

  if (typeof system !== "string" || typeof userContent !== "string") {
    return res.status(400).json({
      error: "Expected JSON body with string fields: system and userContent.",
    });
  }

  try {
    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1000,
        system,
        messages: [
          {
            role: "user",
            content: userContent,
          },
        ],
      }),
    });

    const data = await anthropicRes.json();

    if (!anthropicRes.ok) {
      const message =
        data?.error?.message ||
        data?.error ||
        "Anthropic API request failed.";

      return res.status(anthropicRes.status).json({
        error: message,
        details: data,
      });
    }

    const text = (data.content || [])
      .filter((block: any) => block.type === "text")
      .map((block: any) => block.text)
      .join("")
      .replace(/```json|```/g, "")
      .trim();

    if (!text) {
      return res.status(502).json({
        error: "Anthropic returned no text content.",
        details: data,
      });
    }

    try {
      return res.status(200).json(JSON.parse(text));
    } catch {
      return res.status(502).json({
        error: "Anthropic returned invalid JSON.",
        raw: text,
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      error: error?.message || "Unexpected server error.",
    });
  }
}
