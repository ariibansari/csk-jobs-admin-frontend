import { useEffect } from 'react'
import SignInForm from "@/components/forms/SignInForm"
import { useTheme } from "@/components/theme-provider"
import UnauthenticatedUsersLayout from "../layouts/UnauthenticatedUsersLayout"
import { toast } from '@/components/ui/use-toast'

const SignIn = () => {
  const { theme } = useTheme()
  const queryParameters = new URLSearchParams(window.location.search)
  const sessionExpired = queryParameters.get("sessionExpired")

  useEffect(()=>{
    if(sessionExpired){
      toast({
        variant: "destructive",
        title: "Session expired",
        description: "Please login again to continue using the app"
      })
    }
  }, [sessionExpired])

  return (
    <UnauthenticatedUsersLayout>
      <div className='h-[100dvh] flex flex-col justify-center items-center'>
        <div className="flex flex-col items-center gap-2">
          {theme === "light"
            ?
            <img src="./images/wearnes-black-logo.png" alt="logo" className="w-20" />
            :
            <img src="./images/wearnes-white-logo.png" alt="logo" className="w-20" />
          }
          <h3 className="text-m font-medium text-center">Warehouse Management System</h3>
        </div>
        <div className="my-10">
          <h2 className="text-3xl font-medium text-center">Login</h2>
        </div>
        <SignInForm />
      </div>
    </UnauthenticatedUsersLayout>
  )
}

export default SignIn