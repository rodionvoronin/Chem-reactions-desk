import React from 'react'
import ReactDOM from 'react-dom/client'
// Montserrat вшивается в сборку — без обращения к Google Fonts,
// который в РФ работает нестабильно
import '@fontsource/montserrat/400.css'
import '@fontsource/montserrat/500.css'
import '@fontsource/montserrat/600.css'
import '@fontsource/montserrat/700.css'
import './index.css'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
