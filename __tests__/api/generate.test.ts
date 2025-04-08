import { POST } from "@/app/api/generate/route";

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
  it("should validate input and return mock data", async () => {
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
    expect(data).toHaveProperty("prompt", "Create a todo list app");
    expect(data).toHaveProperty("prd");
    expect(data).toHaveProperty("todo");
  });

  it("should return 400 for invalid input", async () => {
    // Create a mock request with invalid data (empty prompt)
    const mockRequest = new Request("http://localhost:3000/api/generate", {
      method: "POST",
      body: JSON.stringify({ prompt: "" }),
    });

    // Call the API endpoint
    const response = await POST(mockRequest);
    const data = await response.json();

    // Check if the response has the correct error status
    expect(response.status).toBe(400);

    // Check if the response contains error details
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

    // Check if the response contains error details
    expect(data).toHaveProperty("error", "Invalid request data");
    expect(data).toHaveProperty("details");
  });
});
