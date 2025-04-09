import React from "react";
import "@testing-library/jest-dom";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import Home from "@/app/page";

// Mock the fetch function
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockResolvedValue(undefined),
  },
});

// Mock URL.createObjectURL and URL.revokeObjectURL
global.URL.createObjectURL = jest.fn();
global.URL.revokeObjectURL = jest.fn();

describe("Functional Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should handle successful generation flow", async () => {
    // Mock successful API response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          prd: "# PRD Content",
          todo: "# Todo Content",
        }),
    });

    render(<Home />);

    // Enter prompt
    const textarea = screen.getByPlaceholderText(
      /describe your idea or project here/i
    );
    await act(async () => {
      fireEvent.change(textarea, { target: { value: "Test prompt" } });
    });

    // Click generate button
    const generateButton = screen.getByText(/^generate$/i);
    await act(async () => {
      fireEvent.click(generateButton);
    });

    // Verify loading state
    await waitFor(() => {
      const button = screen.getByRole("button", { busy: true });
      expect(button).toHaveTextContent(/Generating\.\.\./i);
    });

    // Wait for results
    await waitFor(() => {
      expect(screen.getByText("# PRD Content")).toBeInTheDocument();
      expect(screen.getByText("# Todo Content")).toBeInTheDocument();
    });
  });

  it("should handle copy functionality", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          prd: "# PRD Content",
          todo: "# Todo Content",
        }),
    });

    render(<Home />);

    // Generate content first
    const textarea = screen.getByPlaceholderText(
      /describe your idea or project here/i
    );
    await act(async () => {
      fireEvent.change(textarea, { target: { value: "Test prompt" } });
      fireEvent.click(screen.getByText(/^generate$/i));
    });

    await waitFor(() => {
      expect(screen.getByText("# PRD Content")).toBeInTheDocument();
    });

    // Test copy buttons
    const copyButtons = screen.getAllByText(/copy/i);
    await act(async () => {
      fireEvent.click(copyButtons[0]); // Copy PRD
      await Promise.resolve(); // Wait for state update
      fireEvent.click(copyButtons[1]); // Copy Todo
      await Promise.resolve(); // Wait for state update
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("# PRD Content");
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      "# Todo Content"
    );

    // Fast-forward timers to clear copy success state
    act(() => {
      jest.runAllTimers();
    });
  });

  it("should handle download functionality", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          prd: "# PRD Content",
          todo: "# Todo Content",
        }),
    });

    render(<Home />);

    // Generate content first
    const textarea = screen.getByPlaceholderText(
      /describe your idea or project here/i
    );
    await act(async () => {
      fireEvent.change(textarea, { target: { value: "Test prompt" } });
      fireEvent.click(screen.getByText(/^generate$/i));
    });

    await waitFor(() => {
      expect(screen.getByText("# PRD Content")).toBeInTheDocument();
    });

    // Test download buttons
    const downloadButtons = screen.getAllByText(/download/i);
    await act(async () => {
      fireEvent.click(downloadButtons[0]); // Download PRD
      fireEvent.click(downloadButtons[1]); // Download Todo
    });

    expect(URL.createObjectURL).toHaveBeenCalledTimes(2);
    expect(URL.revokeObjectURL).toHaveBeenCalledTimes(2);
  });

  it("should handle error states", async () => {
    // Mock error response
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () =>
        Promise.resolve({
          message: "Test error message",
        }),
    });

    render(<Home />);

    // Try to generate
    const textarea = screen.getByPlaceholderText(
      /describe your idea or project here/i
    );
    await act(async () => {
      fireEvent.change(textarea, { target: { value: "Test prompt" } });
      fireEvent.click(screen.getByText(/^generate$/i));
    });

    // Verify error message
    await waitFor(() => {
      expect(screen.getByText(/test error message/i)).toBeInTheDocument();
    });
  });

  it("should handle edit mode", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          prd: "# PRD Content",
          todo: "# Todo Content",
        }),
    });

    render(<Home />);

    // Generate content first
    const textarea = screen.getByPlaceholderText(
      /describe your idea or project here/i
    );
    await act(async () => {
      fireEvent.change(textarea, { target: { value: "Test prompt" } });
      fireEvent.click(screen.getByText(/^generate$/i));
    });

    await waitFor(() => {
      expect(screen.getByText("# PRD Content")).toBeInTheDocument();
    });

    // Find and click edit buttons
    const editButtons = screen.getAllByText(/edit/i);
    await act(async () => {
      fireEvent.click(editButtons[0]); // Edit PRD
    });

    // Verify edit mode is active
    const editableTextarea = screen.getByDisplayValue("# PRD Content");
    expect(editableTextarea).toBeInTheDocument();

    // Edit content
    await act(async () => {
      fireEvent.change(editableTextarea, {
        target: { value: "# Updated PRD Content" },
      });
    });

    // Click Done
    const doneButton = screen.getByText(/done/i);
    await act(async () => {
      fireEvent.click(doneButton);
    });

    // Verify content was updated
    expect(screen.getByText("# Updated PRD Content")).toBeInTheDocument();
  });

  it("should not show output panels initially", () => {
    render(<Home />);

    // Check that output panels are not visible initially
    expect(screen.queryByText("PRD Document")).not.toBeInTheDocument();
    expect(screen.queryByText("Todo List")).not.toBeInTheDocument();
  });
});
