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
      className="fixed bottom-4 right-4 bg-red-950/50 border-l-4 border-red-500 p-4 rounded shadow-lg backdrop-blur-sm"
      role="alert"
      aria-live="assertive"
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <ErrorIcon />
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-200">{message}</p>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
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
    </div>
  );
});

ErrorDisplay.displayName = "ErrorDisplay";

export default ErrorDisplay;
