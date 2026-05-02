"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../../lib/supabase/server";

export async function addService(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: company } = await supabase
    .from("companies")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!company) return;

  await supabase.from("services").insert({
    company_id: company.id,
    name: String(formData.get("name") ?? ""),
    description: String(formData.get("description") ?? ""),
    price: Number(formData.get("price") ?? 0),
    duration_minutes: Number(formData.get("duration_minutes") ?? 30),
    is_active: true,
  });

  revalidatePath("/dashboard");
}

export async function updateAISettings(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: company } = await supabase
    .from("companies")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!company) return;

  await supabase.from("ai_settings").upsert(
    {
      company_id: company.id,
      enabled: formData.get("enabled") === "on",
      business_hours: String(formData.get("business_hours") ?? ""),
      personality_prompt: String(formData.get("personality_prompt") ?? ""),
      short_reply_mode: true,
      convert_to_sale_mode: true,
    },
    { onConflict: "company_id" },
  );

  revalidatePath("/dashboard");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/");
}
