import dotenv from "dotenv";
import fetch from "node-fetch";
import { GroqClient } from "@/lib/groq/client";

// Provide fetch globally
global.fetch = fetch as unknown as typeof global.fetch;

// Load environment variables from .env file
dotenv.config();

describe("GroqClient Manual Tests", () => {
  beforeAll(() => {
    // Verify environment variables are loaded
    if (!process.env.GROQ_API_KEY || !process.env.GROQ_API_URL) {
      console.error(
        "Environment variables not found. Make sure .env file exists with GROQ_API_KEY and GROQ_API_URL"
      );
    }
  });

  it("should connect to Groq API and generate a response", async () => {
    const client = new GroqClient();
    const response = await client.generateText("Write a short greeting.", {
      systemPrompt: "You are a friendly AI assistant.",
      temperature: 0.7,
      maxTokens: 100,
    });

    console.log("API Response:", response);
    expect(response).toBeTruthy();
    expect(typeof response).toBe("string");
    expect(response.length).toBeGreaterThan(0);
  }, 30000); // Increased timeout for API call
});
