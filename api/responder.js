import { generateResponse } from "../src/logic/responder.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Método não permitido" });

  try {
    const { text } = req.body;
    const result = await generateResponse(text);
    res.status(200).json(result);
  } catch (err) {
    console.error("Erro no responder:", err);
    res.status(500).json({ text: "Erro interno no bot. Tente novamente em instantes." });
  }
}
