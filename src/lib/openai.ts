import { buildSalesPrompt } from "./ai-personality";
import { createAdminClient } from "./supabase/admin";

type ReplyInput = {
  userMessage: string;
  companyId: string;
  companyName: string;
  services: Array<{ name: string; price: number; duration_minutes: number }>;
  businessHours: string;
  personalityPrompt: string;
};

export async function generateAIReply(input: ReplyInput): Promise<string> {
  if (!process.env.OPENROUTER_API_KEY) {
    return "OPENROUTER_API_KEY não está configurada no servidor";
  }

  // Usa adminClient — funciona em API routes sem contexto de cookies
  const supabase = createAdminClient();

  // 1. Buscar histórico recente (últimas 10 mensagens, ordem cronológica)
  const { data: history } = await supabase
    .from("conversation_messages")
    .select("role, content")
    .eq("company_id", input.companyId)
    .order("created_at", { ascending: false })
    .limit(10);

  const conversationHistory = (history ?? []).reverse() as {
    role: "user" | "assistant";
    content: string;
  }[];

  const systemPrompt = buildSalesPrompt(input);

  // Instrução anti-loop adicionada ao system prompt
  const antiLoopInstruction = `
REGRA CRITICA: Nunca repita informacoes que ja foram ditas na conversa.
Se o cliente ja foi informado de preco, horario ou servico, nao repita — avance para o proximo passo.
Seja natural, humano e nao entre em loop.
`.trim();

  const messages = [
    { role: "system" as const, content: `${systemPrompt}\n\n${antiLoopInstruction}` },
    ...conversationHistory,
    { role: "user" as const, content: input.userMessage },
  ];

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "https://zapflow-ai-chi.vercel.app",
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
    console.error("OpenRouter error:", JSON.stringify(data));
    return `Erro OpenRouter: ${data?.error?.message ?? response.status}`;
  }

  const reply =
    data.choices?.[0]?.message?.content?.trim() ?? "Posso te ajudar com mais detalhes?";

  // 2. Salvar mensagem do usuário e resposta da IA no histórico
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
