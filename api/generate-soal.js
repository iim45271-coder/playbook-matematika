export default async function handler(req, res) {
  try {
    const { prompt } = req.body;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 2000,
        messages: [
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();

    // 🔥 TAMBAHKAN INI
    if (!response.ok) {
      return res.status(500).json({
        error: "Claude API error",
        detail: data
      });
    }

    res.status(200).json(data);

  } catch (err) {
    res.status(500).json({
      error: "Server error",
      detail: err.message
    });
  }
}