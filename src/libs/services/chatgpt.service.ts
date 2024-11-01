import OpenAI from "openai";
import env from '../../env'

const openai = new OpenAI({
  apiKey: env.OPENAI_KEY,
});

export class ChatGPTService {
  async summarizeContentToVietnamese(message: string) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant.",
          },
          {
            role: "user",
            content: `You are an expert in software and proficient in both Vietnamese and Japanese. Please summarize the content of the article to Vietnamese: "${message}".\nRequest: No Yapping, Limit Prose, No Fluff.`,
          },
        ],
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error("Error sending message to OpenAI", error);
    }
  }
}
const chatService = new ChatGPTService()

export default chatService