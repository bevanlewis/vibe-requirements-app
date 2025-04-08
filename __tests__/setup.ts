// Mock NextResponse
jest.mock("next/server", () => ({
  NextResponse: {
    json: (body: unknown, init?: ResponseInit) => ({
      status: init?.status || 200,
      json: async () => body,
    }),
  },
}));

// Mock Request
class MockRequest {
  private body: string;

  constructor(input: RequestInfo | URL, init?: RequestInit) {
    this.body = (init?.body as string) || "";
  }

  async json() {
    return JSON.parse(this.body);
  }
}

// Set up global mocks
Object.defineProperty(global, "Request", {
  writable: true,
  value: MockRequest,
});

export {};
