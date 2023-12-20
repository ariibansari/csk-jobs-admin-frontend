import { useContext, useEffect, useState } from 'react'
import AuthenticatedUsersLayout from '../layouts/AuthenticatedUsersLayout'
import ProtectedAxios from '@/api/protectedAxios'
import { toast } from '@/components/ui/use-toast'
import { ApiKey } from '@/utils/types'
import { EventContext } from '@/context/EventProvider'
import { UserContext } from '@/context/UserProvider'
import { KeysDataTable } from '@/components/user/apiKeys/KeysDataTable'
import { keysColumns } from '@/components/user/apiKeys/keysColumns'
import CreateKeyDialog from '@/components/user/apiKeys/CreateKeyDialog'
import DeleteKeyDialog from '@/components/user/apiKeys/DeleteKeyDialog'
import EditKeyDialog from '@/components/user/apiKeys/EditKeyDialog'

const ApiKeys = () => {
    const { event, setEvent } = useContext(EventContext)
    const { user } = useContext(UserContext)

    const [keys, setKeys] = useState<ApiKey[]>([])
    const [fetchingKeys, setFetchingKeys] = useState(true)

    const [selectedKeyData, setSelectedKeyData] = useState<ApiKey>({ api_key_id: 0, api_key_name: "", api_key: "", created_at: null })
    const [editKeyDialogState, setEditKeyDialogState] = useState(false)
    const [deleteKeyDialogState, setDeleteKeyDialogState] = useState(false)

    useEffect(() => {
        getApiKeys()
    }, [])

    const getApiKeys = () => {
        setFetchingKeys(true)
        ProtectedAxios.get(`/api/user/apiKeys/${user.user_id}`)
            .then(res => {
                if (res.data) {
                    setKeys(res.data)
                    setFetchingKeys(false)
                }
            })
            .catch((error: any) => {
                setFetchingKeys(false)
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
        if (event.eventName === "EDIT_KEY") {
            const data: any = event.payload
            setSelectedKeyData({ api_key_id: data.api_key_id, api_key_name: data.api_key_name, api_key: data.api_key, created_at: data.created_at })
            setEditKeyDialogState(true)

            //reset the event
            setEvent({ eventName: "INITIAL_EVENT", payload: {} })
        }
    }, [event])

    useEffect(() => {
        if (event.eventName === "DELETE_KEY") {
            const data: any = event.payload
            setSelectedKeyData({ api_key_id: data.api_key_id, api_key_name: data.api_key_name, api_key: data.api_key, created_at: data.created_at })
            setDeleteKeyDialogState(true)

            //reset the event
            setEvent({ eventName: "INITIAL_EVENT", payload: {} })
        }
    }, [event])

    useEffect(() => {
        if (event.eventName === "TOGGLE_KEY_STATUS") {
            const data: any = event.payload

            setKeys(prev => {
                const updated = [...prev]
                console.log(data);

                console.log("old - ", updated);
                const index = updated.findIndex(key => key.api_key_id === data.api_key_id)
                updated[index] = { ...updated[index], active: data.updated_status }
                console.log("new - ", updated);
                return updated
            })

            //reset the event
            setEvent({ eventName: "INITIAL_EVENT", payload: {} })
        }
    }, [event])

    return (
        <AuthenticatedUsersLayout>
            <div className='flex justify-between'>
                <h1 className='text-2xl font-medium'>API Keys</h1>

                <CreateKeyDialog
                    functionToExecuteAfterAddingKey={(new_key: ApiKey) => {
                        setKeys(prev => {
                            let updatedData = [...prev]
                            updatedData.unshift(new_key)
                            return updatedData
                        })
                    }}
                />
            </div>

            <KeysDataTable columns={keysColumns} data={keys} loadingState={fetchingKeys} />

            <EditKeyDialog
                selectedKey={selectedKeyData}
                functionToExecuteAfterUpdatingKey={(updated_key_data: ApiKey) => {
                    setKeys(prev => {
                        let updatedKeys = [...prev]
                        let indexOfSelectedKey = updatedKeys.findIndex(key => key.api_key_id === updated_key_data.api_key_id)
                        updatedKeys[indexOfSelectedKey] = { ...updatedKeys[indexOfSelectedKey], api_key_name: updated_key_data.api_key_name }
                        return updatedKeys
                    })
                }}
                dialogState={editKeyDialogState}
                dialogStateSetter={setEditKeyDialogState}
            />

            <DeleteKeyDialog
                selectedKey={selectedKeyData}
                functionToExecuteAfterDeletingKey={(deleted_api_key_id: number) => {
                    setKeys(prev => {
                        let updatedKeys = prev.filter(key => key.api_key_id !== deleted_api_key_id)
                        return updatedKeys
                    })
                }}
                dialogState={deleteKeyDialogState}
                dialogStateSetter={setDeleteKeyDialogState}
            />
        </AuthenticatedUsersLayout>
    )
}

export default ApiKeys