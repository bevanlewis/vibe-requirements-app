import { NextResponse } from "next/server";
import { z } from "zod";

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

    // TODO: Implement Groq API integration in Task 1.4
    // For now, return a mock response with the validated prompt
    return NextResponse.json({
      prompt, // Include the validated prompt in response for testing
      prd: "# Mock PRD\n\nThis is a placeholder PRD.",
      todo: "# Mock Todo\n\n- [ ] First task\n- [ ] Second task",
    });
  } catch (error) {
    console.error("Error in generate endpoint:", error);

    // Return appropriate error response
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
