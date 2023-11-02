
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import UnauthenticatedUsersLayout from "./layouts/UnauthenticatedUsersLayout"
import { useNavigate } from "react-router-dom"
import React, { useState } from "react"
import { CgSpinner } from "react-icons/cg"
import Axios from "@/api/axios"
import { toast } from "@/components/ui/use-toast"


const ForgotPassword = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [sendingEmail, setSendingEmail] = useState(false)

    const sendRestEmail = (e: React.FormEvent) => {
        e.preventDefault();
        setSendingEmail(true)
        Axios.post("/api/auth/sendPasswordResetLink", { email })
            .then(res => {
                if (res.data) {
                    toast({
                        variant: "success",
                        title: res.data.message,
                    })
                }
                navigate("/")
            })
            .catch((error: any) => {
                setSendingEmail(false)

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
                <Card className="w-[350px] bg-background border-none shadow-none">
                    <CardHeader className="my-5">
                        <CardTitle>Forgot Password</CardTitle>
                        <CardDescription>A password reset link will be sent to your registered email address.</CardDescription>
                    </CardHeader>
                    <form onSubmit={sendRestEmail}>
                        <CardContent>
                            <div className="grid w-full items-center gap-4">
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" required placeholder="Enter your registerd email address" value={email} onChange={e => setEmail(e.target.value)} />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button type="button" variant="outline" onClick={() => navigate(-1)}>Back</Button>
                            <Button type="submit" disabled={sendingEmail} className="flex gap-2">
                                Send
                                {sendingEmail
                                    &&
                                    <CgSpinner className="animate-spin text-xl" />
                                }
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </UnauthenticatedUsersLayout>
    )
}

export default ForgotPassword