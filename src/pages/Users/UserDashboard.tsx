import { useContext } from 'react'
import { UserContext } from "@/context/UserProvider"
import AuthenticatedUsersLayout from '../layouts/AuthenticatedUsersLayout'



const UserDashboard = () => {
    const { user } = useContext(UserContext)

    return (
        <AuthenticatedUsersLayout>
            <div className='my-14'>
                <h1 className='text-2xl font-semibold'>Dashboard</h1>
                <div>Name: {user.name}</div>
                <div>Email: {user.email}</div>
                <div>Customer ID: {user.customer_id}</div>
                <div>Role: {user.role}</div>
            </div>
        </AuthenticatedUsersLayout>
    )
}

export default UserDashboard