import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AuthContext from './contexts/AuthContext.jsx'
import ThemeContext from './contexts/ThemeContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthContext>
      <ThemeContext>
        <App />
      </ThemeContext>
    </AuthContext>
  </StrictMode>,
)
