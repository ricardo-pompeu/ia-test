// /api/gemini.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  // Só aceita requisições POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { prompt } = req.body;

    // Validação simples do prompt
    if (!prompt || prompt.trim().length === 0) {
      return res.status(400).json({ error: 'Prompt vazio' });
    }

    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Chave da API não configurada' });
    }

    // Chamada para a API do Gemini 2.5 Flash
    const response = await fetch('https://gemini.googleapis.com/v1/responses:generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gemini-2.5-flash',   // Modelo 2.5 Flash
        prompt: { text: prompt },
        temperature: 0.7
      })
    });

    // Certifica que a resposta é JSON
    const data = await response.json();

    // Extrai o texto da resposta
    const output = data.output?.[0]?.content?.[0]?.text || "Sem resposta";

    // Retorna JSON sempre
    res.status(200).json({ output });

  } catch (err) {
    console.error('Erro na API Gemini:', err);
    res.status(500).json({ error: err.message || 'Erro desconhecido' });
  }
}
