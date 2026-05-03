"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  Bot,
  CheckCircle2,
  ChevronRight,
  MessageSquareText,
  Rocket,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react";

const pains = [
  "Leads esfriam porque sua resposta demora",
  "Equipe perde vendas em horarios de pico",
  "Clientes somem antes de fechar agendamento",
  "Atendimento inconsistente reduz confianca",
];

const trustBadges = [
  "Criptografia de ponta a ponta",
  "Conformidade LGPD-ready",
  "Infraestrutura com alta disponibilidade",
];

const howItWorks = [
  {
    title: "1. Configure em minutos",
    desc: "Cadastre servicos, valores e horarios. Sem setup tecnico complexo.",
  },
  {
    title: "2. IA atende e qualifica",
    desc: "A IA responde curto, humano e com foco em avancar para fechamento.",
  },
  {
    title: "3. Converta mais clientes",
    desc: "Receba leads aquecidos e agendamentos no seu fluxo operacional.",
  },
];

const socialProof = [
  {
    name: "Clinica Aurora Estetica",
    result: "+42% em agendamentos no primeiro mes",
    quote:
      "Antes, perdíamos clientes no WhatsApp. Agora a IA responde no timing certo e converte com naturalidade.",
  },
  {
    name: "Barbearia Prime Zone",
    result: "3,1x mais respostas em horario de pico",
    quote:
      "A equipe parou de correr atras de mensagem atrasada. O funil ficou previsivel e lucrativo.",
  },
  {
    name: "Studio Bella Hair",
    result: "R$ 28 mil em receita incremental",
    quote:
      "A sensacao e de ter um closer no WhatsApp 24h. Atendimento rapido, humano e muito mais profissional.",
  },
];

const plans = [
  { name: "Start", price: "R$ 97", desc: "Para quem quer parar de perder leads." },
  { name: "Growth", price: "R$ 197", desc: "Para escalar atendimento e conversao." },
  { name: "Scale", price: "R$ 397", desc: "Para operacoes com alta demanda diaria." },
];

const faqs = [
  {
    q: "A IA funciona para qualquer nicho?",
    a: "Sim. Voce cadastra servicos, precos e disponibilidade e a IA atende com seu contexto real.",
  },
  {
    q: "Preciso saber programar?",
    a: "Nao. O painel foi feito para negocio, com configuracao simples e interface intuitiva.",
  },
  {
    q: "A resposta é instantânea?",
    a: "Sim. O processamento ocorre em segundos para manter conversa fluida e taxa de resposta alta.",
  },
];

export function LandingPage() {
  const [heroVariant, setHeroVariant] = useState<"A" | "B">("A");

  useEffect(() => {
    const savedVariant = window.localStorage.getItem("chatlead-hero-variant");
    if (savedVariant === "A" || savedVariant === "B") {
      setHeroVariant(savedVariant);
      return;
    }
    const variant = Math.random() > 0.5 ? "A" : "B";
    window.localStorage.setItem("chatlead-hero-variant", variant);
    setHeroVariant(variant);
  }, []);

  const heroCopy =
    heroVariant === "A"
      ? {
          headline:
            "Cada minuto sem resposta no WhatsApp esta custando vendas para seu negocio.",
          highlight: "esta custando vendas para seu negocio.",
          subtitle:
            "O ChatLead AI transforma conversas em receita com uma IA que responde em segundos, conduz o cliente para fechar e agenda automaticamente usando seus servicos, precos e horarios.",
          ctaPrimary: "Quero recuperar vendas agora",
          ctaSecondary: "Ver dashboard premium",
        }
      : {
          headline:
            "Seu concorrente responde primeiro, fecha primeiro e leva o cliente que era seu.",
          highlight: "fecha primeiro e leva o cliente que era seu.",
          subtitle:
            "Ative uma IA de atendimento que responde com tom humano, remove gargalos da equipe e aumenta sua taxa de agendamento no WhatsApp.",
          ctaPrimary: "Ativar IA e parar de perder leads",
          ctaSecondary: "Quero ver como funciona",
        };

  const forceVariant = (variant: "A" | "B") => {
    window.localStorage.setItem("chatlead-hero-variant", variant);
    setHeroVariant(variant);
  };

  const resetVariantToAuto = () => {
    const variant = Math.random() > 0.5 ? "A" : "B";
    window.localStorage.removeItem("chatlead-hero-variant");
    setHeroVariant(variant);
  };

  return (
    <main className="relative overflow-hidden">
      <div className="absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-brand/35 blur-3xl" />
      <div className="absolute right-8 top-40 hidden h-48 w-48 rounded-full bg-cyan-400/20 blur-3xl lg:block" />

      <section className="mx-auto flex w-full max-w-7xl flex-col items-center px-6 pb-20 pt-20 text-center md:pt-24">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm font-semibold">
          <span className="rounded-md bg-gradient-to-br from-brand to-cyan-400 px-1.5 py-0.5 text-xs text-white">
            CL
          </span>
          ChatLead AI
        </p>
        <span className="animate-fade-up mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-400/10 px-4 py-2 text-xs font-semibold tracking-wide text-emerald-200">
          <ShieldCheck className="h-4 w-4" /> Plataforma confiavel para atendimento de alta performance
        </span>

        <h1 className="animate-fade-up max-w-5xl text-4xl font-semibold leading-[1.05] md:text-6xl lg:text-7xl">
          {heroCopy.headline.replace(heroCopy.highlight, "")}
          <span className="text-gradient">{heroCopy.highlight}</span>
        </h1>

        <p className="animate-fade-up mt-6 max-w-3xl text-base text-muted md:text-xl">
          {heroCopy.subtitle}
        </p>

        <div className="animate-fade-up mt-9 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/register"
            className="animate-pulse-soft rounded-xl bg-brand px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition hover:scale-[1.02] hover:bg-indigo-500"
          >
            {heroCopy.ctaPrimary}
          </Link>
          <Link
            href="/login"
            className="rounded-xl border border-white/25 bg-white/5 px-7 py-3.5 text-sm font-semibold uppercase tracking-wide transition hover:bg-white/10"
          >
            {heroCopy.ctaSecondary}
          </Link>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-muted/80">Experimento ativo: variante {heroVariant}</span>
          <button
            type="button"
            onClick={() => forceVariant("A")}
            className={`rounded-full px-2.5 py-1 transition ${
              heroVariant === "A"
                ? "bg-brand text-white"
                : "border border-white/20 bg-white/5 text-muted hover:bg-white/10"
            }`}
          >
            Forcar A
          </button>
          <button
            type="button"
            onClick={() => forceVariant("B")}
            className={`rounded-full px-2.5 py-1 transition ${
              heroVariant === "B"
                ? "bg-brand text-white"
                : "border border-white/20 bg-white/5 text-muted hover:bg-white/10"
            }`}
          >
            Forcar B
          </button>
          <button
            type="button"
            onClick={resetVariantToAuto}
            className="rounded-full border border-white/20 bg-white/5 px-2.5 py-1 text-muted transition hover:bg-white/10"
          >
            Auto
          </button>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs text-muted">
          {trustBadges.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-3 py-1.5"
            >
              <BadgeCheck className="h-3.5 w-3.5 text-emerald-300" /> {item}
            </span>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 lg:grid-cols-[1fr_1.15fr]">
        <div className="glass premium-border rounded-3xl border border-white/10 p-7 md:p-8">
          <h2 className="text-2xl font-semibold md:text-3xl">
            Sem automacao, voce paga caro pela ineficiencia.
          </h2>
          <div className="mt-5 space-y-3">
            {pains.map((item) => (
              <p key={item} className="flex items-start gap-3 text-sm text-muted md:text-base">
                <CheckCircle2 className="h-5 w-5 text-brand" />
                {item}
              </p>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-red-300/20 bg-red-400/10 p-4 text-sm text-red-100">
            Enquanto voce demora para responder, seu concorrente fecha.
          </div>
        </div>

        <div className="glass premium-border animate-float rounded-3xl border border-white/10 p-5 md:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold md:text-2xl">Demonstracao visual - WhatsApp</h2>
            <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs text-emerald-200">
              Online agora
            </span>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#0b1220] p-4 text-sm">
            <div className="mb-3 flex items-center gap-2 border-b border-white/10 pb-3 text-xs text-muted">
              <MessageSquareText className="h-4 w-4 text-emerald-300" /> Conversa em tempo real
            </div>
            <div className="space-y-3">
              <div className="ml-auto max-w-[80%] rounded-2xl bg-[#2d3b57] px-4 py-3">
                Oi! Quanto custa o combo corte + barba hoje?
              </div>
              <div className="max-w-[92%] rounded-2xl bg-brand/30 px-4 py-3 text-white">
                Perfeito! O combo esta por R$ 89,90 e dura 70 min. Tenho 16:30 e 18:00 hoje. Qual
                horario prefere para garantir sua vaga?
              </div>
              <div className="ml-auto max-w-[70%] rounded-2xl bg-[#2d3b57] px-4 py-3">
                18:00 pode ser.
              </div>
              <div className="max-w-[92%] rounded-2xl bg-brand/30 px-4 py-3 text-white">
                Fechado, agendado para 18:00. Se quiser, ja te envio as orientacoes de chegada.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <h3 className="mb-3 text-center text-3xl font-semibold md:text-4xl">Como funciona</h3>
        <p className="mx-auto mb-8 max-w-2xl text-center text-sm text-muted md:text-base">
          Estrutura simples para operar com padrao enterprise sem aumentar sua equipe.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {howItWorks.map((item) => (
            <article key={item.title} className="glass premium-border rounded-2xl border border-white/10 p-5">
              <p className="text-lg font-semibold">{item.title}</p>
              <p className="mt-2 text-sm text-muted">{item.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <h3 className="mb-3 text-center text-3xl font-semibold md:text-4xl">Provas sociais</h3>
        <p className="mx-auto mb-8 max-w-2xl text-center text-sm text-muted md:text-base">
          Exemplos ficticios para demonstrar o tipo de resultado que a plataforma busca gerar.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {socialProof.map((item) => (
            <article key={item.name} className="glass premium-border rounded-2xl border border-white/10 p-5">
              <p className="inline-flex items-center gap-1 text-amber-300">
                {[...Array(5)].map((_, index) => (
                  <Star key={`${item.name}-${index}`} className="h-4 w-4 fill-amber-300" />
                ))}
              </p>
              <p className="mt-3 text-sm text-muted">"{item.quote}"</p>
              <p className="mt-4 font-semibold">{item.name}</p>
              <p className="mt-1 inline-flex items-center gap-1 text-sm text-emerald-300">
                <TrendingUp className="h-4 w-4" /> {item.result}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <h3 className="mb-6 text-center text-3xl font-semibold md:text-4xl">Planos</h3>
        <div className="grid gap-4 md:grid-cols-3">
          {plans.map((plan) => (
            <article key={plan.name} className="glass premium-border rounded-2xl border border-white/10 p-6">
              <p className="text-sm uppercase tracking-wide text-muted">{plan.name}</p>
              <p className="mt-2 text-4xl font-semibold">{plan.price}</p>
              <p className="mt-2 text-sm text-muted">{plan.desc}</p>
              <Link
                href="/register"
                className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand"
              >
                Ativar plano <ChevronRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="glass premium-border mb-14 rounded-3xl border border-white/10 p-8 text-center md:p-10">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Selo de confianca ChatLead</p>
          <h3 className="mt-3 text-3xl font-semibold md:text-4xl">
            Atendimento premium, conversao previsivel e operacao segura.
          </h3>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-muted md:text-base">
            Tenha uma estrutura de atendimento que parece time grande, mesmo com operacao enxuta.
          </p>
          <Link
            href="/register"
            className="mt-7 inline-flex rounded-xl bg-brand px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-indigo-500"
          >
            Testar agora e aumentar faturamento
          </Link>
        </div>

        <h3 className="mb-6 text-center text-3xl font-semibold">FAQ</h3>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <article key={faq.q} className="glass premium-border rounded-2xl border border-white/10 p-5">
              <p className="font-semibold">{faq.q}</p>
              <p className="mt-2 text-sm text-muted">{faq.a}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-muted md:flex-row">
          <p>ChatLead AI - Conversao inteligente de leads no WhatsApp</p>
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
