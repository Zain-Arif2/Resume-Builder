import { Component } from 'react';
import { AlertTriangle } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // In a real production setup this would also report to an error-tracking service.
    console.error('Unhandled UI error:', error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-paper-dim px-6">
          <div className="text-center max-w-sm">
            <div className="w-14 h-14 rounded-2xl bg-danger-dim flex items-center justify-center mx-auto mb-5">
              <AlertTriangle size={22} className="text-danger" />
            </div>
            <h1 className="font-display text-xl font-semibold text-ink mb-2">Something went wrong</h1>
            <p className="text-slate text-sm mb-6">
              An unexpected error occurred. Try reloading the page, if the problem continues, please try again later.
            </p>
            <button
              onClick={this.handleReload}
              className="bg-ink text-paper px-6 py-3 rounded-xl font-medium hover:bg-ink-light transition"
            >
              Back to home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
