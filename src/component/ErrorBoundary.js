import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You could log the error to a service here
    console.error("Elevator System Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Custom "Safe Mode" UI
      return (
        <div style={{ padding: '20px', textAlign: 'center', color: '#e74c3c' }}>
          <h2>🛗 System Maintenance Required</h2>
          <p>An unexpected error occurred in the elevator controller.</p>
          <button onClick={() => window.location.reload()} style={{ padding: '10px 20px', cursor: 'pointer' }}>
            Restart System
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;