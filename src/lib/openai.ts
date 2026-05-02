import { buildSalesPrompt } from "./ai-personality";

type ReplyInput = {
  userMessage: string;
  companyName: string;
  services: Array<{ name: string; price: number; duration_minutes: number }>;
  businessHours: string;
  personalityPrompt: string;
};

export async function generateAIReply(input: ReplyInput) {
  const systemPrompt = buildSalesPrompt(input);

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://zapflow-ai-chi.vercel.app",
      "X-Title": "ChatLead AI",
    },
    body: JSON.stringify({
      model: "openrouter/auto",
      temperature: 0.7,
      max_tokens: 160,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: input.userMessage },
      ],
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("OpenRouter error:", data);
    return `Erro OpenRouter: ${data?.error?.message ?? response.status}`;
  }

  return (
    data.choices?.[0]?.message?.content?.trim() ??
    "Posso te ajudar com mais detalhes?"
  );
}