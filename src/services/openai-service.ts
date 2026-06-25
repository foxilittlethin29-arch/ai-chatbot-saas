import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function getChatCompletion(
  messages: ChatMessage[],
  onChunk?: (chunk: string) => void
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful, knowledgeable AI assistant. Provide clear, concise, and accurate responses. Use markdown formatting when appropriate.",
        },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 4096,
      stream: true,
    });

    let fullResponse = "";

    for await (const chunk of response) {
      const content = chunk.choices[0]?.delta?.content || "";
      fullResponse += content;
      if (onChunk) {
        onChunk(content);
      }
    }

    return fullResponse;
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to get AI response");
  }
}

export async function generateTitle(
  message: string
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Generate a very short title (maximum 6 words) for a conversation based on the first message. Return ONLY the title, no quotes or punctuation.",
        },
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0.3,
      max_tokens: 20,
    });

    return (
      response.choices[0]?.message?.content?.trim() || "New Chat"
    );
  } catch {
    return "New Chat";
  }
}