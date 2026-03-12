import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-100 text-red-900 min-h-screen flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-4">Something went wrong.</h1>
          <p className="mb-4">Please report this error to support.</p>
          <div className="bg-white p-4 rounded shadow-lg overflow-auto max-w-3xl w-full">
            <h2 className="font-bold text-red-600 mb-2">Error:</h2>
            <pre className="text-sm whitespace-pre-wrap">{this.state.error?.toString()}</pre>
            {this.state.errorInfo && (
              <>
                <h2 className="font-bold text-gray-700 mt-4 mb-2">Component Stack:</h2>
                <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                  {this.state.errorInfo.componentStack}
                </pre>
              </>
            )}
          </div>
          <button 
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
