export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!process.env.OPENROUTER_API_KEY) {
      return Response.json({
        reply: "OPENROUTER_API_KEY não está configurada no servidor",
      });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://zapflow-ai-chi.vercel.app",
        "X-Title": "ChatLead AI",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        temperature: 0.4,
        max_tokens: 120,
        messages: [
          {
            role: "system",
            content: `
Você é um atendente comercial de uma barbearia.

Regras:
- Responda em no máximo 2 frases.
- Nunca repita perguntas.
- Seja direto e natural.
- Não fique insistindo em agendamento em toda mensagem.
- Só ofereça agendamento quando fizer sentido.

Fluxo:
- Se o cliente perguntar preço, responda o preço e sugira agendamento.
- Se o cliente demonstrar interesse, pergunte dia e horário.
- Se o cliente já passou horário, confirme direto.

Serviços:
- Corte masculino: R$35
- Barba: R$25
- Corte + barba: R$55

Horário:
Segunda a sábado, das 08:00 às 18:00.
`,
          },
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return Response.json({
        reply: `Erro OpenRouter: ${data?.error?.message ?? response.status}`,
      });
    }

    return Response.json({
      reply: data.choices?.[0]?.message?.content ?? "Sem resposta da IA",
    });
  } catch (error) {
    return Response.json({
      reply: `Erro interno: ${error instanceof Error ? error.message : "desconhecido"}`,
    });
  }
}