"use client";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import { addService, logout, updateAISettings } from "./actions";
import {
  Bot,
  Building2,
  CheckCircle2,
  Clock3,
  MessageCircleMore,
  MessageSquareText,
  Sparkles,
  UserRound,
  Zap,
} from "lucide-react";
import { DemoMode } from "../../components/dashboard/demo-mode";

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
  const totalClients = new Set((messages ?? []).map((m) => m.contact_name)).size;
  const timeSavedHours = Math.round((totalReplies * 3) / 60);

  const onboardingSteps = [
    { label: "Passo 1: configurar empresa", done: Boolean(companyData?.name) },
    { label: "Passo 2: adicionar servicos", done: (services?.length ?? 0) > 0 },
    { label: "Passo 3: ativar IA", done: Boolean(aiSettings?.enabled) },
    { label: "Passo 4: comecar atendimento", done: totalReplies > 0 },
  ];
  const onboardingDoneCount = onboardingSteps.filter((step) => step.done).length;
  const onboardingProgress = Math.round((onboardingDoneCount / onboardingSteps.length) * 100);

  const notifications = [
    "Nova mensagem recebida de Camila agora.",
    "IA respondeu em 4 segundos para Leonardo.",
    "Agendamento confirmado para hoje as 18:00.",
  ];

  const simulatedConversations = [
    {
      client: "Cliente: quanto custa corte?",
      ai: "IA: Ola 😄 O corte custa R$35. Deseja agendar?",
    },
    {
      client: "Cliente: tem horario hoje?",
      ai: "IA: Tenho 16:30 e 18:00. Qual voce prefere?",
    },
  ];

  return (
    <main className="mx-auto grid w-full max-w-[1400px] gap-6 px-4 py-6 lg:grid-cols-[280px_1fr] lg:px-6">
      <aside className="glass rounded-3xl border border-white/10 p-5 lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)]">
        <div className="border-b border-white/10 pb-5">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">ChatLead AI</p>
          <h1 className="mt-2 text-xl font-semibold">Painel de Operacao</h1>
          <p className="mt-2 text-sm text-muted">{companyData?.name ?? "Minha Empresa"}</p>
        </div>

        <div className="mt-5 space-y-2 text-sm">
          {[
            { label: "Visao Geral", href: "#visao-geral" },
            { label: "Onboarding", href: "#onboarding" },
            { label: "Fluxo Guiado", href: "#fluxo-guiado" },
            { label: "Conversas", href: "#conversas" },
            { label: "Servicos", href: "#servicos" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="flex w-full items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-left text-muted transition hover:border-brand/50 hover:text-white"
            >
              <Sparkles className="h-4 w-4 text-brand" /> {item.label}
            </a>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-3">
          <p className="text-xs text-emerald-200">Status da IA</p>
          <p className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-white">
            <span className="h-2 w-2 rounded-full bg-emerald-300" />
            {aiSettings?.enabled ? "Online e respondendo" : "Offline"}
          </p>
        </div>

        <form action={logout} className="mt-6">
          <button className="w-full rounded-xl border border-white/20 px-4 py-2 text-sm hover:bg-white/5">
            Sair
          </button>
        </form>
      </aside>

      <section className="space-y-6">
        <header className="glass rounded-3xl border border-white/10 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-semibold">Dashboard ChatLead AI</h2>
              <p className="mt-2 text-sm text-muted">
                Veja o que fazer agora e acompanhe seus resultados em tempo real.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right">
              <p className="text-xs text-muted">Onboarding</p>
              <p className="text-xl font-semibold">{onboardingProgress}%</p>
            </div>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-brand" style={{ width: `${onboardingProgress}%` }} />
          </div>
        </header>

        <DemoMode />

        <section id="visao-geral" className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <article className="glass rounded-2xl border border-white/10 p-4">
            <p className="inline-flex items-center gap-2 text-sm text-muted">
              <UserRound className="h-4 w-4 text-brand" /> Clientes atendidos
            </p>
            <p className="mt-2 text-3xl font-semibold">{totalClients}</p>
          </article>
          <article className="glass rounded-2xl border border-white/10 p-4">
            <p className="inline-flex items-center gap-2 text-sm text-muted">
              <MessageSquareText className="h-4 w-4 text-brand" /> Mensagens respondidas
            </p>
            <p className="mt-2 text-3xl font-semibold">{totalReplies}</p>
          </article>
          <article className="glass rounded-2xl border border-white/10 p-4">
            <p className="inline-flex items-center gap-2 text-sm text-muted">
              <CheckCircle2 className="h-4 w-4 text-brand" /> Agendamentos gerados
            </p>
            <p className="mt-2 text-3xl font-semibold">{totalBookings}</p>
          </article>
          <article className="glass rounded-2xl border border-white/10 p-4">
            <p className="inline-flex items-center gap-2 text-sm text-muted">
              <Clock3 className="h-4 w-4 text-brand" /> Tempo economizado
            </p>
            <p className="mt-2 text-3xl font-semibold">{timeSavedHours}h</p>
          </article>
        </section>

        <section id="onboarding" className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <article className="glass rounded-3xl border border-white/10 p-6">
            <h3 className="text-xl font-semibold">Onboarding visual</h3>
            <p className="mt-1 text-sm text-muted">
              Siga o fluxo abaixo para deixar o atendimento pronto e ativo.
            </p>
            <div className="mt-4 space-y-2">
              {onboardingSteps.map((step) => (
                <div key={step.label} className="flex items-center justify-between rounded-xl border border-white/10 p-3">
                  <p className="text-sm">{step.label}</p>
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      step.done ? "bg-emerald-400/20 text-emerald-200" : "bg-amber-400/20 text-amber-200"
                    }`}
                  >
                    {step.done ? "Concluido" : "Pendente"}
                  </span>
                </div>
              ))}
            </div>
          </article>

          <article className="glass rounded-3xl border border-white/10 p-6">
            <h3 className="text-xl font-semibold">Notificacoes e status</h3>
            <div className="mt-4 space-y-2">
              {notifications.map((item) => (
                <p key={item} className="flex items-start gap-2 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-muted">
                  <Zap className="mt-0.5 h-4 w-4 text-brand" /> {item}
                </p>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted">
              Taxa de conversao atual: <span className="font-semibold text-white">{conversionRate}%</span>
            </p>
          </article>
        </section>

        <section id="fluxo-guiado" className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
          <article className="glass rounded-3xl border border-white/10 p-6">
            <h3 className="text-xl font-semibold">Fluxo guiado - configure e publique</h3>
            <p className="mt-1 text-sm text-muted">
              Preencha os campos abaixo para ativar uma IA profissional para seu negocio.
            </p>
            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              <form action={addService} className="space-y-3 rounded-2xl border border-white/10 p-4">
                <p className="inline-flex items-center gap-2 font-semibold">
                  <Building2 className="h-4 w-4 text-brand" /> Adicionar servico
                </p>
                <input
                  name="name"
                  required
                  placeholder="Ex: Corte Social Premium"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 outline-none focus:border-brand"
                />
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  required
                  placeholder="Ex: 35.00"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 outline-none focus:border-brand"
                />
                <input
                  name="duration_minutes"
                  type="number"
                  required
                  placeholder="Ex: 40 minutos"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 outline-none focus:border-brand"
                />
                <input
                  name="description"
                  placeholder="Ex: Corte + finalizacao personalizada"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 outline-none focus:border-brand"
                />
                <button className="w-full rounded-xl bg-brand px-4 py-2 font-semibold text-white hover:bg-indigo-500">
                  Salvar servico e avancar
                </button>
              </form>

              <form action={updateAISettings} className="space-y-3 rounded-2xl border border-white/10 p-4">
                <p className="inline-flex items-center gap-2 font-semibold">
                  <Bot className="h-4 w-4 text-brand" /> Ativar IA e horario
                </p>
                <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm">
                  <input name="enabled" type="checkbox" defaultChecked={aiSettings?.enabled ?? true} />
                  IA online para responder clientes
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
                <button
  type="button"
  onClick={async () => {
    alert("IA ativada com sucesso 🚀");
  }}
  className="w-full rounded-xl bg-brand px-4 py-2 font-semibold text-white"
>
  Atualizar IA e publicar atendimento
</button>
              </form>
            </div>
          </article>

          <article id="conversas" className="space-y-6">
            <div className="glass rounded-3xl border border-white/10 p-6">
              <h3 className="text-xl font-semibold">Demonstracao simulada</h3>
              <div className="mt-4 space-y-3 text-sm">
                {simulatedConversations.map((item) => (
                  <div key={item.client} className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <p className="text-muted">{item.client}</p>
                    <p className="mt-2 text-brand">{item.ai}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass rounded-3xl border border-white/10 p-6">
              <h3 className="text-xl font-semibold">Mensagens recentes</h3>
              <div className="mt-4 space-y-2">
                {(messages ?? []).slice(0, 6).map((msg) => (
                  <div key={msg.id} className="rounded-xl border border-white/10 p-3 text-sm">
                    <p className="font-semibold">{msg.contact_name}</p>
                    <p className="mt-1 text-muted">Cliente: {msg.user_message}</p>
                    <p className="mt-1 text-brand">IA: {msg.ai_response ?? "Sem resposta ainda"}</p>
                  </div>
                ))}
              </div>
            </div>
          </article>
        </section>

        <section id="servicos" className="grid gap-6 xl:grid-cols-2">
          <article className="glass rounded-3xl border border-white/10 p-6">
            <h3 className="text-xl font-semibold">Servicos ativos</h3>
            <div className="mt-4 space-y-2">
              {(services ?? []).map((service) => (
                <div key={service.id} className="rounded-xl border border-white/10 p-3 text-sm">
                  <p className="font-semibold">{service.name}</p>
                  <p className="text-muted">
                    R$ {service.price} | {service.duration_minutes} min | {service.is_active ? "Ativo" : "Inativo"}
                  </p>
                </div>
              ))}
            </div>
          </article>

          <article className="glass rounded-3xl border border-white/10 p-6">
            <h3 className="text-xl font-semibold">Conversas simuladas ao vivo</h3>
            <div className="mt-4 space-y-3 text-sm">
              <p className="rounded-xl border border-white/10 bg-white/5 p-3">
                Cliente: voces atendem hoje a noite?
              </p>
              <p className="rounded-xl border border-brand/40 bg-brand/20 p-3 text-brand">
                IA: Atendemos sim, ate as 19:00. Tenho 18:00 disponivel. Posso confirmar agora?
              </p>
              <p className="rounded-xl border border-white/10 bg-white/5 p-3">
                Cliente: pode confirmar.
              </p>
            </div>
            <p className="mt-4 inline-flex items-center gap-2 text-xs text-emerald-200">
              <MessageCircleMore className="h-4 w-4" /> Ambiente demonstrativo para onboarding visual
            </p>
          </article>
        </section>

        <p className="px-1 text-xs text-muted">
          Conta: {user.email} | Empresa: {companyData?.name ?? "Nao cadastrada"}
        </p>
      </section>
    </main>
  );
}
