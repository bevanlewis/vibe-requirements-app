import React from "react";
import { SpinnerIcon } from "./Icons";

interface InputSectionProps {
  value: string;
  onChange: (value: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const InputSection = React.memo(
  ({ value, onChange, onGenerate, isLoading }: InputSectionProps) => {
    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        <div className="bg-secondary rounded-lg shadow-sm p-4">
          <textarea
            className="w-full h-48 p-4 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent resize-none placeholder-secondary-foreground/50"
            placeholder="What do you want to build?"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-label="Project description"
            aria-required="true"
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
              aria-busy={isLoading}
              aria-label={
                isLoading ? "Generating content..." : "Generate content"
              }
            >
              <span className="flex items-center">
                {isLoading && <SpinnerIcon />}
                {isLoading ? "Generating..." : "Generate"}
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }
);

InputSection.displayName = "InputSection";

export default InputSection;
