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
      <div className="bg-secondary rounded-lg shadow-sm p-4">
        <textarea
          className="w-full h-48 p-4 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent resize-none placeholder-secondary-foreground/50"
          placeholder="What do you want to build?"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <div className="mt-4">
          <button
            className={`px-6 py-2 rounded-lg text-primary-foreground font-medium transition-colors ${
              isLoading
                ? "bg-primary/70 cursor-not-allowed"
                : "bg-primary hover:bg-primary/90"
            }`}
            onClick={onGenerate}
            disabled={isLoading || !value.trim()}
          >
            <span className="flex items-center">
              {isLoading && (
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              {isLoading ? "Generating..." : "Generate"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputSection;
