import { buildSalesPrompt } from "./ai-personality";
import { createClient } from "./supabase/server";

type ReplyInput = {
  userMessage: string;
  companyId: string;
  companyName: string;
  services: Array<{ name: string; price: number; duration_minutes: number }>;
  businessHours: string;
  personalityPrompt: string;
};

export async function generateAIReply(input: ReplyInput) {
  const supabase = await createClient();

  if (!process.env.OPENROUTER_API_KEY) {
    return "OPENROUTER_API_KEY não está configurada no servidor";
  }

  // 🔥 BUSCAR HISTÓRICO (MEMÓRIA)
  const { data: history } = await supabase
    .from("conversation_messages")
    .select("role, content")
    .eq("company_id", input.companyId)
    .order("created_at", { ascending: false })
    .limit(10);

  const systemPrompt = buildSalesPrompt(input);

  const messages = [
    { role: "system", content: systemPrompt },

    // histórico antigo → novo
    ...(history ?? []).reverse(),

    { role: "user", content: input.userMessage },
  ];

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://zapflow-ai-chi.vercel.app",
      "X-Title": "ChatLead AI",
    },
    body: JSON.stringify({
      model: "openai/gpt-4o-mini",
      temperature: 0.4,
      max_tokens: 140,
      messages,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("OpenRouter error:", data);
    return `Erro OpenRouter: ${data?.error?.message ?? response.status}`;
  }

  const reply =
    data.choices?.[0]?.message?.content?.trim() ??
    "Posso te ajudar com mais detalhes?";

  // 🔥 SALVAR HISTÓRICO
  await supabase.from("conversation_messages").insert([
    {
      company_id: input.companyId,
      role: "user",
      content: input.userMessage,
    },
    {
      company_id: input.companyId,
      role: "assistant",
      content: reply,
    },
  ]);

  return reply;
}