export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { prompt } = req.body;

  // Aqui você colocaria a chamada à sua IA (OpenAI, Gemini, etc.)
  // Por enquanto, vamos responder com uma simulação
  const respostaSimulada = `
Com base na sua descrição, os minerais mais prováveis são:
---
### **1. Quartzo**
- (**SiO2**)
* **Por que pode ser este mineral?** Cor e dureza combinam com as propriedades descritas.
* **Características Principais:**
  * **Cor:** Incolor, branco, rosa
  * **Brilho:** Vítreo
  * **Dureza:** 7
  * **Traço:** Branco
  * **Clivagem/Fratura:** Fratura concoidal
`;

  res.status(200).json({ output: respostaSimulada });
}
