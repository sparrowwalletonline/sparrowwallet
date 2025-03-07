
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { applyViewportFix } from './utils/viewportFix'
import { registerServiceWorker, clearAllCaches } from './utils/serviceWorkerRegistration'

// Apply the viewport fix for iOS
applyViewportFix();

// Clear all caches first to ensure fresh content
clearAllCaches();

// Register service worker for PWA support
registerServiceWorker();

createRoot(document.getElementById("root")!).render(<App />);
