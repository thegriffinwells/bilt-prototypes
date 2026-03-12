import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

/* Responsive phone frame scaling */
function scaleFrame() {
  const frame = document.querySelector('.phone-frame')
  if (!frame) return
  const sx = (window.innerWidth - 60) / 410
  const sy = (window.innerHeight - 60) / 882
  frame.style.setProperty('--frame-scale', Math.min(1, sx, sy))
}
window.addEventListener('resize', scaleFrame)
// Wait for React to render before first scale
requestAnimationFrame(() => requestAnimationFrame(scaleFrame))
