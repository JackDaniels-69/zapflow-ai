import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ChatLead AI | IA Premium para Conversao de Leads no WhatsApp",
  description:
    "Gere e converta leads no WhatsApp com IA premium, respostas humanas e automacao focada em agendamentos.",
  keywords: [
    "chatlead ai",
    "ia para whatsapp",
    "automacao whatsapp",
    "conversao de leads",
    "atendimento com ia",
    "saas de atendimento",
  ],
  openGraph: {
    title: "ChatLead AI | IA Premium para Conversao de Leads",
    description:
      "A plataforma de IA para transformar conversas de WhatsApp em leads qualificados, vendas e agendamentos.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ChatLead AI",
    description: "IA premium para gerar e converter leads via WhatsApp.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
