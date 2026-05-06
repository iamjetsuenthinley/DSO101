// frontend/src/main.jsx

// This is the entry point that React uses to mount the app into the HTML page.
// It finds the <div id="root"> in index.html and renders our App component inside it.

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'   // Import global styles
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)