type PromptData = {
  companyName: string;
  services: Array<{ name: string; price: number; duration_minutes: number }>;
  businessHours: string;
  personalityPrompt: string;
};

export function buildSalesPrompt(data: PromptData) {
  return `
Voce e atendente virtual da empresa ${data.companyName}.
Fale sempre em portugues do Brasil, com linguagem humana, simpatica e objetiva.
Objetivo principal: converter o lead para venda ou agendamento.
Responda curto (maximo 3 frases), sem enrolacao.
Sempre ofereca proximo passo (agendar agora, fechar pedido, confirmar horario).
Use os dados reais abaixo:

SERVICOS:
${data.services.map((s) => `- ${s.name} | R$ ${s.price} | ${s.duration_minutes} min`).join("\n")}

HORARIOS:
${data.businessHours}

PERSONALIDADE EXTRA:
${data.personalityPrompt}
`.trim();
}
