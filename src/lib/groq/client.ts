import { z } from "zod";

// Response schema for validation
const GroqResponseSchema = z.object({
  id: z.string(),
  model: z.string(),
  created: z.number(),
  choices: z.array(
    z.object({
      index: z.number(),
      message: z.object({
        role: z.string(),
        content: z.string(),
      }),
      finish_reason: z.string().nullable(),
    })
  ),
});

type GroqResponse = z.infer<typeof GroqResponseSchema>;

interface GroqRequestBody {
  model: string;
  messages: {
    role: "system" | "user" | "assistant";
    content: string;
  }[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

export class GroqError extends Error {
  constructor(message: string, public status?: number, public code?: string) {
    super(message);
    this.name = "GroqError";
  }
}

export class GroqClient {
  private apiKey: string;
  private apiUrl: string;

  constructor() {
    const apiKey = process.env.GROQ_API_KEY;
    const apiUrl = process.env.GROQ_API_URL;

    if (!apiKey) {
      throw new GroqError("GROQ_API_KEY environment variable is not set");
    }

    if (!apiUrl) {
      throw new GroqError("GROQ_API_URL environment variable is not set");
    }

    this.apiKey = apiKey;
    this.apiUrl = apiUrl;
  }

  /**
   * Send a request to the Groq API
   */
  async sendRequest(body: GroqRequestBody): Promise<GroqResponse> {
    try {
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        let errorMessage = "Failed to communicate with Groq API";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error?.message || errorMessage;
        } catch {
          // If we can't parse the error response, use the default message
        }

        throw new GroqError(errorMessage, response.status);
      }

      const data = await response.json();

      // Validate the response
      const validatedResponse = GroqResponseSchema.parse(data);
      return validatedResponse;
    } catch (error) {
      if (error instanceof GroqError) {
        throw error;
      }

      if (error instanceof z.ZodError) {
        throw new GroqError("Invalid response from Groq API", 500);
      }

      throw new GroqError(
        error instanceof Error ? error.message : "Unknown error occurred",
        500
      );
    }
  }

  /**
   * Generate text using the Groq API
   */
  async generateText(
    prompt: string,
    options: {
      systemPrompt?: string;
      temperature?: number;
      maxTokens?: number;
    } = {}
  ): Promise<string> {
    const messages: GroqRequestBody["messages"] = [];

    if (options.systemPrompt) {
      messages.push({
        role: "system",
        content: options.systemPrompt,
      });
    }

    messages.push({
      role: "user",
      content: prompt,
    });

    const response = await this.sendRequest({
      model: "llama-3.3-70b-versatile", // Updated to currently available model
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens,
      stream: false,
    });

    // Get the generated text from the first choice
    const generatedText = response.choices[0]?.message.content;
    if (!generatedText) {
      throw new GroqError("No response generated from Groq API");
    }

    return generatedText;
  }
}
