import {
  constructSystemPrompt,
  constructUserPrompt,
  parseResponse,
} from "@/lib/groq/prompt";

describe("Prompt Construction and Parsing", () => {
  describe("constructSystemPrompt", () => {
    it("should return a string containing all required instructions", () => {
      const systemPrompt = constructSystemPrompt();

      // Check for key instructions
      expect(systemPrompt).toContain(
        "Generate a detailed Product Requirements Document (PRD)"
      );
      expect(systemPrompt).toContain("Generate a Todo list");
      expect(systemPrompt).toContain("===PRD START===");
      expect(systemPrompt).toContain("===PRD END===");
      expect(systemPrompt).toContain("===TODO START===");
      expect(systemPrompt).toContain("===TODO END===");

      // Check for formatting instructions
      expect(systemPrompt).toContain("Format BOTH outputs as valid Markdown");
      expect(systemPrompt).toContain("- [ ] Task description");
    });
  });

  describe("constructUserPrompt", () => {
    it("should include the user's input in the prompt", () => {
      const userInput = "Create a todo list app";
      const userPrompt = constructUserPrompt(userInput);

      expect(userPrompt).toContain(userInput);
      expect(userPrompt).toContain("Please create a PRD and Todo list");
      expect(userPrompt).toContain("Remember to use the specified delimiters");
    });
  });

  describe("parseResponse", () => {
    it("should correctly parse a properly formatted response", () => {
      const mockResponse = `Some prefix text
===PRD START===
# Product Requirements Document
## Overview
This is a test PRD
===PRD END===
Some middle text
===TODO START===
- [ ] Task 1
- [ ] Task 2
===TODO END===
Some suffix text`;

      const result = parseResponse(mockResponse);

      expect(result).toEqual({
        prd: "# Product Requirements Document\n## Overview\nThis is a test PRD",
        todo: "- [ ] Task 1\n- [ ] Task 2",
      });
    });

    it("should throw error if PRD section is missing", () => {
      const mockResponse = `
===TODO START===
- [ ] Task 1
===TODO END===`;

      expect(() => parseResponse(mockResponse)).toThrow(
        "Failed to parse response"
      );
    });

    it("should throw error if Todo section is missing", () => {
      const mockResponse = `
===PRD START===
# PRD Content
===PRD END===`;

      expect(() => parseResponse(mockResponse)).toThrow(
        "Failed to parse response"
      );
    });

    it("should handle whitespace in delimiters", () => {
      const mockResponse = `
===PRD START===  

# PRD Content

===PRD END===  
===TODO START===  

- [ ] Task 1

===TODO END===  `;

      const result = parseResponse(mockResponse);

      expect(result).toEqual({
        prd: "# PRD Content",
        todo: "- [ ] Task 1",
      });
    });
  });
});
