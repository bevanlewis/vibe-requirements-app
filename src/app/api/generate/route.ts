import { NextResponse } from "next/server";
import { z } from "zod";
import { GroqClient } from "@/lib/groq/client";
import {
  constructSystemPrompt,
  constructUserPrompt,
  parseResponse,
} from "@/lib/groq/prompt";

// Input validation schema
const GenerateRequestSchema = z.object({
  prompt: z
    .string()
    .min(1, "Prompt is required")
    .max(5000, "Prompt is too long"),
});

/**
 * POST /api/generate
 * Generates a PRD and Todo list based on the user's prompt using the Groq API
 */
export async function POST(request: Request) {
  try {
    // Parse and validate the request body
    const body = await request.json();
    const { prompt } = GenerateRequestSchema.parse(body);

    // Initialize the Groq client
    const client = new GroqClient();

    // Generate text using constructed prompts
    const response = await client.generateText(constructUserPrompt(prompt), {
      systemPrompt: constructSystemPrompt(),
      temperature: 0.7, // Balanced between creativity and consistency
      maxTokens: 4000, // Allow for detailed PRD and Todo list
    });

    // Parse the response into PRD and Todo sections
    const { prd, todo } = parseResponse(response);

    // Return the parsed response
    return NextResponse.json({ prd, todo });
  } catch (error) {
    console.error("Error in generate endpoint:", error);

    // Return appropriate error response
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    // Handle parsing errors specifically
    if (
      error instanceof Error &&
      error.message.includes("Failed to parse response")
    ) {
      return NextResponse.json(
        { error: "Failed to parse AI response", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
