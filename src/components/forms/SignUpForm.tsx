import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { CgSpinner } from 'react-icons/cg'
import { NavLink, useNavigate } from 'react-router-dom'
import { useToast } from '../ui/use-toast'
import Axios from '@/api/axios'
import "./forms.css"
import { X } from 'lucide-react'

const SignUpForm = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [company, setCompnay] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [authenticating, setAuthenticating] = useState(false)
    const [error, setError] = useState("")

    const { toast } = useToast()
    const navigate = useNavigate()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (!name) {
            setError("Please fill your name")
            return
        }
        if (!email) {
            setError("Please fill your email")
            return
        }
        if (!password) {
            setError("Please fill your password")
            return
        }
        if (!confirmPassword) {
            setError("Please confirm your password")
            return
        }

        if (password !== confirmPassword) {
            setError("Your password and confirm password does not matches")
            return
        }


        setAuthenticating(true)

        Axios.post('/api/auth/signup', { name, email, company, password })
            .then((res: any) => {
                if (res.data) {
                    navigate(`/verification-pending?email=${email}`)
                }
                setAuthenticating(false)
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
        <form onSubmit={handleSubmit} className='w-[30rem] max-w-[90vw] flex flex-col gap-6'>
            <div className='input-grp'>
                <Label htmlFor="username">Full Name <span className='text-destructive'>*</span></Label>
                <Input type="text" required id="username" value={name} onChange={e => setName(e.target.value)} />
            </div>

            <div className='grid grid-cols-2 gap-3'>
                <div className='input-grp'>
                    <Label htmlFor="email">Email <span className='text-destructive'>*</span></Label>
                    <Input type="email" required id="email" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className='input-grp'>
                    <Label htmlFor="company">Company</Label>
                    <Input type="text" id="company" value={company} onChange={e => setCompnay(e.target.value)} />
                </div>
            </div>

            <div className='grid grid-cols-2 gap-3'>
                <div className='input-grp'>
                    <Label htmlFor="password">Password <span className='text-destructive'>*</span></Label>
                    <Input type="password" required id="password" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <div className='input-grp'>
                    <Label htmlFor="confirm-password">Confirm Password <span className='text-destructive'>*</span></Label>
                    <Input type="password" required id="confirm-password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                </div>
            </div>

            {error.length > 0
                &&
                <div className="grid grid-cols-4 items-center gap-4">
                    <span className='col-span-4 mt-1 text-sm px-4 pr-8 py-3 destructive group border-destructive bg-destructive text-destructive-foreground rounded-md relative'>
                        {error}
                        <Button className='p-0 h-auto hover:bg-transparent absolute right-3 top-3' variant="ghost" onClick={() => setError("")}><X className='w-3' /></Button>
                    </span>
                </div>
            }

            <div className='flex flex-col items-center justify-center gap-2 mt-4'>
                <Button variant="default" className='w-[50%] flex gap-2' disabled={authenticating}>
                    Sign Up
                    {authenticating
                        &&
                        <CgSpinner className="animate-spin text-xl" />
                    }
                </Button>
                <NavLink to="/login" className="text-slate-600 hover:text-slate-700 dark:text-slate-200 dark:hover:text-slate-300">Already a user? Login</NavLink>
            </div>
        </form>
    )
}

export default SignUpForm