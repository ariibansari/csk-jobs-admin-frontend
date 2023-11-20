import { useContext, useEffect, useState } from "react"
import AuthenticatedUsersLayout from "./layouts/AuthenticatedUsersLayout"
import { Item } from "@/utils/types"
import ProtectedAxios from "@/api/protectedAxios"
import { toast } from "@/components/ui/use-toast"
import CreateItemDialog from "@/components/items/CreateItemDialog"
import EditItemDialog from "@/components/items/EditItemDialog"
import DeleteItemDialog from "@/components/items/DeleteItemDialog"
import { ItemsDataTable } from "@/components/items/ItemsDataTable"
import { itemsColumns } from "@/components/items/itemsColumns"
import { EventContext } from "@/context/EventProvider"

const ItemsManager = () => {
    const { event, setEvent } = useContext(EventContext)

    const [items, setItems] = useState<Item[]>([])
    const [fetchingItems, setFetchingItems] = useState(false)

    const [selectedItemData, setSelectedItemData] = useState<Item>({ item_name: "", lot_number: "", hs_code: "", item_value: 0, customer_name: "", customs_permit_number: "", remarks: "", sku: "", artist_name: "", dimension: "", year_of_creation: 0, created_by: 0, created_at: "" })
    const [editItemDialogState, setEditItemDialogState] = useState(false)
    const [deleteItemDialogState, setDeleteItemDialogState] = useState(false)


    const getAllItems = () => {
        setFetchingItems(true)
        ProtectedAxios.get("/api/common/items")
            .then(res => {
                if (res.data) {
                    setItems(res.data)
                    setFetchingItems(false)
                }
            })
            .catch((error: any) => {
                setFetchingItems(false)

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
        getAllItems()
    }, [])


    useEffect(() => {
        if (event.eventName === "EDIT_ITEM") {
            const data: any = event.payload
            setSelectedItemData({ item_id: data.item_id, item_name: data.item_name, lot_number: data.lot_number, hs_code: data.hs_code, item_value: data.item_value, customer_name: data.customer_name, customs_permit_number: data.customs_permit_number, remarks: data.remarks, sku: data.sku, artist_name: data.artist_name, dimension: data.dimension, year_of_creation: data.year_of_creation, created_by: data.created_by, created_at: data.created_at, unit_id: data.unit_id, unit: data.unit })
            setEditItemDialogState(true)

            //reset the event
            setEvent({ eventName: "INITIAL_EVENT", payload: {} })
        }
    }, [event])


    useEffect(() => {
        if (event.eventName === "DELETE_ITEM") {
            const data: any = event.payload
            setSelectedItemData({ item_id: data.item_id, item_name: data.item_name, lot_number: data.lot_number, hs_code: data.hs_code, item_value: data.item_value, customer_name: data.customer_name, customs_permit_number: data.customs_permit_number, remarks: data.remarks, sku: data.sku, artist_name: data.artist_name, dimension: data.dimension, year_of_creation: data.year_of_creation, created_by: data.created_by, created_at: data.created_at, unit_id: data.unit_id, unit: data.unit })
            setDeleteItemDialogState(true)

            //reset the event
            setEvent({ eventName: "INITIAL_EVENT", payload: {} })
        }
    }, [event])

    return (
        <AuthenticatedUsersLayout>
            <div className='flex justify-between'>
                <h1 className='text-2xl font-medium'>Manage Items</h1>
                <CreateItemDialog
                    functionToExecuteAfterAddingItem={(new_item: Item) => {
                        setItems(prev => {
                            let updatedItems = [...prev]
                            updatedItems.unshift(new_item)
                            return updatedItems
                        })
                    }}
                />
            </div>

            <ItemsDataTable columns={itemsColumns} data={items} loadingState={fetchingItems} />

            <EditItemDialog
                item={selectedItemData}
                functionToExecuteAfterUpdatingItem={(updated_item: Item) => {
                    setItems(prev => {
                        let updatedItems = [...prev]
                        let indexOfSelectedItem = updatedItems.findIndex(item => item.item_id === updated_item.item_id)
                        updatedItems[indexOfSelectedItem] = { ...updated_item }
                        return updatedItems
                    })
                }}
                dialogState={editItemDialogState}
                dialogStateSetter={setEditItemDialogState}
            />

            <DeleteItemDialog
                item={selectedItemData}
                functionToExecuteAfterDeletingItem={(deleted_item: Item) => {
                    setItems(prev => {
                        let updatedItems = prev.filter(item => item.item_id !== deleted_item.item_id)
                        return updatedItems
                    })
                }}
                dialogState={deleteItemDialogState}
                dialogStateSetter={setDeleteItemDialogState}
            />

        </AuthenticatedUsersLayout>
    )
}

export default ItemsManager