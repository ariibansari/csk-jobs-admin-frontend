import React, { useContext, useState } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { CgSpinner } from 'react-icons/cg'
import { User, UserContext } from '@/context/UserProvider'
import { NavLink } from 'react-router-dom'
import { useToast } from '../ui/use-toast'
import Axios from '@/api/axios'
import "./forms.css"
import {useNavigate} from 'react-router-dom'

const SignInForm = () => {
    const { setUser } = useContext(UserContext)

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [authenticating, setAuthenticating] = useState(false)

    const queryParameters = new URLSearchParams(window.location.search)
    const redirectTo = queryParameters.get("redirectTo") || false
    const navigate = useNavigate()
    const { toast } = useToast()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setAuthenticating(true)
        Axios.post('/api/auth/login', { username, password })
            .then((res: any) => {
                if (res.data) {
                    let _user: User = {
                        accessToken: res.data.accessToken,
                        refreshToken: res.data.refreshToken,
                        user_id: res.data.user_id,
                        name: res.data.name,
                        username: res.data.username,
                        email: res.data.email,
                        role: res.data.role
                    }

                    setUser(_user)
                    toast({ itemID: "login-toast" }).dismiss()
                }
                
                setAuthenticating(false)

                if(redirectTo){
                    navigate(redirectTo)
                }
            })
            .catch((error: any) => {
                setAuthenticating(false)

                if (error.response?.data?.error) {
                    toast({
                        itemID: "login-toast",
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
        <form onSubmit={handleSubmit} className='w-80 flex flex-col gap-6'>
            <div className='input-grp'>
                <Label htmlFor="username">Username</Label>
                <Input type="text" required id="username" value={username} onChange={e => setUsername(e.target.value)} />
            </div>
            <div className='input-grp'>
                <Label htmlFor="password">Password</Label>
                <Input type="password" required id="password" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <div className='flex flex-col items-center justify-center gap-2 mt-4'>
                <Button variant="default" className='w-[50%] flex gap-2' disabled={authenticating}>
                    Login
                    {authenticating
                        &&
                        <CgSpinner className="animate-spin text-xl" />
                    }
                </Button>
                <NavLink to="/forgot-password" className="text-slate-600 hover:text-slate-700 dark:text-slate-200 dark:hover:text-slate-300">Forgot password?</NavLink>
            </div>
        </form>
    )
}

export default SignInForm