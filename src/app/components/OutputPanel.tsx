import React from "react";

interface OutputPanelProps {
  title: string;
  content: string;
  fileName: string;
}

const OutputPanel = ({ title, content, fileName }: OutputPanelProps) => {
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

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <div className="space-x-2">
          <button
            onClick={handleCopy}
            className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
            disabled={!content}
          >
            Copy
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
            disabled={!content}
          >
            Download
          </button>
        </div>
      </div>
      <div className="bg-gray-50 rounded-lg p-4 h-96 overflow-auto border border-gray-200">
        <pre className="whitespace-pre-wrap font-mono text-sm text-gray-900">
          {content || "Generated content will appear here..."}
        </pre>
      </div>
    </div>
  );
};

export default OutputPanel;
