import { NextResponse } from "next/server";
import { createAdminClient } from "../../../../lib/supabase/admin";
import { generateAIReply } from "../../../../lib/openai";

type Payload = {
  companyId: string;
  contactName?: string;
  contactPhone?: string;
  message: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as Payload;
  const supabase = createAdminClient();

  if (!body.companyId || !body.message) {
    return NextResponse.json(
      { error: "companyId e message são obrigatórios." },
      { status: 400 },
    );
  }

  const { data: company } = await supabase
    .from("companies")
    .select("id, name")
    .eq("id", body.companyId)
    .single();

  if (!company) {
    return NextResponse.json({ error: "Empresa nao encontrada." }, { status: 404 });
  }

  const { data: services } = await supabase
    .from("services")
    .select("name, price, duration_minutes")
    .eq("company_id", company.id)
    .eq("is_active", true);

  const { data: ai } = await supabase
    .from("ai_settings")
    .select("enabled, business_hours, personality_prompt")
    .eq("company_id", company.id)
    .single();

  if (!ai?.enabled) {
    return NextResponse.json({ error: "IA desativada para esta empresa." }, { status: 400 });
  }

  const aiReply = await generateAIReply({
    companyId: company.id,
    userMessage: body.message,
    companyName: company.name,
    services: services ?? [],
    businessHours: ai.business_hours ?? "Horario nao informado",
    personalityPrompt: ai.personality_prompt ?? "",
  });

  await supabase.from("messages").insert({
    company_id: company.id,
    contact_name: body.contactName ?? "Visitante",
    contact_phone: body.contactPhone ?? "+5500000000000",
    user_message: body.message,
    ai_response: aiReply,
  });

  return NextResponse.json({ reply: aiReply });
}