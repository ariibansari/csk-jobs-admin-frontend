import './App.css'
import { ThemeProvider } from "@/components/theme-provider"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import SignIn from '@/pages/Auth/SignIn'
import { useContext } from 'react'
import { UserContext } from './context/UserProvider'
import { Toaster } from './components/ui/toaster'
import ForgotPassword from './pages/Auth/ForgotPassword'
import ResetPassword from './pages/Auth/ResetPassword'
import PageNotFound from './pages/PageNotFound'
import SignUp from './pages/Auth/SingUp'
import VerificationPending from './pages/Auth/VerificationPending'
import VerifyEmail from './pages/Auth/VerifyEmail'
import UserDashboard from './pages/Users/UserDashboard'

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
              <Route path='/login' element={<SignIn />} />
              <Route path='/sign-up' element={<SignUp />} />
              <Route path='/forgot-password' element={<ForgotPassword />} />
              <Route path='/verification-pending' element={<VerificationPending />} />
              <Route path='/confirm-email' element={<VerifyEmail />} />
            </>
          }


          {user.accessToken
            &&
            // COMMON ROUTES FOR AUTHENTICATED USERS
            <>
            </>
          }


          {user.accessToken && user.role === "USER"
            &&
            // ROUTES FOR AUTHENTICATED USER
            <>
              <Route path='/' element={<UserDashboard />} />
            </>
          }


          {user.accessToken && user.role === "ADMIN"
            &&
            // ROUTES FOR AUTHENTICATED ADMINS
            <>
            </>
          }

          <Route path='*' element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider >
  )
}

export default App
