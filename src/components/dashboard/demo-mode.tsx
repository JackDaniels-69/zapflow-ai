  "use client";
  import { useEffect, useMemo, useState } from "react";
  import { Activity, Bot, CalendarCheck2, MessageCircle, Users, Zap } from "lucide-react";

  type DemoStep = {
    client: string;
    phone: string;
    message: string;
    aiReply: string;
    converted: boolean;
    booked: boolean;
  };

  type DemoConversation = DemoStep & {
    id: string;
    timestamp: string;
  };

  const script: DemoStep[] = [
    {
      client: "Camila",
      phone: "+55 11 98765-1101",
      message: "Oi, quanto custa design de sobrancelha?",
      aiReply: "Ola, Camila! O design custa R$45 e leva 30 minutos. Tenho horario hoje as 16:30, deseja agendar?",
      converted: true,
      booked: true,
    },
    {
      client: "Rafael",
      phone: "+55 11 97654-2202",
      message: "Vocês atendem no sabado?",
      aiReply: "Atendemos sim, das 9h as 14h. Posso te reservar sabado as 10h ou 11h, qual prefere?",
      converted: true,
      booked: false,
    },
    {
      client: "Bianca",
      phone: "+55 11 96543-3303",
      message: "Tem pacote cabelo + maquiagem?",
      aiReply: "Temos sim, pacote premium por R$189. Se quiser, ja confirmo um horario para voce nesta semana.",
      converted: false,
      booked: false,
    },
    {
      client: "Leonardo",
      phone: "+55 11 95432-4404",
      message: "Consegue encaixe hoje a noite?",
      aiReply: "Consigo sim! Tenho 18:00 disponivel hoje. Quer que eu confirme agora no seu nome?",
      converted: true,
      booked: true,
    },
  ];

  export function DemoMode({ companyId }: { companyId: string }) {
    const [input, setInput] = useState("");
    const [aiStatus, setAiStatus] = useState("offline");
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [tick, setTick] = useState(0);
    const [conversations, setConversations] = useState<DemoConversation[]>([]);
    const [notifications, setNotifications] = useState<string[]>([
      "Modo Demo ativo: simulacao em tempo real iniciada.",
    ]);
    const sendMessage = async () => {
        if (!input) return;
      
        setLoading(true);
      
        const res = await fetch("/api/ai/reply", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            companyId,
            message: input,
          }),
        });
      
        const data = await res.json();
      
        setMessages((prev) => [
          ...prev,
          { role: "user", text: input },
          { role: "ai", text: data.reply },
        ]);
      
        setInput("");
        setLoading(false);
      };

    useEffect(() => {
      const interval = window.setInterval(() => {
        setTick((value) => value + 1);
      }, 2600);

      return () => window.clearInterval(interval);
    }, []);

    useEffect(() => {
      const step = script[tick % script.length];
      const timestamp = new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
      const id = `${step.client}-${tick}-${Date.now()}`;

      setConversations((prev) => [{ ...step, id, timestamp }, ...prev].slice(0, 7));
      setNotifications((prev) => [
        `Nova conversa de ${step.client} (${step.phone})`,
        `IA respondeu em 3s e sugeriu ${step.booked ? "agendamento" : "proximo passo"}.`,
        ...prev,
      ].slice(0, 4));
    }, [tick]);

    const metrics = useMemo(() => {
      const responded = conversations.length;
      const clients = new Set(conversations.map((item) => item.client)).size;
      const bookings = conversations.filter((item) => item.booked).length;
      const converted = conversations.filter((item) => item.converted).length;
      const conversionRate = responded ? Math.round((converted / responded) * 100) : 0;

      return { responded, clients, bookings, conversionRate };
    }, [conversations]);

    return (
      <section className="glass premium-border rounded-3xl border border-white/10 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-300/25 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">
              <Activity className="h-3.5 w-3.5" /> Modo Demo rodando automaticamente
            </p>
            <h3 className="mt-3 text-2xl font-semibold">Demonstracao em tempo real</h3>
            <p className="mt-1 text-sm text-muted">
              Em menos de 10 segundos o visitante ve leads entrando, IA respondendo e resultados subindo.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
            <p className="inline-flex items-center gap-2">
              <span className="animate-pulse-soft h-2.5 w-2.5 rounded-full bg-emerald-300" />
              Sistema ativo agora
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="inline-flex items-center gap-2 text-xs text-muted">
              <MessageCircle className="h-4 w-4 text-brand" /> Mensagens respondidas
            </p>
            <p className="mt-2 text-3xl font-semibold">{metrics.responded}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="inline-flex items-center gap-2 text-xs text-muted">
              <Users className="h-4 w-4 text-brand" /> Clientes atendidos
            </p>
            <p className="mt-2 text-3xl font-semibold">{metrics.clients}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="inline-flex items-center gap-2 text-xs text-muted">
              <CalendarCheck2 className="h-4 w-4 text-brand" /> Agendamentos
            </p>
            <p className="mt-2 text-3xl font-semibold">{metrics.bookings}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="inline-flex items-center gap-2 text-xs text-muted">
              <Zap className="h-4 w-4 text-brand" /> Taxa de conversao
            </p>
            <p className="mt-2 text-3xl font-semibold">{metrics.conversionRate}%</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-white/10 bg-[#0b1220] p-4">
            <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-3">
              <p className="text-sm font-semibold">Conversas simuladas - WhatsApp</p>
              <p className="text-xs text-muted">Atualizacao automatica</p>
            </div>
            <div className="space-y-3">
              {conversations.map((item) => (
                <div key={item.id} className="animate-fade-up rounded-xl border border-white/10 bg-white/5 p-3 text-sm">
                  <p className="font-semibold">
                    {item.client} <span className="ml-2 text-xs font-normal text-muted">{item.timestamp}</span>
                  </p>
                  <p className="mt-1 text-muted">Cliente: {item.message}</p>
                  <p className="mt-2 rounded-lg border border-brand/30 bg-brand/15 px-2 py-1 text-brand">
                    <span className="inline-flex items-center gap-1 font-semibold">
                      <Bot className="h-3.5 w-3.5" /> IA:
                    </span>{" "}
                    {item.aiReply}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-semibold">Atividade recente</p>
              <div className="mt-3 space-y-2">
              {notifications.map((item, index) => (
    <p key={`${item}-${index}`} className="animate-fade-up rounded-lg border border-white/10">
      {item}
    </p>
  ))}
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-4">
              <p className="text-xs text-emerald-100">Resumo de impacto</p>
              <p className="mt-2 text-sm">
                A IA esta conduzindo clientes para agendamento com respostas humanas e objetivas.
              </p>
            </div>
          </div>
          <div className="mt-6 rounded-xl border border-white/10 p-4"></div>
          <div className="mb-3 flex gap-2">
            <button
              type="button"
              onClick={() => setAiStatus("online")}
              className="rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold text-white"
            >
              Ativar IA
            </button>

            <button
              type="button"
              onClick={() => setAiStatus("offline")}
              className="rounded-lg bg-red-500 px-3 py-2 text-xs font-semibold text-white"
            >
              Desativar IA
            </button>
          </div>

          <p className="mb-2 text-xs font-semibold">
            Status da IA: {aiStatus === "online" ? "Online 🟢" : "Offline 🔴"}
          </p>

          <h3 className="mb-2 text-sm font-semibold">Testar IA</h3>

          <div className="mb-3 max-h-40 space-y-2 overflow-y-auto">
            {messages.map((msg, i) => (
              <p key={i} className="text-xs">
                <strong>{msg.role === "user" ? "Você" : "IA"}:</strong> {msg.text}
              </p>
            ))}

            {loading && <p className="text-xs opacity-70">IA digitando...</p>}
          </div>

          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite algo..."
              className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs"
            />

            <button
              onClick={sendMessage}
              className="rounded-lg bg-brand px-3 py-2 text-xs font-semibold"
            >
              Enviar
            </button>
          </div>
        </div>
      </section>
    );
  }