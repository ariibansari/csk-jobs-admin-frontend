import { useContext, useEffect, useState } from 'react'
import { UserContext } from "@/context/UserProvider"
import AuthenticatedUsersLayout from './layouts/AuthenticatedUsersLayout'
import ProtectedAxios from '@/api/protectedAxios'
import { toast } from '@/components/ui/use-toast'
import { AxiosError, AxiosResponse } from 'axios'
import { Button } from '@/components/ui/button'

type Profile = {
    user_id: number,
    name: string,
    username: string,
    email: string
}
const Dashboard = () => {
    const { user } = useContext(UserContext)
    const [profile, setProfile] = useState<Profile>({ user_id: 0, name: "", username: "", email: "" })

    const fetchProfile = () => {
        ProtectedAxios.get(`/api/common/profile/${user.user_id}`)
            .then((res: AxiosResponse) => {
                console.log(res);
                setProfile(res.data)
            })
            .catch((error: AxiosError) => {
                toast({
                    variant: "destructive",
                    title: error.message
                })
            })
    }

    useEffect(() => {
        fetchProfile()
    }, [])

    return (
        <AuthenticatedUsersLayout>
            <div className='my-14'>
                <h1 className='text-2xl font-semibold'>Dashboard</h1>
                <div>Role: {user.role}</div>

                <br />
                <br />
                <hr />
                <br />
                <br />

                <div className='flex items-end gap-3'>
                    <h3 className='text-xl font-medium'>Profile</h3>
                </div>
                <br />
                <p>Id - {profile.user_id}</p>
                <p>Name - {profile.name}</p>
                <p>Username - {profile.username}</p>
                <p>Email - {profile.email}</p>
                <br />
                <Button onClick={() => fetchProfile()}>Refresh</Button>
            </div>
        </AuthenticatedUsersLayout>
    )
}

export default Dashboard