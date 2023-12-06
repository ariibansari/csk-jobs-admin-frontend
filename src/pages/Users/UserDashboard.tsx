import { useContext } from 'react'
import { UserContext } from "@/context/UserProvider"
import AuthenticatedUsersLayout from '../layouts/AuthenticatedUsersLayout'
import ProtectedAxios from '@/api/protectedAxios'
import { toast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'



const UserDashboard = () => {
    const { user } = useContext(UserContext)

    return (
        <AuthenticatedUsersLayout>
            <div className='my-14'>
                <h1 className='text-2xl font-semibold mb-3'>Dashboard</h1>
                <div className='text-muted-foreground'>Hello, {user.name}</div>
            </div>
        </AuthenticatedUsersLayout>
    )
}

export default UserDashboard