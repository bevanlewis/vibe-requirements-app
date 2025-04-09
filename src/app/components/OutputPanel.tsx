import React, { useState, useCallback } from "react";

interface OutputPanelProps {
  title: string;
  content: string;
  fileName: string;
  isEditable?: boolean;
  onContentChange?: (newContent: string) => void;
}

const OutputPanel = React.memo(
  ({
    title,
    content,
    fileName,
    isEditable = false,
    onContentChange,
  }: OutputPanelProps) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    const handleCopy = useCallback(async () => {
      try {
        await navigator.clipboard.writeText(content);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (err) {
        console.error("Failed to copy text:", err);
      }
    }, [content]);

    const handleDownload = useCallback(() => {
      try {
        const blob = new Blob([content], { type: "text/markdown" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${fileName}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error("Failed to download file:", err);
      }
    }, [content, fileName]);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onContentChange?.(e.target.value);
      },
      [onContentChange]
    );

    const toggleEditMode = useCallback(() => {
      setIsEditMode((prev) => !prev);
    }, []);

    return (
      <div
        className={`bg-secondary rounded-lg shadow-sm p-3 sm:p-4 ${
          isEditMode ? "ring-2 ring-primary" : ""
        }`}
        role="region"
        aria-label={title}
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-3 sm:space-y-0">
          <h2 className="text-lg sm:text-xl font-semibold" tabIndex={0}>
            {title}
          </h2>
          <div className="flex flex-wrap gap-2">
            {isEditable && (
              <button
                onClick={toggleEditMode}
                className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 text-sm rounded-lg transition-colors ${
                  isEditMode
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary-foreground/10 hover:bg-secondary-foreground/20"
                }`}
                aria-pressed={isEditMode}
                aria-label={isEditMode ? "Finish editing" : "Edit content"}
              >
                {isEditMode ? "Done" : "Edit"}
              </button>
            )}
            <button
              onClick={handleCopy}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-sm bg-secondary-foreground/10 hover:bg-secondary-foreground/20 rounded-lg transition-colors"
              disabled={!content}
              aria-label="Copy content"
              aria-disabled={!content}
            >
              {copySuccess ? "Copied!" : "Copy"}
            </button>
            <button
              onClick={handleDownload}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-sm bg-secondary-foreground/10 hover:bg-secondary-foreground/20 rounded-lg transition-colors"
              disabled={!content}
              aria-label="Download content"
              aria-disabled={!content}
            >
              Download
            </button>
          </div>
        </div>
        <div
          className={`bg-input rounded-lg p-3 sm:p-4 h-64 sm:h-96 overflow-auto border transition-colors ${
            isEditMode ? "border-primary" : "border-border"
          }`}
        >
          {isEditable && isEditMode ? (
            <textarea
              value={content}
              onChange={handleChange}
              className="w-full h-full bg-transparent font-mono text-sm resize-none focus:outline-none"
              placeholder="Generated content will appear here..."
              aria-label={`${title} content editor`}
            />
          ) : (
            <pre
              className="whitespace-pre-wrap font-mono text-sm"
              tabIndex={0}
              role="textbox"
              aria-readonly="true"
            >
              {content || "Generated content will appear here..."}
            </pre>
          )}
        </div>
      </div>
    );
  }
);

OutputPanel.displayName = "OutputPanel";

export default OutputPanel;
