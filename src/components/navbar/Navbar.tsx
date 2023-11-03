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
            <img src="./images/wearnes-black-logo.png" alt="logo" className="w-20" />
            :
            <img src="./images/wearnes-white-logo.png" alt="logo" className="w-20" />
          }
        </NavLink>
        <div className='flex items-center gap-7'>
          <div className='flex gap-5'>
            {/* COMMON LINKS */}
            <>
              <NavLink to="/items-manager" className="text-sm text-muted-foreground link">Items</NavLink>
            </>


            {/* ADMIN ONLY LINKS */}
            {user.role === "ADMIN"
              &&
              <>
                <NavLink to="/warehouse-users-manager" className="text-sm text-muted-foreground link">Warehouse Users</NavLink>
                <NavLink to="/audit-trail" className="text-sm text-muted-foreground link">Audit trail</NavLink>
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
    </nav>
  )
}

export default Navbar