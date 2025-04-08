import { GroqClient } from "@/lib/groq/client";

// Mock fetch globally
global.fetch = jest.fn();

describe("GroqClient", () => {
  // Reset all mocks before each test
  beforeEach(() => {
    jest.resetAllMocks();
    process.env.GROQ_API_KEY = "test-api-key";
    process.env.GROQ_API_URL = "https://api.groq.com/v1/completions";
  });

  describe("constructor", () => {
    it("should throw error if API key is not set", () => {
      delete process.env.GROQ_API_KEY;
      expect(() => new GroqClient()).toThrow(
        "GROQ_API_KEY environment variable is not set"
      );
    });

    it("should throw error if API URL is not set", () => {
      delete process.env.GROQ_API_URL;
      expect(() => new GroqClient()).toThrow(
        "GROQ_API_URL environment variable is not set"
      );
    });

    it("should create instance with valid environment variables", () => {
      expect(() => new GroqClient()).not.toThrow();
    });
  });

  describe("generateText", () => {
    it("should successfully generate text", async () => {
      const mockResponse = {
        id: "test-id",
        model: "llama2-70b-4096",
        created: Date.now(),
        choices: [
          {
            index: 0,
            message: {
              role: "assistant",
              content: "Generated text response",
            },
            finish_reason: "stop",
          },
        ],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const client = new GroqClient();
      const result = await client.generateText("Test prompt");

      expect(result).toBe("Generated text response");
      expect(global.fetch).toHaveBeenCalledWith(
        process.env.GROQ_API_URL,
        expect.objectContaining({
          method: "POST",
          headers: {
            Authorization: "Bearer test-api-key",
            "Content-Type": "application/json",
          },
          body: expect.any(String),
        })
      );

      const requestBody = JSON.parse(
        (global.fetch as jest.Mock).mock.calls[0][1].body
      );
      expect(requestBody).toEqual({
        model: "llama3-70b-8192",
        messages: [
          {
            role: "user",
            content: "Test prompt",
          },
        ],
        temperature: 0.7,
        stream: false,
      });
    });

    it("should include system prompt when provided", async () => {
      const mockResponse = {
        id: "test-id",
        model: "llama2-70b-4096",
        created: Date.now(),
        choices: [
          {
            index: 0,
            message: {
              role: "assistant",
              content: "Generated text response",
            },
            finish_reason: "stop",
          },
        ],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const client = new GroqClient();
      await client.generateText("Test prompt", {
        systemPrompt: "System instruction",
      });

      const requestBody = JSON.parse(
        (global.fetch as jest.Mock).mock.calls[0][1].body
      );
      expect(requestBody.messages).toEqual([
        {
          role: "system",
          content: "System instruction",
        },
        {
          role: "user",
          content: "Test prompt",
        },
      ]);
    });

    it("should handle API errors", async () => {
      const errorMessage = "API rate limit exceeded";
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 429,
        json: async () => ({ error: { message: errorMessage } }),
      });

      const client = new GroqClient();
      await expect(client.generateText("Test prompt")).rejects.toThrow(
        errorMessage
      );
    });

    it("should handle invalid API responses", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ invalid: "response" }),
      });

      const client = new GroqClient();
      await expect(client.generateText("Test prompt")).rejects.toThrow(
        "Invalid response from Groq API"
      );
    });

    it("should handle empty API responses", async () => {
      const mockResponse = {
        id: "test-id",
        model: "llama2-70b-4096",
        created: Date.now(),
        choices: [],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const client = new GroqClient();
      await expect(client.generateText("Test prompt")).rejects.toThrow(
        "No response generated from Groq API"
      );
    });
  });
});
