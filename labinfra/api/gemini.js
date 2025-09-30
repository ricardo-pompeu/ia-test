// /api/gemini.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { prompt } = req.body;

  try {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

    const response = await fetch('https://gemini.googleapis.com/v1/responses:generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gemini-1.5',
        prompt: { text: prompt },
        temperature: 0.7
      })
    });

    // Certifique-se de que a resposta é JSON
    const data = await response.json();

    // data pode estar vazio se a API retornar erro
    const output = data.output?.[0]?.content?.[0]?.text || "Sem resposta";

    res.status(200).json({ output });

  } catch (err) {
    console.error(err);
    // Sempre retorna JSON
    res.status(500).json({ error: err.message });
  }
}
