/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, RotateCcw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Robust React Error Boundary capturing runtime exceptions
 * and providing graceful, accessible recovery actions.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an unhandled exception:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  private handleHardReload = (): void => {
    try {
      localStorage.removeItem('aura_celebrate_events_v1');
    } catch {
      // Ignore storage errors
    }
    window.location.reload();
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          role="alert"
          aria-live="assertive"
          className="min-h-screen bg-stone-100 flex items-center justify-center p-6"
        >
          <div className="bg-white rounded-2xl shadow-xl border border-stone-200 max-w-lg w-full p-8 text-center space-y-6">
            <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-bold text-stone-900 tracking-tight">
                Celebration Blueprint Encountered an Issue
              </h1>
              <p className="text-sm text-stone-600">
                An unexpected interface error occurred. Your saved plans are safe in local storage.
              </p>
            </div>

            {this.state.error && (
              <details className="text-left bg-stone-50 rounded-xl p-3 border border-stone-200 text-xs text-stone-700 font-mono">
                <summary className="cursor-pointer font-semibold text-stone-800 hover:text-stone-950">
                  Diagnostic details
                </summary>
                <p className="mt-2 text-rose-600">{this.state.error.toString()}</p>
              </details>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={this.handleReset}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retry Session</span>
              </button>

              <button
                onClick={this.handleHardReload}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium rounded-lg border border-stone-200 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset to Preset Plans</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
