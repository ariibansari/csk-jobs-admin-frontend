import { useContext } from 'react'
import { Button } from './ui/button'
import { UserContext, defaultUserState } from '@/context/UserProvider'
import Axios from '@/api/axios'
import { useNavigate } from 'react-router-dom'

const LogoutButton = () => {
    const { user, setUser } = useContext(UserContext)
    const navigate = useNavigate()

    const logout = () => {
        Axios.post("/api/auth/logout", { user_id: user.user_id })
        setUser(defaultUserState.user)
        navigate("/")
    }

    return (
        <Button type='button' variant="outline" onClick={logout}>Logout</Button>
    )
}

export default LogoutButton