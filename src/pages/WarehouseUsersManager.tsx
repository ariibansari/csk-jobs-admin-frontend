import { useState, useEffect, useContext } from 'react'
import AuthenticatedUsersLayout from './layouts/AuthenticatedUsersLayout'
import { WarehouseUser, warehouseUsersColumns } from '@/components/warehouseUser/warehouseUsersColumns'
import { WarehouseUserDataTable } from '@/components/warehouseUser/WarehouseUsersDataTable'
import ProtectedAxios from '@/api/protectedAxios'
import { toast } from '@/components/ui/use-toast'
import { NewWarehouseUser } from '@/utils/types'
import { EventContext } from '@/context/EventProvider'
import CreateWarehouseUserDialog from '@/components/warehouseUser/CreateWarehouseUserDialog'
import EditWarehouseUserDialog from '@/components/warehouseUser/EditWarehouseUserDialog'
import DeleteWarehouseUserDialog from '@/components/warehouseUser/DeleteWarehouseUserDialog'


const WarehouseUsersManager = () => {
    const { event, setEvent } = useContext(EventContext)

    const [warehouseUsers, setWarehouseUsers] = useState<WarehouseUser[]>([])
    const [fetchingWarehouseUsers, setFetchingWarehouseUsers] = useState(true)

    const [selectedWarehouseUserData, setSelectedWarehouseUserData] = useState<NewWarehouseUser>({ user_id: 0, name: "", username: "", email: "", password: "", isBlocked: false })
    const [editWarehouseUserDialogState, setEditWarehouseUserDialogState] = useState(false)
    const [deleteWarehouseUserDialogState, setDeleteWarehouseUserDialogState] = useState(false)


    const getAllWarehouseUsers = () => {
        setFetchingWarehouseUsers(true)
        ProtectedAxios.get("/api/admin/allWarehouseUsers")
            .then(res => {
                if (res.data) {
                    setWarehouseUsers(res.data)
                    setFetchingWarehouseUsers(false)
                }
            })
            .catch((error: any) => {
                setFetchingWarehouseUsers(false)
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
        getAllWarehouseUsers()
    }, [])


    useEffect(() => {
        if (event.eventName === "EDIT_WAREHOUSE_USER") {
            const data: any = event.payload
            setSelectedWarehouseUserData({ user_id: data.user_id, name: data.name, email: data.email, username: data.username, password: "", isBlocked: data.isBlocked })
            setEditWarehouseUserDialogState(true)

            //reset the event
            setEvent({ eventName: "INITIAL_EVENT", payload: {} })
        }
    }, [event])


    useEffect(() => {
        if (event.eventName === "DELETE_WAREHOUSE_USER") {
            const data: any = event.payload
            setSelectedWarehouseUserData({ user_id: data.user_id, name: data.name, email: data.email, username: data.username, password: "", isBlocked: data.isBlocked })
            setDeleteWarehouseUserDialogState(true)

            //reset the event
            setEvent({ eventName: "INITIAL_EVENT", payload: {} })
        }
    }, [event])


    return (
        <AuthenticatedUsersLayout>
            <div className='flex justify-between'>
                <h1 className='text-2xl font-medium'>Manage Warehouse Users</h1>
                <CreateWarehouseUserDialog
                    functionToExecuteAfterAddingWarehouseUser={(new_warehouse_user: NewWarehouseUser) => {
                        setWarehouseUsers(prev => {
                            let updatedData = [...prev]
                            updatedData.unshift(new_warehouse_user)
                            return updatedData
                        })
                    }}
                />
            </div>

            <WarehouseUserDataTable columns={warehouseUsersColumns} data={warehouseUsers} loadingState={fetchingWarehouseUsers} />

            <EditWarehouseUserDialog
                selectedWarehouseUser={selectedWarehouseUserData}
                functionToExecuteAfterUpdatingWarehouseUser={(updated_user_data: NewWarehouseUser) => {
                    setWarehouseUsers(prev => {
                        let updatedUsers = [...prev]
                        let indexOfSelectedUser = updatedUsers.findIndex(user => user.username === updated_user_data.username)
                        updatedUsers[indexOfSelectedUser] = { ...updated_user_data }
                        return updatedUsers
                    })
                }}
                dialogState={editWarehouseUserDialogState}
                dialogStateSetter={setEditWarehouseUserDialogState}

            />

            <DeleteWarehouseUserDialog
                selectedWarehouseUser={selectedWarehouseUserData}
                functionToExecuteAfterDeletingWarehouseUser={(deleted_user_id: number) => {
                    setWarehouseUsers(prev => {
                        let updatedUsers = prev.filter(user => user.user_id !== deleted_user_id)
                        return updatedUsers
                    })
                }}
                dialogState={deleteWarehouseUserDialogState}
                dialogStateSetter={setDeleteWarehouseUserDialogState}
            />



        </AuthenticatedUsersLayout>
    )
}

export default WarehouseUsersManager