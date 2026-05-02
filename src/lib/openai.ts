import OpenAI from "openai";
import { buildSalesPrompt } from "./ai-personality";

type ReplyInput = {
  userMessage: string;
  companyName: string;
  services: Array<{ name: string; price: number; duration_minutes: number }>;
  businessHours: string;
  personalityPrompt: string;
};

export async function generateAIReply(input: ReplyInput) {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const systemPrompt = buildSalesPrompt(input);

  const completion = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    temperature: 0.7,
    max_tokens: 160,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: input.userMessage },
    ],
  });

  return completion.choices[0]?.message?.content?.trim() ?? "Posso te ajudar com mais detalhes?";
}
