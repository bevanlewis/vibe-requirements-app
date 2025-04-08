"use client";

import React, { useState } from "react";
import Header from "./components/Header";
import InputSection from "./components/InputSection";
import OutputPanel from "./components/OutputPanel";
import ErrorDisplay from "./components/ErrorDisplay";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [prdContent, setPrdContent] = useState("");
  const [todoContent, setTodoContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasGenerated, setHasGenerated] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to generate content");
      }

      const data = await response.json();
      setPrdContent(data.prd);
      setTodoContent(data.todo);
      setHasGenerated(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrdChange = (newContent: string) => {
    setPrdContent(newContent);
  };

  const handleTodoChange = (newContent: string) => {
    setTodoContent(newContent);
  };

  return (
    <main className="min-h-screen">
      <Header />

      <div className="container mx-auto py-8">
        <InputSection
          value={prompt}
          onChange={setPrompt}
          onGenerate={handleGenerate}
          isLoading={isLoading}
        />

        {hasGenerated && (
          <div className="grid md:grid-cols-2 gap-6 mt-8 px-4">
            <OutputPanel
              title="PRD Document"
              content={prdContent}
              fileName="requirements"
              onContentChange={handlePrdChange}
              isEditable={true}
            />
            <OutputPanel
              title="Todo List"
              content={todoContent}
              fileName="todo"
              onContentChange={handleTodoChange}
              isEditable={true}
            />
          </div>
        )}
      </div>

      {error && <ErrorDisplay message={error} onDismiss={() => setError("")} />}
    </main>
  );
}
