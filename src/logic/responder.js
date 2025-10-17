import OpenAI from "openai";

const USE_AI = process.env.USE_AI === "true";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = USE_AI && OPENAI_API_KEY ? new OpenAI({ apiKey: OPENAI_API_KEY }) : null;

const fallback = [
  "Enquanto aguarda o atendimento, pode me contar como posso ajudar?",
  "Alguém já vai te atender, mas se puder já descreva como posso ajudar?",
  "Até que alguém te atenda, me diz como posso ser útil?"
];

let lastFallback = -1;

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia! Tudo bem? Como posso ajudar hoje?";
  if (hour < 18) return "Boa tarde! Em que posso ser útil?";
  return "Boa noite! Como posso ajudar?";
}

function getFallback() {
  const choices = fallback.filter((_, i) => i !== lastFallback);
  const idx = Math.floor(Math.random() * choices.length);
  lastFallback = idx;
  return choices[idx];
}

export async function generateResponse(message) {
  if (!message?.trim()) return { text: "Não entendi — pode repetir?" };

  const norm = message.toLowerCase();

  if (/\b(oi|olá|ola|eae|salve)\b/.test(norm)) return { text: getGreeting() };
  if (/\b(obrigado|valeu|vlw)\b/.test(norm)) return { text: "De nada! Sempre à disposição." };
  if (/\b(tchau|até|flw)\b/.test(norm)) return { text: "Até mais! Se precisar de algo, é só chamar." };

  if (/\b(preço|valor|quanto custa)\b/.test(norm))
    return { text: "Nossos preços são os melhores do mercado. Um vendedor já vai te atender.", sector: "vendas" };

  if (/\b(suporte|erro|problema|ajuda)\b/.test(norm))
    return { text: "Já encaminhei seu atendimento para o suporte técnico.", sector: "suporte" };

  if (USE_AI && openai) {
    const resp = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "Você é um assistente direto e educado em português." },
        { role: "user", content: message }
      ],
      max_tokens: 200,
      temperature: 0.7
    });
    return { text: resp.choices[0].message.content.trim() };
  }

  return { text: getFallback() };
}
