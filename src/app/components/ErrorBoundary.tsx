import React, { Component, ErrorInfo, ReactNode } from "react";
import ErrorDisplay from "./ErrorDisplay";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleDismiss = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <ErrorDisplay
          message={this.state.error?.message || "An unexpected error occurred"}
          onDismiss={this.handleDismiss}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
