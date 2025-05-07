import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Home } from './components/home/Home'
import { SocketContextProvider } from './components/store/SocketContext'
import { VaarbzProvider } from './components/store/VaarbzContext'
import './styles/index.scss';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
 <VaarbzProvider>
 
   <SocketContextProvider>
 
    <Home/>
  
    </SocketContextProvider>
  
    </VaarbzProvider>
  </StrictMode>,
)
