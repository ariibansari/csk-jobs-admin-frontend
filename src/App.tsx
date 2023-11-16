import './App.css'
import { ThemeProvider } from "@/components/theme-provider"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import SignIn from '@/pages/Auth/SignIn'
import { useContext } from 'react'
import { UserContext } from './context/UserProvider'
import { Toaster } from './components/ui/toaster'
import ForgotPassword from './pages/Auth/ForgotPassword'
import ResetPassword from './pages/Auth/ResetPassword'
import WarehouseUsersManager from './pages/WarehouseUsersManager'
import PageNotFound from './pages/PageNotFound'
import ItemsManager from './pages/ItemsManager'
import AuditTrail from './pages/AuditTrail'
import LocationManager from './pages/LocationManager'
import UnitManager from './pages/UnitManager'
import StockTransfersManager from './pages/StockTransfers/StockTransfersManager'
import NewStockTransfer from './pages/StockTransfers/NewStockTransfer'
import ItemReport from './pages/reports/ItemReport'
import InventoryReport from './pages/reports/InventoryReport'
import StockMovementReport from './pages/reports/StockMovementReport'

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
              <Route path='/' element={<StockTransfersManager />} />
              <Route path='/items-manager' element={<ItemsManager />} />
              <Route path='/unit-manager' element={<UnitManager />} />
              <Route path='/location-manager' element={<LocationManager />} />
              <Route path='/stock-transfer/stock-in' element={<NewStockTransfer transferType='IN' />} />
              <Route path='/stock-transfer/stock-out' element={<NewStockTransfer transferType='OUT' />} />
              <Route path='/reports/item' element={<ItemReport />} />
              <Route path='/reports/inventory' element={<InventoryReport />} />
              <Route path='/reports/stock-movement' element={<StockMovementReport />} />
            </>
          }


          {user.accessToken && user.role === "ADMIN"
            &&
            // ROUTES FOR AUTHENTICATED ADMINS
            <>
              <Route path='/warehouse-users-manager' element={<WarehouseUsersManager />} />
              <Route path='/audit-trail' element={<AuditTrail />} />
            </>
          }


          {user.accessToken && user.role === "WAREHOUSE_USER"
            &&
            // ROUTES FOR AUTHENTICATED WAREHOUSE USERS
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
