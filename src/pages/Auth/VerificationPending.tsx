import { useEffect, useState } from 'react'
import UnauthenticatedUsersLayout from "../layouts/UnauthenticatedUsersLayout"
import Logo from '@/components/ui/logo'
import { Button } from '@/components/ui/button'
import { CgSpinner } from 'react-icons/cg'
import PageNotFound from '../PageNotFound'
import Axios from '@/api/axios'
import { toast } from '@/components/ui/use-toast'

const VerificationPending = () => {
  const queryParameters = new URLSearchParams(window.location.search)
  const email = queryParameters.get("email")

  const [checkingEmail, setCheckingEmail] = useState(true)
  const [validEmail, setValidEmail] = useState(false)

  const [resendingEmail, setResendingEmail] = useState(false)

  useEffect(() => {
    checkEmail()
  }, [])

  const checkEmail = () => {
    setCheckingEmail(true)
    Axios.post("/api/auth/checkEmail", { email })
      .then(res => {
        if (res.data.user_id) {
          setValidEmail(true)
        }
        setCheckingEmail(false)
      })
      .catch(error => {
        console.log(error);
        setCheckingEmail(false)
      })
  }

  const resendEmail = () => {
    setResendingEmail(true)
    Axios.post("/api/auth/resendVerificationEmail", { email })
      .then(res => {
        if (res.data) {
          if (res.data.last_sent_time < 5) {
            toast({
              variant: "destructive",
              title: `An email was sent ${res.data.last_sent_time}min ago, 5 minutes of wait time is required to re-send the verification email`
            })
            setResendingEmail(false)
            return
          }

          if (res.data.sent) {
            toast({
              variant: "success",
              title: `Email sent to ${email}`
            })
            setResendingEmail(false)
            return
          }
        }
      })
      .catch(error => {
        console.log(error);
        toast({
          variant: "destructive",
          title: "There was an issue sending the email, please try again later."
        })
        setResendingEmail(false)
      })
  }


  return (
    <>
      {checkingEmail
        ?
        <div className='flex justify-center items-center h-[100dvh]'>
          <CgSpinner className="animate-spin text-3xl" />
        </div>

        :
        !validEmail
          ? <PageNotFound />

          :
          <UnauthenticatedUsersLayout>
            <div className='h-[100dvh] flex flex-col justify-center items-center'>
              <div className="flex flex-col items-center gap-2">
                <Logo />
              </div>
              <div className='w-[30rem] max-w-[90vw] my-10 flex flex-col items-center'>
                <h2 className="text-2xl font-semibold ">Email Verification Pending</h2>
                <p className='my-4 text-center'>We have sent you a confirmation email at - {email}. Please open the link in the email to complete the email verfication process.</p>
                <Button variant="outline" className='mt-5 gap-2' disabled={resendingEmail} onClick={() => resendEmail()}>
                  Didn't received the email? Resend
                  {resendingEmail
                    &&
                    <CgSpinner className="animate-spin text-xl" />
                  }
                </Button>
              </div>
            </div>
          </UnauthenticatedUsersLayout>
      }
    </>
  )
}

export default VerificationPending