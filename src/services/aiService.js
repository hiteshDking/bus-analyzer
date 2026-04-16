// OpenRouter API service - Using confirmed working free models
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

export async function analyzeBusData(query, busData) {
  if (!OPENROUTER_API_KEY) {
    return "❌ No API key found! Please add VITE_OPENROUTER_API_KEY to your .env file. Get one free from https://openrouter.ai/keys";
  }

  const prompt = `
    You are a bus route analyzer. Here is the current bus data:
    ${JSON.stringify(busData, null, 2)}
    
    User question: ${query}
    
    Answer briefly and helpfully (under 50 words). Focus on specific bus numbers and routes.
  `;

  try {
    console.log("📤 Sending to OpenRouter...");
    
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        // CRITICAL: Free models require these headers - without them you get 402 error!
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "Bus Analyzer"
      },
      body: JSON.stringify({
        // ✅ USING openrouter/free - automatically picks best available free model
        model: "openrouter/free",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 250
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error("OpenRouter Error:", data);
      if (response.status === 401) {
        return "❌ Invalid OpenRouter API key. Please check your .env file";
      }
      if (response.status === 402) {
        return "⚠️ Payment required. Free model may be unavailable. Try again or check OpenRouter status.";
      }
      if (response.status === 429) {
        return "⚠️ Rate limit reached. Please wait a moment and try again.";
      }
      return `❌ Error: ${data.error?.message || "Unknown error"}`;
    }
    
    return data.choices[0].message.content;
    
  } catch (error) {
    console.error("Network Error:", error);
    return "❌ Network error. Please check your internet connection.";
  }
}