import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

export const getSmartAdvice = async (context: string, language: string = 'English') => {
  // Demo Mode Fallback
  if (!apiKey || apiKey.includes('placeholder')) {
    const lowerContext = context.toLowerCase();
    let advice = "";

    if (lowerContext.includes('incident') || lowerContext.includes('malfunction')) {
      advice = "Attention: We have detected a technical delay at this station. Please remain calm; officials are resolving the issue. Your right to vote is protected—stay in line.";
    } else if (lowerContext.includes('busy') || lowerContext.includes('60') || lowerContext.includes('120')) {
      advice = "High wait times detected. We recommend bringing a bottle of water and ensuring your ID is ready to expedite the process once you reach the front.";
    } else if (lowerContext.includes('warning') || lowerContext.includes('10 pm')) {
      advice = "IMPORTANT: As long as you are in line by the closing time, you are legally permitted to cast your ballot. Do not let anyone turn you away if you are already in the queue.";
    } else if (lowerContext.includes('no') && lowerContext.includes('correct precinct')) {
      advice = "URGENT: You appear to be at the wrong polling location. This may prevent your vote from being counted. Please check the 'Precinct Guard' navigation for the fastest route to your assigned booth.";
    } else {
      advice = "This station is currently operational with minimal delays. Please proceed and follow the instructions of the polling agents.";
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
    if (language !== 'English') advice += ` (Note: Multilingual support for ${language} is active in Live mode).`;
    return `[Civic Assistant] ${advice}`;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Using gemini-2.5-flash as requested
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are a Civic Navigator Assistant. Given the following context about a polling station and a user's situation, provide concise, calm, and helpful advice in ${language} to ensure they can vote successfully. Focus on de-escalation and clarity.

Context: ${context}

Advice:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error("Gemini API Error Details:", error);
    return `AI Error: ${error.message || "Gemini 2.5 Flash model failed. Please verify your API Key access and model availability."}`;
  }
};
