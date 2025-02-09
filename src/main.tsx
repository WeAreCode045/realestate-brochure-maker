import { createRoot } from 'react-dom/client'
import PDFDocument from 'pdfkit';
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);
