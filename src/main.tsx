
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { applyViewportFix } from './utils/viewportFix'
import { registerServiceWorker } from './utils/serviceWorkerRegistration'

// Apply the viewport fix for iOS
applyViewportFix();

// Register service worker for PWA support - but make it optional
try {
  registerServiceWorker();
  console.log("Service worker registration attempted");
} catch (error) {
  console.error("Failed to register service worker:", error);
  // Continue even if service worker fails
}

// Add improved error boundary and debugging for the app
const renderApp = () => {
  try {
    console.log("Starting to render app...");
    
    const rootElement = document.getElementById("root");
    if (!rootElement) {
      console.error("Root element not found");
      // Create a root element if it doesn't exist
      const newRoot = document.createElement("div");
      newRoot.id = "root";
      document.body.appendChild(newRoot);
      console.log("Created new root element");
      createRoot(newRoot).render(<App />);
      return;
    }
    
    console.log("Root element found, rendering app...");
    
    // Add a div with text to see if basic rendering works
    rootElement.innerHTML = '<div id="debug-message" style="position:fixed; top:10px; left:10px; background:rgba(0,0,0,0.7); color:white; padding:10px; z-index:9999; font-family:sans-serif;">Attempting to render app...</div>';
    
    // Force a small timeout to ensure the debug message is visible
    setTimeout(() => {
      try {
        const root = createRoot(rootElement);
        console.log("Root created successfully");
        root.render(<App />);
        console.log("App rendered successfully");
      } catch (renderError) {
        console.error("Error during React rendering:", renderError);
        rootElement.innerHTML = `
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; padding: 20px; text-align: center;">
            <h1>React Rendering Error</h1>
            <p>There was an error rendering the application.</p>
            <pre style="background: #f5f5f5; padding: 15px; border-radius: 5px; max-width: 80%; overflow: auto;">${renderError.toString()}</pre>
            <p>Please check the console for more details or try refreshing the page.</p>
          </div>
        `;
      }
    }, 100);
  } catch (error) {
    console.error("Critical failure during app initialization:", error);
    // Display a fallback UI when the app fails to render
    document.body.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; padding: 20px; text-align: center;">
        <h1>Something went wrong</h1>
        <p>The application could not initialize properly.</p>
        <pre style="background: #f5f5f5; padding: 15px; border-radius: 5px; max-width: 80%; overflow: auto;">${error.toString()}</pre>
        <p>Please try refreshing the page or contact support if the issue persists.</p>
        <button onclick="window.location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #0070f3; color: white; border: none; border-radius: 5px; cursor: pointer;">Refresh Page</button>
      </div>
    `;
  }
};

// Add window error handlers to catch any unhandled errors
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

console.log("Starting application...");
renderApp();
