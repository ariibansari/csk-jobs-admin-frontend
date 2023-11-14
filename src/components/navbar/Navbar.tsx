import { useContext, useEffect } from 'react'
import { ModeToggle } from '@/components/mode-toggle'
import { useTheme } from '../theme-provider'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, LogOut } from 'lucide-react'
import { UserContext, defaultUserState } from '@/context/UserProvider'
import Axios from '@/api/axios'
import { NavLink, useNavigate } from 'react-router-dom'
import CustomNavLink from '../ui/customNavLink'
import darkLogo from "../../assets/images/wearnes-black-logo.png"
import lightLogo from "../../assets/images/wearnes-white-logo.png"

const linkClasses = "text-sm text-muted-foreground link"

const Navbar = () => {
  const { theme } = useTheme()
  const { user, setUser } = useContext(UserContext)
  const navigate = useNavigate()

  const logout = () => {
    Axios.post("/api/auth/logout", { user_id: user.user_id })
    setUser(defaultUserState.user)
    navigate("/")
  }

  useEffect(() => {
    const navLinks = document.getElementsByClassName("link")

    // Loop through the links
    for (let i = 0; i < navLinks.length; i++) {
      const link = navLinks[i];

      // Check if the link has the "active" class
      if (link.classList.contains("active")) {
        // If it has the "active" class, add the "text-foreground" class
        link.classList.add("text-accent-foreground");
      }
    }

  }, [])

  return (
    <nav className='border border-transparent border-b-input'>
      <div className='flex justify-between items-center py-3 container'>
        <NavLink to="/">
          {theme === "light"
            ?
            <img src={darkLogo} alt="logo" className="w-20" />
            :
            <img src={lightLogo} alt="logo" className="w-20" />
          }
        </NavLink>
        <div className='flex items-center gap-7'>
          <div className='flex gap-5'>
            {/* COMMON LINKS */}
            <>
              <CustomNavLink to='/manage-stocks' label='Stocks' />
              <CustomNavLink to='/items-manager' label='Items' />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className={`flex items-center gap-1 cursor-pointer p-0 m-0 ${linkClasses}`}>
                    Manage
                    <ChevronDown className='h-4 w-4' />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuItem className='p-0'><CustomNavLink to="/unit-manager" className={`w-[100%] h-[100%] p-2`} label='Unit of Measurements' type="dropdown-item" /></DropdownMenuItem>
                  <DropdownMenuItem className='p-0'><CustomNavLink to="/location-manager" className={`w-[100%] h-[100%] p-2`} label='Locations' type="dropdown-item" /></DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className={`flex items-center gap-1 cursor-pointer p-0 m-0 ${linkClasses}`}>
                    Reports
                    <ChevronDown className='h-4 w-4' />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuItem className='p-0'><CustomNavLink to="/reports/item" className={`w-[100%] h-[100%] p-2`} label='Item' type="dropdown-item" /></DropdownMenuItem>
                  <DropdownMenuItem className='p-0'><CustomNavLink to="/reports/inventory" className={`w-[100%] h-[100%] p-2`} label='Inventory' type="dropdown-item" /></DropdownMenuItem>
                  <DropdownMenuItem className='p-0'><CustomNavLink to="/reports/stock-movement" className={`w-[100%] h-[100%] p-2`} label='Stock Movement' type="dropdown-item" /></DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>


            {/* ADMIN ONLY LINKS */}
            {user.role === "ADMIN"
              &&
              <>
                <CustomNavLink to="/warehouse-users-manager" label='Warehouse Users' />
                <CustomNavLink to="/audit-trail" label='Audit trail' />
              </>
            }



            {/* WAREHOUSE_USER ONLY LINKS */}
            {user.role === "WAREHOUSE_USER"
              &&
              <></>
            }


          </div>
          <div className='flex gap-3 item-center'>
            <ModeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className='flex items-center gap-1 cursor-pointer text-sm'>
                  {user.username}
                  <ChevronDown className='w-4' />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem disabled>Profile</DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    Log out
                    <DropdownMenuShortcut><LogOut className='w-4' /></DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav >
  )
}

export default Navbar