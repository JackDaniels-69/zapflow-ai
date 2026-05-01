"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type AuthFormProps = {
  mode: "login" | "register";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isLogin = mode === "login";

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();

    const action = isLogin
      ? supabase.auth.signInWithPassword({ email, password })
      : supabase.auth.signUp({ email, password });

    const { error: authError } = await action;

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="mx-auto w-full max-w-md px-6 py-14">
      <div className="glass rounded-2xl border border-white/10 p-7">
        <h1 className="text-2xl font-semibold">{isLogin ? "Entrar no ZapFlow AI" : "Criar conta"}</h1>
        <p className="mt-2 text-sm text-muted">
          {isLogin ? "Acesse seu painel de atendimento." : "Comece sua automacao em minutos."}
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Seu e-mail"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-brand"
          />
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Sua senha"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-brand"
          />
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          <button
            disabled={loading}
            className="w-full rounded-xl bg-brand py-3 font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-60"
          >
            {loading ? "Carregando..." : isLogin ? "Entrar" : "Registrar"}
          </button>
        </form>

        <p className="mt-4 text-sm text-muted">
          {isLogin ? "Nao tem conta?" : "Ja possui conta?"}{" "}
          <Link href={isLogin ? "/register" : "/login"} className="text-brand underline">
            {isLogin ? "Criar agora" : "Fazer login"}
          </Link>
        </p>
      </div>
    </div>
  );
}
