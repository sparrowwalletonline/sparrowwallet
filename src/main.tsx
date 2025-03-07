
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { applyViewportFix } from './utils/viewportFix'
import { registerServiceWorker } from './utils/serviceWorkerRegistration'

// Apply the viewport fix for iOS
applyViewportFix();

// Register service worker for PWA support
try {
  registerServiceWorker();
  console.log("Service worker registration attempted");
} catch (error) {
  console.error("Failed to register service worker:", error);
}

// Main rendering function with improved error handling
const renderApp = () => {
  try {
    console.log("Starting to render app...");
    
    const rootElement = document.getElementById("root");
    if (!rootElement) {
      console.error("Root element not found");
      document.body.innerHTML = '<div style="text-align: center; padding: 20px;"><h1>Error: Root element not found</h1><p>Please refresh the page or contact support.</p></div>';
      return;
    }
    
    console.log("Root element found, rendering app...");
    
    try {
      // Create a React root and render the app
      const root = createRoot(rootElement);
      root.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
      console.log("App rendered successfully");
      
      // Clear the loading indicator if it exists
      const loaderElement = document.getElementById('app-loader');
      if (loaderElement && loaderElement.parentNode) {
        loaderElement.parentNode.removeChild(loaderElement);
      }
    } catch (renderError) {
      console.error("React rendering error:", renderError);
      rootElement.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh;">
          <h1>React Rendering Error</h1>
          <p>There was an error rendering the application.</p>
          <pre style="background: #f5f5f5; padding: 15px; border-radius: 5px;">${renderError.toString()}</pre>
          <p>Please check the console for more details.</p>
          <button onclick="window.location.reload()" style="margin-top: 20px; padding: 10px 20px;">Refresh Page</button>
        </div>
      `;
    }
  } catch (error) {
    console.error("Critical failure during app initialization:", error);
    document.body.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh;">
        <h1>Something went wrong</h1>
        <p>The application could not initialize properly.</p>
        <pre style="background: #f5f5f5; padding: 15px; border-radius: 5px;">${error.toString()}</pre>
        <button onclick="window.location.reload()" style="margin-top: 20px; padding: 10px 20px;">Refresh Page</button>
      </div>
    `;
  }
};

// Add global error handlers
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

// Execute the render function
console.log("Starting application...");
renderApp();
