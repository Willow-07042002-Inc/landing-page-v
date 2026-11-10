import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initAnalytics } from './lib/consent'

// Google Analytics and Clarity load only for a visitor who has accepted (src/lib/consent.ts).
initAnalytics()

createRoot(document.getElementById("root")!).render(<App />);
