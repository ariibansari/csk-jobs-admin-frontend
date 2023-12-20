import { useContext, useEffect, useState } from 'react'
import AuthenticatedUsersLayout from '../layouts/AuthenticatedUsersLayout'
import ProtectedAxios from '@/api/protectedAxios'
import { toast } from '@/components/ui/use-toast'
import CreateUserDialog from '@/components/admin/users/CreateUserDialog'
import { User } from '@/utils/types'
import { UserDataTable } from '@/components/admin/users/UsersDataTable'
import { usersColumns } from '@/components/admin/users/usersColumns'
import DeleteUserDialog from '@/components/admin/users/DeleteUserDialog'
import { EventContext } from '@/context/EventProvider'
import EditUserDialog from '@/components/admin/users/EditUserDialog'

const ManageUsers = () => {
    const { event, setEvent } = useContext(EventContext)

    const [users, setUsers] = useState<User[]>([])
    const [fetchingUsers, setFetchingUsers] = useState(true)

    const [selectedUserData, setSelectedUserData] = useState<User>({ email: "", name: "", password: "" })
    const [editUserDialogState, setEditUserDialogState] = useState(false)
    const [deleteUserDialogState, setDeleteUserDialogState] = useState(false)

    const getUsers = () => {
        setFetchingUsers(true)
        ProtectedAxios.get("/api/admin/users")
            .then(res => {
                if (res.data) {
                    setUsers(res.data)
                    setFetchingUsers(false)
                }
            })
            .catch((error: any) => {
                setFetchingUsers(false)
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

    useEffect(() => {
        getUsers()
    }, [])


    useEffect(() => {
        if (event.eventName === "EDIT_USER") {
            const data: any = event.payload
            setSelectedUserData({ user_id: data.user_id, name: data.name, email: data.email, companyName: data.company_name, offline_plan: data.offline_plan, offline_plan_access_given_at: data.offline_plan_access_given_at, offline_plan_access_expires_at: data.offline_plan_access_expires_at })
            setEditUserDialogState(true)

            //reset the event
            setEvent({ eventName: "INITIAL_EVENT", payload: {} })
        }
    }, [event])

    useEffect(() => {
        if (event.eventName === "DELETE_USER") {
            const data: any = event.payload
            setSelectedUserData({ user_id: data.user_id, name: data.name, email: data.email })
            setDeleteUserDialogState(true)

            //reset the event
            setEvent({ eventName: "INITIAL_EVENT", payload: {} })
        }
    }, [event])

    return (
        <AuthenticatedUsersLayout>
            <div className='flex justify-between'>
                <h1 className='text-2xl font-medium'>Manage Users</h1>
                <CreateUserDialog
                    functionToExecuteAfterAddingUser={(new_user: User) => {
                        setUsers(prev => {
                            let updatedData = [...prev]
                            updatedData.unshift(new_user)
                            return updatedData
                        })
                    }}
                />
            </div>

            <UserDataTable columns={usersColumns} data={users} loadingState={fetchingUsers} />

            <EditUserDialog
                selectedUser={selectedUserData}
                functionToExecuteAfterUpdatingUser={(updated_user_data: User) => {
                    setUsers(prev => {
                        let updatedUsers = [...prev]
                        let indexOfSelectedUser = updatedUsers.findIndex(user => user.email === updated_user_data.email)
                        updatedUsers[indexOfSelectedUser] = { ...updated_user_data }
                        return updatedUsers
                    })
                }}
                dialogState={editUserDialogState}
                dialogStateSetter={setEditUserDialogState}

            />

            <DeleteUserDialog
                selectedUser={selectedUserData}
                functionToExecuteAfterDeletingUser={(deleted_user_id: number) => {
                    setUsers(prev => {
                        let updatedUsers = prev.filter(user => user.user_id !== deleted_user_id)
                        return updatedUsers
                    })
                }}
                dialogState={deleteUserDialogState}
                dialogStateSetter={setDeleteUserDialogState}
            />
        </AuthenticatedUsersLayout>
    )
}

export default ManageUsers