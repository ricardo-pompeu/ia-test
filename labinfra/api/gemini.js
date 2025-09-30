// /api/gemini.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { prompt } = req.body;

  try {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY; // coloque a chave em Environment Variables do Vercel

    const response = await fetch('https://gemini.googleapis.com/v1/responses:generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        // Estrutura do Gemini
        model: 'gemini-1.5', // ajuste conforme seu modelo
        prompt: {
          text: prompt
        },
        temperature: 0.7
      })
    });

    const data = await response.json();
    res.status(200).json({ output: data.output?.[0]?.content?.[0]?.text || "Sem resposta" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
