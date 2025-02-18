import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Invitacion from './invitacion'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Invitacion />
  </StrictMode>,
)
