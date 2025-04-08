import React from "react";

interface InputSectionProps {
  value: string;
  onChange: (value: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const InputSection = ({
  value,
  onChange,
  onGenerate,
  isLoading,
}: InputSectionProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-sm p-4">
        <textarea
          className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-500"
          placeholder="Enter your project requirements here..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <div className="mt-4">
          <button
            className={`px-6 py-2 rounded-lg text-white font-medium ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            onClick={onGenerate}
            disabled={isLoading || !value.trim()}
          >
            {isLoading ? "Generating..." : "Generate"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputSection;
