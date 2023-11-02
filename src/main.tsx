import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import UserProvider from './context/UserProvider.tsx'
import EventProvider from './context/EventProvider.tsx'


ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <EventProvider>
    <UserProvider>
      <App />
    </UserProvider>
  </EventProvider>
  // </React.StrictMode>,
)
