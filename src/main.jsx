import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'
import { AppProvider } from './context/AppContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { registerSW } from 'virtual:pwa-register';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <AppProvider>
        <App />
      </AppProvider>
    </AuthProvider>
  </React.StrictMode>,
)

// Register Vite PWA Service Worker natively
const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('App update available. Refreshing...');
  },
  onOfflineReady() {
    console.log('App is ready to work offline.');
  },
});
