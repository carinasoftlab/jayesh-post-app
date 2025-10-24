import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Toaster } from 'sonner'

const root = createRoot(document.getElementById('root'))
root.render(<>
  <Toaster richColors position="top-right" />
  <App />
</>)


