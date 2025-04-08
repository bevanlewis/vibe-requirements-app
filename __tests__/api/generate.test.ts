import { POST } from "@/app/api/generate/route";

// Mock the GroqClient
jest.mock("@/lib/groq/client", () => ({
  GroqClient: jest.fn().mockImplementation(() => ({
    generateText: jest.fn().mockResolvedValue(`
===PRD START===
# Mock PRD
This is a test PRD
===PRD END===
===TODO START===
- [ ] Task 1
- [ ] Task 2
===TODO END===
    `),
  })),
}));

// Mock the Request object since we're in a Node.js environment
global.Request = class MockRequest {
  private url: string;
  private options: RequestInit;

  constructor(url: string, options: RequestInit = {}) {
    this.url = url;
    this.options = options;
  }

  async json() {
    return JSON.parse(this.options.body as string);
  }
} as unknown as typeof Request;

describe("Generate API", () => {
  beforeEach(() => {
    // Set required environment variables
    process.env.GROQ_API_KEY = "test-key";
    process.env.GROQ_API_URL = "https://api.test.com";
  });

  it("should generate PRD and Todo list from prompt", async () => {
    // Create a mock request with valid data
    const mockRequest = new Request("http://localhost:3000/api/generate", {
      method: "POST",
      body: JSON.stringify({ prompt: "Create a todo list app" }),
    });

    // Call the API endpoint
    const response = await POST(mockRequest);
    const data = await response.json();

    // Check if the response has the correct status
    expect(response.status).toBe(200);

    // Check if the response contains the expected data structure
    expect(data).toHaveProperty("prd", "# Mock PRD\nThis is a test PRD");
    expect(data).toHaveProperty("todo", "- [ ] Task 1\n- [ ] Task 2");
  });

  it("should return 400 for empty prompt", async () => {
    // Create a mock request with invalid data
    const mockRequest = new Request("http://localhost:3000/api/generate", {
      method: "POST",
      body: JSON.stringify({ prompt: "" }),
    });

    // Call the API endpoint
    const response = await POST(mockRequest);
    const data = await response.json();

    // Check if the response has the correct error status
    expect(response.status).toBe(400);
    expect(data).toHaveProperty("error", "Invalid request data");
    expect(data).toHaveProperty("details");
  });

  it("should return 400 for missing prompt", async () => {
    // Create a mock request with missing prompt
    const mockRequest = new Request("http://localhost:3000/api/generate", {
      method: "POST",
      body: JSON.stringify({}),
    });

    // Call the API endpoint
    const response = await POST(mockRequest);
    const data = await response.json();

    // Check if the response has the correct error status
    expect(response.status).toBe(400);
    expect(data).toHaveProperty("error", "Invalid request data");
    expect(data).toHaveProperty("details");
  });
});
