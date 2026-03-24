import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// IMMEDIATE VISUAL FEEDBACK
const rootElement = document.getElementById('root');
if (rootElement) {
  rootElement.innerHTML = '<div style="padding: 20px; font-family: sans-serif;">Initializing App... Check Console for details.</div>';
}

console.log('Main.tsx: Script started');

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: any}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: 'red', border: '1px solid red', margin: '20px' }}>
          <h1>Something went wrong.</h1>
          <p>{this.state.error?.message}</p>
          <pre style={{ background: '#eee', padding: '10px' }}>{this.state.error?.stack}</pre>
        </div>
      );
    }

    return this.props.children;
  }
}

try {
  console.log('Main.tsx: Attempting to render React root');
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  );
  console.log('Main.tsx: React render called successfully');
} catch (e: any) {
  console.error('Main.tsx: CRITICAL FAILURE', e);
  document.body.innerHTML += `<div style="color: red; padding: 20px; font-size: 20px;">CRITICAL FAILURE: ${e.message}</div>`;
}
