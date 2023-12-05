import { useEffect, useState } from 'react'
import UnauthenticatedUsersLayout from "../layouts/UnauthenticatedUsersLayout"
import { Button } from '@/components/ui/button'
import { CgSpinner } from 'react-icons/cg'
import PageNotFound from '../PageNotFound'
import Axios from '@/api/axios'
import { useNavigate } from 'react-router-dom'
import { BadgeCheck } from 'lucide-react'

const VerifyEmail = () => {
  const queryParameters = new URLSearchParams(window.location.search)
  const email = queryParameters.get("email")
  const code = queryParameters.get("code")

  const navigate = useNavigate()

  const [verifyingEmailAndCode, setVerifyingEmailAndCode] = useState(true)
  const [isValid, setIsValid] = useState(false)

  useEffect(() => {
    verifyEmailAndCode()
  }, [])

  const verifyEmailAndCode = () => {
    setVerifyingEmailAndCode(true)
    Axios.post("/api/auth/verifyEmailAndCode", { email, code })
      .then(res => {
        if (res.data) {
          setIsValid(true)
        }
        setVerifyingEmailAndCode(false)
      })
      .catch(error => {
        console.log(error);
        setVerifyingEmailAndCode(false)
      })
  }


  return (
    <>
      {verifyingEmailAndCode
        ?
        <div className='flex justify-center items-center h-[100dvh]'>
          <CgSpinner className="animate-spin text-3xl" />
        </div>

        :
        !isValid
          ? <PageNotFound />

          :
          <UnauthenticatedUsersLayout>
            <div className='h-[100dvh] flex flex-col justify-center items-center'>
              <div className="flex flex-col items-center gap-2">
                <BadgeCheck className="fill-green-500 text-background w-12 h-12" />
              </div>
              <div className='w-[30rem] max-w-[90vw] my-10 flex flex-col items-center'>
                <h2 className="text-2xl font-semibold ">Email Verified</h2>
                <p className='my-4 text-center'>Your email has been successfully verified. You can now login to access your dashboard</p>
                <Button className='mt-5' onClick={() => navigate("/login")}>Login</Button>
              </div>
            </div>
          </UnauthenticatedUsersLayout>
      }
    </>
  )
}

export default VerifyEmail