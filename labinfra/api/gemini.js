// /api/gemini.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { prompt } = req.body;

    // Verifica se o prompt existe
    if (!prompt || prompt.trim().length === 0) {
      return res.status(400).json({ output: 'Prompt vazio. Por favor, insira uma descrição do mineral.' });
    }

    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ output: 'Chave da API não configurada no Vercel.' });
    }

    // Chamada para a API do Gemini 2.5 Flash
    const response = await fetch('https://gemini.googleapis.com/v1/responses:generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gemini-2.5-flash',
        prompt: { text: prompt },
        temperature: 0.7
      })
    });

    let data;
    try {
      data = await response.json(); // tenta extrair JSON
    } catch (parseErr) {
      console.error("Falha ao fazer parse do JSON da Gemini:", parseErr);
      // Retorna mensagem de erro como JSON
      return res.status(200).json({ output: 'Erro ao processar resposta da IA (JSON inválido).' });
    }

    // Extrai o texto da resposta
    const output = data.output?.[0]?.content?.[0]?.text || "Sem resposta da IA.";

    // Retorna sempre JSON
    res.status(200).json({ output });

  } catch (err) {
    console.error("Erro na API /api/gemini:", err);
    // Retorna sempre JSON, mesmo em erro interno
    res.status(500).json({ output: `Erro interno: ${err.message || 'desconhecido'}` });
  }
}
