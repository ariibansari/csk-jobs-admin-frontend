import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import UnauthenticatedUsersLayout from './layouts/UnauthenticatedUsersLayout'
import { CgSpinner } from 'react-icons/cg'
import Axios from '@/api/axios'
import { toast } from '@/components/ui/use-toast'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Label } from '@radix-ui/react-label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, Minus, X } from 'lucide-react'

const ResetPassword = () => {
    const { resetToken } = useParams()
    const [validatingToken, setValidatingToken] = useState(true)
    const [isTokenValid, setIsTokenValid] = useState(false)

    const [password, setPassword] = useState("")
    const [viewingPassword, setViewingPassword] = useState(false)
    const [confirmPassword, setConfirmPassword] = useState("")
    const [viewingConfirmPassword, setViewingConfirmPassword] = useState(false)
    const [resettingPassword, setResettingPassword] = useState(false)
    const [error, setError] = useState("")

    const navigate = useNavigate()

    const validateResetToken = () => {
        setValidatingToken(true)
        Axios.post("/api/auth/verifyPasswordResetToken", { password_recovery_token: resetToken })
            .then(res => {
                if (res.data.password_recovery_token_valid) {
                    setIsTokenValid(true);
                    setValidatingToken(false)
                }
            })
            .catch((error: any) => {
                setValidatingToken(false)
                navigate("/")

                if (error.response?.data?.error) {
                    toast({
                        variant: "destructive",
                        title: error.response.data.error,
                    })
                    return
                }

                toast({
                    variant: "destructive",
                    title: error.message,
                })
            })
    }

    useEffect(() => {
        validateResetToken()
    }, [])

    const resetPassword = (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Password doesn't match confirm password")
            return
        }

        setResettingPassword(true)

        Axios.post("/api/auth/resetPassword", { password_recovery_token: resetToken, new_password: confirmPassword })
            .then(res => {
                toast({
                    variant: "success",
                    title: "Password reset was successful"
                })
                setResettingPassword(false)
                navigate("/")
            })
            .catch((error: any) => {
                setResettingPassword(false)
                navigate("/")

                if (error.response?.data?.error) {
                    toast({
                        variant: "destructive",
                        title: error.response.data.error,
                    })
                    return
                }

                toast({
                    variant: "destructive",
                    title: error.message,
                })
            })
    }

    return (
        <UnauthenticatedUsersLayout>
            <div className='h-[100dvh] flex flex-col justify-center items-center'>
                {validatingToken
                    ? <CgSpinner className="animate-spin text-4xl" />

                    :
                    isTokenValid
                    &&
                    <>
                        <Card className="w-[350px] bg-background border-none shadow-none">
                            <CardHeader className="my-5">
                                <CardTitle>Reset Password</CardTitle>
                                <CardDescription>A password reset link will be sent to your registered email address.</CardDescription>
                            </CardHeader>
                            <form onSubmit={resetPassword}>
                                <CardContent>
                                    <div className="grid w-full items-center gap-4">
                                        <div className="flex flex-col space-y-1.5">
                                            <Label htmlFor="password" className='text-sm'>Password</Label>
                                            <div className='relative'>
                                                <Input type={viewingPassword ? 'text' : 'password'} className='pr-10' id="password" required placeholder="Set new password" value={password} onChange={e => { setError(""); setPassword(e.target.value) }} />
                                                <Button type="button" variant="ghost" className='absolute right-2 top-[50%] translate-y-[-50%] p-1 hover:bg-transparent' onClick={() => setViewingPassword(prev => !prev)}>
                                                    {viewingPassword
                                                        ? <Eye className='w-5' />
                                                        : <EyeOff className='w-5' />
                                                    }
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="flex flex-col space-y-1.5">
                                            <Label htmlFor="confirm-password" className='text-sm'>Confirm Password</Label>
                                            <div className='relative'>
                                                <Input type={viewingConfirmPassword ? 'text' : 'password'} className='pr-10' id="confirm-password" required placeholder="Set new password" value={confirmPassword} onChange={e => { setError(""); setConfirmPassword(e.target.value) }} />
                                                <Button type="button" variant="ghost" className='absolute right-2 top-[50%] translate-y-[-50%] p-1 hover:bg-transparent' onClick={() => setViewingConfirmPassword(prev => !prev)}>
                                                    {viewingConfirmPassword
                                                        ? <Eye className='w-5' />
                                                        : <EyeOff className='w-5' />
                                                    }
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className='flex-col'>
                                    <div className="w-[100%] flex justify-between">
                                        <Button type="button" variant="outline" onClick={() => navigate("/")}>Cancel</Button>
                                        <Button type="submit" disabled={resettingPassword} className="flex gap-2">
                                            Reset
                                            {resettingPassword
                                                &&
                                                <CgSpinner className="animate-spin text-xl" />
                                            }
                                        </Button>
                                    </div>

                                    {error.length > 0
                                        &&
                                        <span className='mt-8 text-sm px-4 pr-8 py-3 destructive group border-destructive bg-destructive text-destructive-foreground rounded-md relative'>
                                            {error}
                                            <Button className='p-0 h-auto hover:bg-transparent absolute right-3 top-3' variant="ghost" onClick={() => setError("")}><X className='w-3' /></Button>
                                        </span>
                                    }
                                </CardFooter>
                            </form>
                        </Card>
                    </>
                }
            </div>
        </UnauthenticatedUsersLayout>
    )
}

export default ResetPassword