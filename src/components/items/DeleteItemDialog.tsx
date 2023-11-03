import { Item } from '@/utils/types'
import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { CgSpinner } from 'react-icons/cg'
import { UserContext } from '@/context/UserProvider'
import ProtectedAxios from '@/api/protectedAxios'
import { toast } from '../ui/use-toast'

const DeleteItemDialog = ({ item, functionToExecuteAfterUpdatingItem, toggleButton, dialogState, dialogStateSetter }: { item: Item, functionToExecuteAfterUpdatingItem: Function, toggleButton?: React.ReactElement, dialogState: boolean, dialogStateSetter: Dispatch<SetStateAction<boolean>> }) => {
    const { user } = useContext(UserContext)
    const [selectedItemData, setSelectedItemData] = useState<Item>(item)
    const [deletingItem, setDeletingItem] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        setSelectedItemData(item)
    }, [item])

    const deleteItem = () => {
        setDeletingItem(true)

        ProtectedAxios.post("/api/admin/item/delete", { user_id: user.user_id, item_id: selectedItemData.item_id })
            .then(res => {
                if (res.data) {
                    setDeletingItem(false)
                    dialogStateSetter(false)
                    functionToExecuteAfterUpdatingItem(res.data)
                    setSelectedItemData({ item_id: 0, name: "", lot_number: "", item_description: "", hs_code: "", item_value: 0, customer_name: "", customer_permit_number: "", created_by: user.user_id, created_at: "", updated_at: "" })
                }
            })
            .catch((error: any) => {
                setDeletingItem(false)
                if (error.response?.status === 409 && error.response?.data.error) {
                    setError(error.response?.data.error)
                    return
                }

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


    return (
        <>
            <Dialog open={dialogState} onOpenChange={dialogStateSetter}>
                {toggleButton
                    &&
                    <DialogTrigger>
                        {toggleButton}
                    </DialogTrigger>
                }
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Item</DialogTitle>
                    </DialogHeader>
                    <div>
                        <p>Are you sure you want to delete this item?</p>
                        <DialogDescription>
                            <p>Name: {selectedItemData.name}</p>
                            <p>Descriptoin: {selectedItemData.item_description}</p>
                        </DialogDescription>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => deleteItem()} variant="destructive" className='gap-2' disabled={deletingItem}>
                            Yes, Delete
                            {deletingItem
                                &&
                                <CgSpinner className="animate-spin text-xl" />
                            }
                        </Button>
                    </DialogFooter>

                </DialogContent>
            </Dialog>
        </>
    )
}

export default DeleteItemDialog