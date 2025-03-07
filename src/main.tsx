
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { applyViewportFix } from './utils/viewportFix'
import { registerServiceWorker } from './utils/serviceWorkerRegistration'

// Ensure DOM is fully loaded before initialization
document.addEventListener('DOMContentLoaded', () => {
  // Apply the viewport fix for iOS
  applyViewportFix();

  // Register service worker for PWA support
  registerServiceWorker();

  // Create React root with a slight delay to ensure DOM is ready (helps with mobile Safari)
  setTimeout(() => {
    const rootElement = document.getElementById("root");
    if (rootElement) {
      // Force hardware acceleration
      rootElement.style.transform = 'translateZ(0)';
      
      // Create root and render
      createRoot(rootElement).render(<App />);
      
      // Force repaint after render
      setTimeout(() => {
        document.body.style.opacity = '0.99';
        setTimeout(() => {
          document.body.style.opacity = '1';
        }, 10);
      }, 100);
    }
  }, 0);
});
