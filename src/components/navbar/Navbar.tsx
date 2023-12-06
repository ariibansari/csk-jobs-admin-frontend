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

const Navbar = () => {
  const { user, setUser } = useContext(UserContext)
  const [subscriptionDetails, loadingSubscriptionDetails] = useSubscriptionDetails()
  const [creatingPortalSession, setCreatingPortalSession] = useState(false)
  const navigate = useNavigate()

  const logout = () => {
    Axios.post("/api/auth/logout", { user_id: user.user_id })
    setUser(defaultUserState.user)
    navigate("/")
  }

  const createPortalSession = () => {
    setCreatingPortalSession(true)
    ProtectedAxios.post("/api/stripe/createPortalSession", { customer_id: user.customer_id })
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
      {/* {loadingSubscriptionDetails
        &&
        <section className='fixed top-0 left-0 w-[100%] bg-background z-20'>
          <div className='flex justify-center items-center h-[100dvh]'>
            <CgSpinner className="animate-spin text-3xl" />
          </div>
        </section>
      } */}

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
                <></>
              }



              {/* USERS WITH SUBSCRIPTION ONLY LINKS */}
              {user.role === "USER" && subscriptionDetails
                &&
                <></>
              }


            </div>
            <div className='flex gap-3 item-center'>
              <ModeToggle />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className='flex items-center gap-1 cursor-pointer text-sm'>
                    {user.name}
                    <ChevronDown className='w-4' />
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