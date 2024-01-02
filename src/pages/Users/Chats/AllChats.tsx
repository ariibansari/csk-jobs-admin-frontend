import AuthenticatedUsersLayout from "../../layouts/AuthenticatedUsersLayout"

const AllChats = () => {
    return (
        <AuthenticatedUsersLayout>
            <div className='my-7'>
                <h1 className='text-2xl font-semibold mb-3'>Your Chats</h1>
            </div>
        </AuthenticatedUsersLayout>
    )
}

export default AllChats