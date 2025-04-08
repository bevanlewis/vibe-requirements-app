import React, { useState } from "react";

interface OutputPanelProps {
  title: string;
  content: string;
  fileName: string;
  isEditable?: boolean;
  onContentChange?: (newContent: string) => void;
}

const OutputPanel = ({
  title,
  content,
  fileName,
  isEditable = false,
  onContentChange,
}: OutputPanelProps) => {
  const [isEditMode, setIsEditMode] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      // You might want to add a toast notification here
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onContentChange?.(e.target.value);
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  return (
    <div
      className={`bg-secondary rounded-lg shadow-sm p-4 ${
        isEditMode ? "ring-2 ring-primary" : ""
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <div className="space-x-2">
          {isEditable && (
            <button
              onClick={toggleEditMode}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                isEditMode
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary-foreground/10 hover:bg-secondary-foreground/20"
              }`}
            >
              {isEditMode ? "Done" : "Edit"}
            </button>
          )}
          <button
            onClick={handleCopy}
            className="px-4 py-2 text-sm bg-secondary-foreground/10 hover:bg-secondary-foreground/20 rounded-lg transition-colors"
            disabled={!content}
          >
            Copy
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 text-sm bg-secondary-foreground/10 hover:bg-secondary-foreground/20 rounded-lg transition-colors"
            disabled={!content}
          >
            Download
          </button>
        </div>
      </div>
      <div
        className={`bg-input rounded-lg p-4 h-96 overflow-auto border transition-colors ${
          isEditMode ? "border-primary" : "border-border"
        }`}
      >
        {isEditable && isEditMode ? (
          <textarea
            value={content}
            onChange={handleChange}
            className="w-full h-full bg-transparent font-mono text-sm resize-none focus:outline-none"
            placeholder="Generated content will appear here..."
          />
        ) : (
          <pre className="whitespace-pre-wrap font-mono text-sm">
            {content || "Generated content will appear here..."}
          </pre>
        )}
      </div>
    </div>
  );
};

export default OutputPanel;
