type Provider = "gemini" | "anthropic" | "groq";

function detectProvider(): { provider: Provider; key: string } {
  const gemini = import.meta.env.VITE_GEMINI_API_KEY;
  if (gemini) return { provider: "gemini", key: gemini };

  const anthropic = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (anthropic) return { provider: "anthropic", key: anthropic };

  const groq = import.meta.env.VITE_GROQ_API_KEY;
  if (groq) return { provider: "groq", key: groq };

  throw new Error(
    "No AI key found. Add one of these to apps/dashboard/.env.local:\n" +
    "  VITE_GEMINI_API_KEY=...   (free: aistudio.google.com/apikey)\n" +
    "  VITE_ANTHROPIC_API_KEY=...\n" +
    "  VITE_GROQ_API_KEY=...     (free: console.groq.com)"
  );
}

async function callGemini(prompt: string, key: string): Promise<string> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );
  if (!res.ok) throw new Error(`Gemini error ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";
}

async function callAnthropic(prompt: string, key: string): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`Anthropic error ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.content?.[0]?.text?.trim() ?? "";
}

async function callGroq(prompt: string, key: string): Promise<string> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      max_tokens: 300,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`Groq error ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() ?? "";
}

export async function generateText(prompt: string): Promise<string> {
  const { provider, key } = detectProvider();

  switch (provider) {
    case "gemini":
      return callGemini(prompt, key);
    case "anthropic":
      return callAnthropic(prompt, key);
    case "groq":
      return callGroq(prompt, key);
  }
}
