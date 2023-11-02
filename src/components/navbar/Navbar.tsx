import React, { useContext } from 'react'
import { ModeToggle } from '@/components/mode-toggle'
import "./navbar.css"
import { useTheme } from '../theme-provider'
import LogoutButton from '../logout-button'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronDown, LogOut, LogOutIcon } from 'lucide-react'
import { UserContext, defaultUserState } from '@/context/UserProvider'
import Axios from '@/api/axios'
import { NavLink, useNavigate } from 'react-router-dom'


const Navbar = () => {
  const { theme } = useTheme()
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
          {theme === "light"
            ?
            <img src="./images/wearnes-black-logo.png" alt="logo" className="w-20" />
            :
            <img src="./images/wearnes-white-logo.png" alt="logo" className="w-20" />
          }
        </NavLink>
        <div className='flex items-center gap-7'>
          <div>
            <NavLink to="/warehouse-users-manager">Warehouse Users</NavLink>
          </div>
          <div className='flex gap-3 item-center'>
            <ModeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className='flex items-center gap-1 cursor-pointer'>
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
    </nav>
  )
}

export default Navbar