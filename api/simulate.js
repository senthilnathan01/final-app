import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url, age, occupation, techSavviness, goal } = req.body;

  try {
    const prompt = `
    Simulate System 1 thinking for:
    - User profile: ${age}-year-old ${occupation}
    - Tech savviness: ${techSavviness}/10
    - Website: ${url}
    - Current goal: ${goal}

    Generate 3 potential intuitive actions with confidence scores.
    Respond in this JSON format:
    {
      "actions": [
        {
          "action": "click_button",
          "target": "button text/description",
          "reason": "intuitive explanation",
          "confidence": 0-100
        }
      ]
    }
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 300
    });

    const result = JSON.parse(completion.choices[0].message.content);
    res.status(200).json(result);
    
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      details: error.response?.data 
    });
  }
}
