import React from "react";
import { SpinnerIcon } from "./Icons";

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner = React.memo(
  ({ message = "Generating..." }: LoadingSpinnerProps) => {
    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
        role="progressbar"
        aria-valuetext={message}
        aria-busy="true"
      >
        <div className="bg-white p-5 rounded-lg shadow-lg flex items-center space-x-4">
          <SpinnerIcon />
          <span className="text-gray-700 font-medium">{message}</span>
        </div>
      </div>
    );
  }
);

LoadingSpinner.displayName = "LoadingSpinner";

export default LoadingSpinner;
