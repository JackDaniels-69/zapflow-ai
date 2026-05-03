"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, Send } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  ts: string;
}

interface RealChatProps {
  companyId: string;
  contactName?: string;
  contactPhone?: string;
}

function timestamp() {
  return new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

export default function RealChat({
  companyId,
  contactName = "Visitante",
  contactPhone = "+5500000000000",
}: RealChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Olá! 👋 Como posso te ajudar hoje?",
      ts: timestamp(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || isTyping) return;

    setMessages((prev) => [...prev, { role: "user", content: text, ts: timestamp() }]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/ai/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId, contactName, contactPhone, message: text }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply ?? "Não consegui gerar uma resposta.",
          ts: timestamp(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Erro de conexão. Tente novamente.", ts: timestamp() },
      ]);
    } finally {
      setIsTyping(false);
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div
      className="flex flex-col overflow-hidden rounded-3xl border border-white/10 shadow-2xl"
      style={{ height: 520 }}
    >
      {/* Header */}
      <div className="flex shrink-0 items-center gap-3 border-b border-white/10 bg-[#075e54] px-4 py-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-400/20 ring-2 ring-emerald-400/40">
          <Bot className="h-4 w-4 text-emerald-300" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">ChatLead AI</p>
          <p className="text-xs text-emerald-300">
            {isTyping ? "digitando..." : "online agora"}
          </p>
        </div>
        <span className="ml-auto flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_2px_rgba(52,211,153,0.6)]" />
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto space-y-2 px-4 py-4"
        style={{ background: "linear-gradient(180deg,#1a1a2e 0%,#16213e 100%)" }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`relative max-w-[78%] rounded-2xl px-3 py-2 text-sm shadow ${
                msg.role === "user"
                  ? "rounded-br-sm bg-[#005c4b] text-white"
                  : "rounded-bl-sm bg-[#1f2c34] text-gray-100"
              }`}
            >
              <p className="leading-relaxed">{msg.content}</p>
              <p className="mt-1 text-right text-[10px] text-white/40">{msg.ts}</p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm bg-[#1f2c34] px-4 py-3 shadow">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-emerald-400"
                  style={{
                    animation: "bounce 1.2s infinite",
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 flex items-center gap-2 border-t border-white/10 bg-[#0d1117] px-3 py-3">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Digite uma mensagem..."
          disabled={isTyping}
          className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder-white/30 outline-none transition focus:border-emerald-400/50 focus:bg-white/10 disabled:opacity-50"
        />
        <button
          onClick={sendMessage}
          disabled={isTyping || !input.trim()}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow transition hover:bg-emerald-400 disabled:opacity-40"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
}
