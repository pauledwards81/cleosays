
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Initialize AdSense array immediately to avoid undefined errors
if (typeof window !== 'undefined') {
  window.adsbygoogle = window.adsbygoogle || [];
  
  // Pre-initialize ads to speed up rendering - fixed type issue
  window.adsbygoogle = Array.isArray(window.adsbygoogle) ? window.adsbygoogle : [];
}

// Render the app immediately without waiting for ads
const root = createRoot(document.getElementById("root")!);
root.render(<App />);
