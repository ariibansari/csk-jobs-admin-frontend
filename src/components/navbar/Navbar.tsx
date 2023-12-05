import { useContext, useEffect } from 'react'
import { ModeToggle } from '@/components/mode-toggle'
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
import Logo from '../ui/logo'

const linkClasses = "text-sm text-muted-foreground link"

const Navbar = () => {
  const { user, setUser } = useContext(UserContext)
  const navigate = useNavigate()

  const logout = () => {
    Axios.post("/api/auth/logout", { user_id: user.user_id })
    setUser(defaultUserState.user)
    navigate("/")
  }


  return (
    <nav className='border border-transparent border-b-input'>
      <div className='flex justify-between items-center py-3 container'>
        <NavLink to="/">
          <Logo />
        </NavLink>
        <div className='flex items-center gap-7'>
          <div className='flex gap-5'>
            {/* COMMON LINKS */}
            <></>

            {/* ADMIN ONLY LINKS */}
            {user.role === "ADMIN"
              &&
              <>
                
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