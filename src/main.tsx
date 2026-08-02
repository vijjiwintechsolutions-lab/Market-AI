import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: any }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("App Crash Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', background: '#0A0A0A', color: '#fff', fontFamily: 'sans-serif', minHeight: '100vh' }}>
          <h1 style={{ color: '#f43f5e' }}>Market1 AI Application Recovery</h1>
          <p style={{ color: '#94a3b8' }}>An unexpected JavaScript runtime exception occurred.</p>
          <pre style={{ background: '#151517', padding: '16px', borderRadius: '8px', color: '#fb7185', overflowX: 'auto' }}>
            {String(this.state.error?.stack || this.state.error || 'Unknown Error')}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{ padding: '10px 20px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: '16px' }}
          >
            Reload Application
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
