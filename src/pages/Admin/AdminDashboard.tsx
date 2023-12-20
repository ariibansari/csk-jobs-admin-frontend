import { useContext } from 'react'
import { UserContext } from "@/context/UserProvider"
import AuthenticatedUsersLayout from '../layouts/AuthenticatedUsersLayout'


const AdminDashboard = () => {
    const { user } = useContext(UserContext)

    return (
        <AuthenticatedUsersLayout>
            <div className='my-14'>
                <h1 className='text-2xl font-semibold mb-3'>Dashboard</h1>
                <div className='text-muted-foreground'>Hello, {user.name}</div>
                <div className='text-muted-foreground'>{user.role}</div>
            </div>
        </AuthenticatedUsersLayout>
    )
}

export default AdminDashboard