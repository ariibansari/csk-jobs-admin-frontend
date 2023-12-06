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
import ConfirmEmail from './pages/Auth/ConfirmEmail'
import UserDashboard from './pages/Users/UserDashboard'
import SubscriptionList from './pages/Users/SubscriptionList'
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from '@stripe/stripe-js';
import useSubscriptionDetails from './hooks/useSubscriptionDetails'
import SubscriptionCheckoutCancelled from './pages/Subscription/SubscriptionCheckoutCancelled'
import SubscriptionCheckoutSuccess from './pages/Subscription/SubscriptionCheckoutSuccess'
import { CgSpinner } from 'react-icons/cg'


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY); // starts with pk_

function App() {
  const { user } = useContext(UserContext)
  const [subscriptionDetails, loadingSubscriptionDetails] = useSubscriptionDetails()

  return (
    <Elements stripe={stripePromise}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <Toaster />
        {loadingSubscriptionDetails
          ?
          <section>
            <div className='flex justify-center items-center h-[100dvh]'>
              <CgSpinner className="animate-spin text-3xl" />
            </div>
          </section>
         
         :
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
                  <Route path='/confirm-email' element={<ConfirmEmail />} />
                </>
              }


              {user.accessToken
                &&
                // COMMON ROUTES FOR AUTHENTICATED USERS
                <>
                </>
              }

              {user.accessToken && user.role === "USER" && subscriptionDetails === null
                &&
                // ROUTES FOR AUTHENTICATED USERS WITHOUT SUBSCRIPTION
                <>
                  <Route path='/' element={<SubscriptionList />} />
                  <Route path='/subscription/checkout/cancelled' element={<SubscriptionCheckoutCancelled />} />
                  <Route path='/subscription/checkout/success/:checkout_session_id' element={<SubscriptionCheckoutSuccess />} />
                </>
              }

              {user.accessToken && user.role === "USER"
                &&
                // COMMON ROUTES FOR AUTHENTICATED USERS WITH or WITHOUT SUBSCRIPTION
                <>
                  <Route path='/subscription/checkout/success/:checkout_session_id' element={<SubscriptionCheckoutSuccess />} />
                </>
              }

              {user.accessToken && user.role === "USER" && subscriptionDetails
                &&
                // ROUTES FOR AUTHENTICATED USERS WITH SUBSCRIPTION
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
        }
      </ThemeProvider >
    </Elements>
  )
}

export default App
