import { useContext, useState } from 'react'
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
import useSubscriptionDetails from '@/hooks/useSubscriptionDetails'
import ProtectedAxios from '@/api/protectedAxios'
import { toast } from '../ui/use-toast'
import { CgSpinner } from 'react-icons/cg'
import ChatHistorySheet from '../chat/ChatHistorySheet'

const Navbar = () => {
  const { user, setUser } = useContext(UserContext)
  const [subscriptionDetails] = useSubscriptionDetails()
  const [creatingPortalSession, setCreatingPortalSession] = useState(false)
  const navigate = useNavigate()

  const logout = () => {
    Axios.post("/api/auth/logout", { user_id: user.user_id })
    setUser(defaultUserState.user)
    navigate("/")
  }

  const createPortalSession = () => {
    setCreatingPortalSession(true)
    ProtectedAxios.post("/api/subscription/createPortalSession", { customer_id: user.customer_id })
      .then(res => {
        if (res.data) {
          window.location.href = res.data
          setCreatingPortalSession(false)
        }
      })
      .catch(err => {
        console.log(err);
        setCreatingPortalSession(false)
        toast({
          variant: "destructive",
          title: "There was some issue, please try again later"
        })
      })

  }


  return (
    <>
      <nav className='border border-transparent border-b-input'>
        <div className='flex justify-between items-center py-3 container'>
          <div className='flex items-center gap-3'>
            {user.role === "USER"
              &&
              <ChatHistorySheet />
            }
            <NavLink to="/">
              <Logo />
            </NavLink>
          </div>

          <div className='flex items-center gap-7'>
            <div className='flex gap-5'>
              {/* COMMON LINKS */}
              <></>


              {/* ADMIN ONLY LINKS */}
              {user.role === "ADMIN"
                &&
                <>
                  <CustomNavLink to='/manage-users' label='Users' />
                </>
              }



              {/* USERS WITH SUBSCRIPTION ONLY LINKS */}
              {user.role === "USER" && subscriptionDetails
                &&
                <>
                  <CustomNavLink to='/api-keys' label='API Keys' />
                </>
              }
            </div>

            <div className='flex gap-3 item-center'>
              <ModeToggle />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className='flex items-end -gap-1 cursor-pointer text-sm'>
                    {/* {user.name.substring(0, 10)} {user.name.length > 10 && "..."} */}
                    <span className='w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0 uppercase hover:outline outline-3 outline-input'>{user.email.substring(0, 1)}</span>
                    {/* <ChevronDown className='w-4 -mb-2' /> */}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>

                    {/* USERS WITH SUBSCRIPTION ONLY LINKS */}
                    {user.role === "USER" && subscriptionDetails
                      &&
                      <>
                        <DropdownMenuItem disabled>Profile</DropdownMenuItem>
                        <DropdownMenuItem disabled={creatingPortalSession} onClick={() => createPortalSession()}>
                          Manage Subscription
                          {creatingPortalSession
                            &&
                            <DropdownMenuShortcut><CgSpinner className="animate-spin text-xl" /></DropdownMenuShortcut>
                          }
                        </DropdownMenuItem>
                      </>
                    }

                    {/* ADMIN LINKS */}
                    {user.role === "ADMIN"
                      &&
                      <>
                        <DropdownMenuItem disabled>Profile</DropdownMenuItem>
                      </>
                    }

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
    </>
  )
}

export default Navbar