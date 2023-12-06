import { useEffect } from 'react'
import SignInForm from "@/components/forms/SignInForm"
import UnauthenticatedUsersLayout from "../layouts/UnauthenticatedUsersLayout"
import { toast } from '@/components/ui/use-toast'
import Logo from '@/components/ui/logo'

const SignIn = () => {
  const queryParameters = new URLSearchParams(window.location.search)
  const sessionExpired = queryParameters.get("sessionExpired")

  useEffect(() => {
    if (sessionExpired) {
      toast({
        variant: "destructive",
        title: "Session expired",
        description: "Please login again to continue using the app"
      })
    }
  }, [sessionExpired])

  return (
    <UnauthenticatedUsersLayout>
      <div className='h-[90dvh] flex flex-col justify-center items-center'>
        <div className="flex flex-col items-center gap-2">
          <Logo />
        </div>
        <div className="my-10">
          <h2 className="text-2xl font-semibold text-center">Login</h2>
        </div>
        <SignInForm />
      </div>
    </UnauthenticatedUsersLayout>
  )
}

export default SignIn