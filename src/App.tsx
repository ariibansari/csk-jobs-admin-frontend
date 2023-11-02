import './App.css'
import { ThemeProvider } from "@/components/theme-provider"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import SignIn from '@/pages/SignIn'
import { useContext } from 'react'
import { UserContext } from './context/UserProvider'
import { Toaster } from './components/ui/toaster'
import Dashboard from './pages/Dashboard'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import WarehouseUsersManager from './pages/WarehouseUsersManager'

function App() {
  const { user } = useContext(UserContext)

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Toaster />
      <BrowserRouter>
        <Routes>
          {
            // COMMON ROUTES FOR BOTH AUTHENTICATED AND UNAUTHENTICATED USERS 
            <>
              <Route path='/reset-password/:resetToken' element={<ResetPassword />} />
            </>
          }


          {user.accessToken === ''
            &&
            // ROUTES FOR UNAUTHENTICATED USERS
            <>
              <Route path='/' element={<SignIn />} />
              <Route path='/forgot-password' element={<ForgotPassword />} />
            </>
          }


          {user.accessToken
            &&
            // COMMON ROUTES FOR AUTHENTICATED USERS
            <>
              <Route path='/' element={<Dashboard />} />
            </>
          }


          {user.accessToken && user.role === "ADMIN"
            &&
            // ROUTES FOR AUTHENTICATED ADMINS
            <>
              <Route path='/warehouse-users-manager' element={<WarehouseUsersManager />} />
            </>
          }


          {user.accessToken && user.role === "WAREHOUSE_USER"
            &&
            // ROUTES FOR AUTHENTICATED WAREHOUSE USERS
            <>
            </>
          }

        </Routes>
      </BrowserRouter>
    </ThemeProvider >
  )
}

export default App
