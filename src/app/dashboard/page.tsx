import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { addService, logout, updateAISettings } from "@/app/dashboard/actions";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: company } = await supabase
    .from("companies")
    .select("id, name")
    .eq("user_id", user.id)
    .single();

  const companyData =
    company ??
    (
      await supabase
        .from("companies")
        .insert({ user_id: user.id, name: "Minha Empresa" })
        .select("id, name")
        .single()
    ).data;

  const { data: initialServices } = await supabase
    .from("services")
    .select("id, name, price, duration_minutes, is_active")
    .eq("company_id", companyData?.id)
    .order("created_at", { ascending: false });

  const { data: initialMessages } = await supabase
    .from("messages")
    .select("id, contact_name, user_message, ai_response, is_converted, is_booking, created_at")
    .eq("company_id", companyData?.id)
    .order("created_at", { ascending: false })
    .limit(10);

  const { data: initialAISettings } = await supabase
    .from("ai_settings")
    .select("enabled, business_hours, personality_prompt")
    .eq("company_id", companyData?.id)
    .single();

  // Seed MVP automatico: preenche dados ficticios no primeiro acesso.
  if (companyData && (!initialServices?.length || !initialMessages?.length || !initialAISettings)) {
    if (!initialServices?.length) {
      await supabase.from("services").insert([
        {
          company_id: companyData.id,
          name: "Corte Masculino Premium",
          description: "Corte moderno com finalizacao.",
          price: 59.9,
          duration_minutes: 45,
          is_active: true,
        },
        {
          company_id: companyData.id,
          name: "Barba Terapia",
          description: "Modelagem completa de barba.",
          price: 39.9,
          duration_minutes: 30,
          is_active: true,
        },
        {
          company_id: companyData.id,
          name: "Combo Corte + Barba",
          description: "Servico completo com desconto.",
          price: 89.9,
          duration_minutes: 70,
          is_active: true,
        },
      ]);
    }

    if (!initialAISettings) {
      await supabase.from("ai_settings").upsert(
        {
          company_id: companyData.id,
          enabled: true,
          business_hours: "Seg-Sex 09:00 as 19:00 | Sab 09:00 as 14:00",
          personality_prompt: "Tom humano, objetivo e focado em conversao e agendamento.",
          short_reply_mode: true,
          convert_to_sale_mode: true,
        },
        { onConflict: "company_id" },
      );
    }

    if (!initialMessages?.length) {
      await supabase.from("messages").insert([
        {
          company_id: companyData.id,
          contact_name: "Mariana",
          contact_phone: "+5511991111111",
          user_message: "Quanto custa o corte premium?",
          ai_response: "O corte premium sai por R$ 59,90 e dura 45 min. Tenho horario hoje, quer agendar?",
          is_converted: true,
          is_booking: true,
        },
        {
          company_id: companyData.id,
          contact_name: "Rafael",
          contact_phone: "+5511992222222",
          user_message: "Vocês atendem no sabado?",
          ai_response: "Atendemos sim, das 09h as 14h no sabado. Posso te encaixar ainda este fim de semana.",
          is_converted: true,
          is_booking: false,
        },
        {
          company_id: companyData.id,
          contact_name: "Bruna",
          contact_phone: "+5511993333333",
          user_message: "Tem pacote com desconto?",
          ai_response: "Temos combo corte + barba por R$ 89,90. Quer que eu reserve um horario para voce?",
          is_converted: false,
          is_booking: false,
        },
      ]);
    }
  }

  const { data: services } = await supabase
    .from("services")
    .select("id, name, price, duration_minutes, is_active")
    .eq("company_id", companyData?.id)
    .order("created_at", { ascending: false });

  const { data: messages } = await supabase
    .from("messages")
    .select("id, contact_name, user_message, ai_response, is_converted, is_booking, created_at")
    .eq("company_id", companyData?.id)
    .order("created_at", { ascending: false });

  const { data: aiSettings } = await supabase
    .from("ai_settings")
    .select("enabled, business_hours, personality_prompt")
    .eq("company_id", companyData?.id)
    .single();

  const totalMessages = messages?.length ?? 0;
  const totalReplies = messages?.filter((m) => Boolean(m.ai_response)).length ?? 0;
  const totalConverted = messages?.filter((m) => m.is_converted).length ?? 0;
  const totalBookings = messages?.filter((m) => m.is_booking).length ?? 0;
  const conversionRate = totalMessages ? Math.round((totalConverted / totalMessages) * 100) : 0;

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-10">
      <header className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Dashboard ZapFlow AI</h1>
          <p className="text-muted">Gerencie servicos, IA e mensagens do WhatsApp.</p>
        </div>
        <form action={logout}>
          <button className="rounded-xl border border-white/20 px-4 py-2 text-sm hover:bg-white/5">
            Sair
          </button>
        </form>
      </header>

      <section className="grid gap-6 lg:grid-cols-3">
        <article className="glass rounded-2xl border border-white/10 p-5 lg:col-span-2">
          <h2 className="text-xl font-semibold">Cadastrar servico</h2>
          <form action={addService} className="mt-4 grid gap-3 md:grid-cols-2">
            <input
              name="name"
              required
              placeholder="Nome do servico"
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 outline-none focus:border-brand"
            />
            <input
              name="price"
              type="number"
              step="0.01"
              required
              placeholder="Preco"
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 outline-none focus:border-brand"
            />
            <input
              name="duration_minutes"
              type="number"
              required
              placeholder="Duracao (min)"
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 outline-none focus:border-brand"
            />
            <input
              name="description"
              placeholder="Descricao"
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 outline-none focus:border-brand"
            />
            <button className="rounded-xl bg-brand px-4 py-2 font-semibold text-white hover:bg-indigo-500 md:col-span-2">
              Salvar servico
            </button>
          </form>
        </article>

        <article className="glass rounded-2xl border border-white/10 p-5">
          <h2 className="text-xl font-semibold">Configuracao da IA</h2>
          <form action={updateAISettings} className="mt-4 space-y-3">
            <label className="flex items-center gap-2 text-sm">
              <input name="enabled" type="checkbox" defaultChecked={aiSettings?.enabled ?? true} />
              IA ativa
            </label>
            <textarea
              name="business_hours"
              defaultValue={aiSettings?.business_hours ?? "Seg-Sex 08:00 as 18:00"}
              className="h-20 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 outline-none focus:border-brand"
            />
            <textarea
              name="personality_prompt"
              defaultValue={aiSettings?.personality_prompt ?? "Tom consultivo, simpatico e direto."}
              className="h-24 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 outline-none focus:border-brand"
            />
            <button className="w-full rounded-xl bg-brand px-4 py-2 font-semibold text-white hover:bg-indigo-500">
              Atualizar IA
            </button>
          </form>
        </article>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className="glass rounded-2xl border border-white/10 p-4">
          <p className="text-sm text-muted">Mensagens recebidas</p>
          <p className="mt-1 text-2xl font-semibold">{totalMessages}</p>
        </article>
        <article className="glass rounded-2xl border border-white/10 p-4">
          <p className="text-sm text-muted">Respostas enviadas</p>
          <p className="mt-1 text-2xl font-semibold">{totalReplies}</p>
        </article>
        <article className="glass rounded-2xl border border-white/10 p-4">
          <p className="text-sm text-muted">Taxa de conversao</p>
          <p className="mt-1 text-2xl font-semibold">{conversionRate}%</p>
        </article>
        <article className="glass rounded-2xl border border-white/10 p-4">
          <p className="text-sm text-muted">Agendamentos</p>
          <p className="mt-1 text-2xl font-semibold">{totalBookings}</p>
        </article>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <article className="glass rounded-2xl border border-white/10 p-5">
          <h2 className="mb-4 text-xl font-semibold">Servicos cadastrados</h2>
          <div className="space-y-2 text-sm">
            {services?.length ? (
              services.map((service) => (
                <div key={service.id} className="rounded-xl border border-white/10 p-3">
                  <p className="font-semibold">{service.name}</p>
                  <p className="text-muted">
                    R$ {service.price} | {service.duration_minutes} min |{" "}
                    {service.is_active ? "Ativo" : "Inativo"}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-muted">Nenhum servico cadastrado.</p>
            )}
          </div>
        </article>

        <article className="glass rounded-2xl border border-white/10 p-5">
          <h2 className="mb-4 text-xl font-semibold">Ultimas mensagens</h2>
          <div className="space-y-2 text-sm">
            {messages?.length ? (
              messages.slice(0, 10).map((msg) => (
                <div key={msg.id} className="rounded-xl border border-white/10 p-3">
                  <p className="font-semibold">{msg.contact_name}</p>
                  <p className="text-muted">Cliente: {msg.user_message}</p>
                  <p className="text-brand">IA: {msg.ai_response ?? "Sem resposta ainda"}</p>
                </div>
              ))
            ) : (
              <p className="text-muted">Sem mensagens ainda.</p>
            )}
          </div>
        </article>
      </section>

      <p className="mt-8 text-xs text-muted">
        Conta: {user.email} | Empresa: {companyData?.name ?? "Nao cadastrada"}
      </p>
    </main>
  );
}
