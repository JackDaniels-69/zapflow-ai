# ChatLead AI

SaaS fullstack premium de IA para geracao e conversao de leads via WhatsApp.

## Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Auth + Postgres)
- OpenAI API

## Funcionalidades

- Landing page premium com hero, beneficios, demo, precos e FAQ
- Login, registro e logout com Supabase Auth
- Dashboard com cadastro de servicos, configuracao de IA e visualizacao de mensagens
- Endpoint para processar mensagem e responder com OpenAI
- Prompt de personalidade focado em respostas curtas, humanas e orientadas a fechamento

## Setup

1. Copie o arquivo de ambiente:

```bash
cp .env.example .env.local
```

2. Preencha as variaveis no `.env.local`.
3. Rode o schema SQL em `supabase/schema.sql`.
4. Execute o projeto:

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

## Endpoint de IA

`POST /api/whatsapp/reply`

Exemplo de payload:

```json
{
  "companyId": "uuid-da-company",
  "contactName": "Ana",
  "contactPhone": "+5511999999999",
  "message": "Quais horarios voce tem hoje?"
}
```
