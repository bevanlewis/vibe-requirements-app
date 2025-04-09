import React from "react";
import { ErrorIcon, CloseIcon } from "./Icons";

interface ErrorDisplayProps {
  message: string;
  onDismiss: () => void;
}

const ErrorDisplay = React.memo(({ message, onDismiss }: ErrorDisplayProps) => {
  if (!message) return null;

  return (
    <div
      className="fixed bottom-4 left-4 right-4 sm:bottom-4 sm:right-4 sm:left-auto bg-red-950/50 border-l-4 border-red-500 p-3 sm:p-4 rounded shadow-lg backdrop-blur-sm"
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <ErrorIcon />
        </div>
        <div className="ml-3 flex-grow">
          <p className="text-sm text-red-200">{message}</p>
        </div>
        <div className="ml-2 sm:ml-3">
          <button
            onClick={onDismiss}
            className="inline-flex rounded-md p-1.5 text-red-400 hover:bg-red-900/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            aria-label="Dismiss error"
          >
            <CloseIcon />
          </button>
        </div>
      </div>
    </div>
  );
});

ErrorDisplay.displayName = "ErrorDisplay";

export default ErrorDisplay;
