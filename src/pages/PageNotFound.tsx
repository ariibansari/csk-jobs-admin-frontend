import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { UserContext } from '@/context/UserProvider'

const PageNotFound = () => {
    const { user } = useContext(UserContext)
    const navigate = useNavigate()

    return (
        <div className='flex flex-col h-[100dvh] items-center justify-center gap-7'>
            <div className='flex items-center gap-3'>
                <h1 className='text-3xl'>404</h1>
                <span className='text-4xl font-extralight text-muted-foreground'>|</span>
                <h2>PAGE NOT FOUND</h2>
            </div>
            <Button className='' onClick={() => {
                if (user.accessToken) {
                    navigate(-1)
                }
                else {
                    navigate("/")
                }
            }}
            >
                Go Back
            </Button>
        </div>
    )
}

export default PageNotFound