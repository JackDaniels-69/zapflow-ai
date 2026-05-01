"use client";

import Link from "next/link";
import { Bot, CheckCircle2, MessageSquareText, Rocket, Sparkles } from "lucide-react";

const benefits = [
  "Respostas automáticas em segundos",
  "IA treinada para vender e agendar",
  "Atendimento com tom humano",
  "Painel com serviços, preços e horários",
];

const plans = [
  { name: "Start", price: "R$ 97", desc: "Para profissionais iniciando vendas com IA." },
  { name: "Growth", price: "R$ 197", desc: "Para times com volume de mensagens diário." },
  { name: "Scale", price: "R$ 397", desc: "Para operações com múltiplos atendentes." },
];

const faqs = [
  {
    q: "A IA funciona para qualquer nicho?",
    a: "Sim. Você cadastra seus serviços, preços e disponibilidade. A IA usa esse contexto para responder.",
  },
  {
    q: "Preciso saber programar?",
    a: "Não. O painel foi feito para usuários de negócio com configuração simples e rápida.",
  },
  {
    q: "A resposta é instantânea?",
    a: "O processamento acontece em segundos, mantendo uma experiência fluida no WhatsApp.",
  },
];

export function LandingPage() {
  return (
    <main className="relative overflow-hidden">
      <div className="absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-brand/35 blur-3xl" />
      <section className="mx-auto flex w-full max-w-6xl flex-col items-center px-6 pb-16 pt-24 text-center">
        <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-muted">
          <Sparkles className="h-4 w-4 text-brand" /> SaaS de automacao para WhatsApp
        </span>
        <h1 className="max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
          Transforme cada mensagem em{" "}
          <span className="text-gradient">venda ou agendamento com IA</span>
        </h1>
        <p className="mt-5 max-w-2xl text-base text-muted md:text-lg">
          O ZapFlow AI responde de forma humana, objetiva e persuasiva, usando os dados do seu
          negocio em tempo real.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/register"
            className="rounded-xl bg-brand px-6 py-3 font-semibold text-white transition hover:scale-[1.02] hover:bg-indigo-500"
          >
            Comecar Agora
          </Link>
          <Link
            href="/login"
            className="rounded-xl border border-white/20 bg-white/5 px-6 py-3 font-semibold transition hover:bg-white/10"
          >
            Entrar no Dashboard
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 md:grid-cols-2">
        <div className="glass rounded-2xl border border-white/10 p-6">
          <h2 className="mb-4 text-xl font-semibold">Beneficios para seu atendimento</h2>
          <div className="space-y-3">
            {benefits.map((item) => (
              <p key={item} className="flex items-center gap-3 text-sm text-muted md:text-base">
                <CheckCircle2 className="h-5 w-5 text-brand" />
                {item}
              </p>
            ))}
          </div>
        </div>
        <div className="glass rounded-2xl border border-white/10 p-6">
          <h2 className="mb-4 text-xl font-semibold">Demonstracao do chat</h2>
          <div className="space-y-3 text-sm">
            <div className="ml-auto max-w-[80%] rounded-2xl bg-brand/30 px-4 py-3">
              Oi! Quanto custa limpeza de pele?
            </div>
            <div className="max-w-[90%] rounded-2xl bg-white/8 px-4 py-3 text-muted">
              Oi! A limpeza de pele premium esta por R$ 160 e dura 1h. Temos hoje as 15h e 18h.
              Posso reservar para voce?
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h3 className="mb-6 text-center text-3xl font-semibold">Planos</h3>
        <div className="grid gap-4 md:grid-cols-3">
          {plans.map((plan) => (
            <article key={plan.name} className="glass rounded-2xl border border-white/10 p-5">
              <p className="text-sm text-muted">{plan.name}</p>
              <p className="mt-2 text-3xl font-semibold">{plan.price}</p>
              <p className="mt-2 text-sm text-muted">{plan.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-20">
        <h3 className="mb-6 text-center text-3xl font-semibold">FAQ</h3>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <article key={faq.q} className="glass rounded-2xl border border-white/10 p-5">
              <p className="font-semibold">{faq.q}</p>
              <p className="mt-2 text-sm text-muted">{faq.a}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-muted md:flex-row">
          <p>ZapFlow AI - Atendimento inteligente para WhatsApp</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1">
              <Bot className="h-4 w-4" /> IA
            </span>
            <span className="inline-flex items-center gap-1">
              <MessageSquareText className="h-4 w-4" /> WhatsApp
            </span>
            <span className="inline-flex items-center gap-1">
              <Rocket className="h-4 w-4" /> SaaS
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}
