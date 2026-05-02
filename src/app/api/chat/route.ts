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
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "ChatLead AI",
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "Você é um atendente de barbearia. Responda curto, natural e tente levar o cliente para agendamento.",
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
        reply: data.choices?.[0]?.message?.content ?? JSON.stringify(data),
      });
    } catch (error) {
      return Response.json({
        reply: `Erro interno: ${error instanceof Error ? error.message : "desconhecido"}`,
      });
    }
  }