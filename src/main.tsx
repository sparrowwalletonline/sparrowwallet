
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { applyViewportFix } from './utils/viewportFix'
import { registerServiceWorker } from './utils/serviceWorkerRegistration'

// Apply the viewport fix for iOS
applyViewportFix();

// Register service worker for PWA support
registerServiceWorker();

// Add error boundary for the app
const renderApp = () => {
  try {
    const rootElement = document.getElementById("root");
    if (!rootElement) {
      console.error("Root element not found");
      return;
    }
    
    createRoot(rootElement).render(<App />);
  } catch (error) {
    console.error("Failed to render app:", error);
    // Display a fallback UI when the app fails to render
    const rootElement = document.getElementById("root");
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif;">
          <h1>Something went wrong</h1>
          <p>Please try refreshing the page or contact support if the issue persists.</p>
        </div>
      `;
    }
  }
};

renderApp();
