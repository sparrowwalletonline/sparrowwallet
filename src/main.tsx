
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { applyViewportFix } from './utils/viewportFix'

// Apply the viewport fix for iOS
applyViewportFix();

createRoot(document.getElementById("root")!).render(<App />);
