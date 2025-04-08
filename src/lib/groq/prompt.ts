import { z } from "zod";

// Schema for parsed response
export const ParsedResponseSchema = z.object({
  prd: z.string(),
  todo: z.string(),
});

export type ParsedResponse = z.infer<typeof ParsedResponseSchema>;

// Delimiters for the response sections
const DELIMITERS = {
  PRD_START: "===PRD START===",
  PRD_END: "===PRD END===",
  TODO_START: "===TODO START===",
  TODO_END: "===TODO END===",
} as const;

/**
 * Constructs the system prompt for the Groq API
 */
export function constructSystemPrompt(): string {
  return `You are a professional product manager and technical writer. Your task is to:
1. Generate a detailed Product Requirements Document (PRD) based on the user's prompt.
2. Generate a Todo list based ONLY on the requirements in the PRD you just generated.
3. Format BOTH outputs as valid Markdown.
4. Structure your response using these exact delimiters:
   ${DELIMITERS.PRD_START}
   [PRD content in Markdown]
   ${DELIMITERS.PRD_END}
   ${DELIMITERS.TODO_START}
   [Todo list content in Markdown]
   ${DELIMITERS.TODO_END}

For the PRD:
- Include a clear title and overview
- List functional requirements
- List technical requirements
- Use proper Markdown formatting

For the Todo list:
- Break down the requirements into actionable tasks
- Use Markdown checkbox format: "- [ ] Task description"
- Organize tasks logically (e.g., frontend, backend, testing)
- Include all necessary implementation details`;
}

/**
 * Constructs the user prompt for the Groq API
 */
export function constructUserPrompt(userInput: string): string {
  return `Please create a PRD and Todo list for the following application idea:

${userInput}

Remember to use the specified delimiters to separate the PRD and Todo list in your response.`;
}

/**
 * Parses the response from the Groq API into separate PRD and Todo sections
 */
export function parseResponse(response: string): ParsedResponse {
  // Extract PRD content
  const prdMatch = response.match(
    new RegExp(
      `${DELIMITERS.PRD_START}\\s*([\\s\\S]*?)\\s*${DELIMITERS.PRD_END}`
    )
  );

  // Extract Todo content
  const todoMatch = response.match(
    new RegExp(
      `${DELIMITERS.TODO_START}\\s*([\\s\\S]*?)\\s*${DELIMITERS.TODO_END}`
    )
  );

  if (!prdMatch?.[1] || !todoMatch?.[1]) {
    throw new Error(
      "Failed to parse response: Could not find properly delimited PRD and Todo sections"
    );
  }

  return {
    prd: prdMatch[1].trim(),
    todo: todoMatch[1].trim(),
  };
}
