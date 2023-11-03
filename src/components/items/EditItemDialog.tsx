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
import { Input } from '@/components/ui/input'
import { CgSpinner } from 'react-icons/cg'
import { X } from 'lucide-react'
import { Textarea } from '../ui/textarea'
import { UserContext } from '@/context/UserProvider'
import ProtectedAxios from '@/api/protectedAxios'
import { toast } from '../ui/use-toast'
import { Label } from '@/components/ui/label'

const EditItemDialog = ({ item, functionToExecuteAfterUpdatingItem, toggleButton, dialogState, dialogStateSetter }: { item: Item, functionToExecuteAfterUpdatingItem: Function, toggleButton?: React.ReactElement, dialogState: boolean, dialogStateSetter: Dispatch<SetStateAction<boolean>> }) => {
    const { user } = useContext(UserContext)
    const [selectedItemData, setSelectedItemData] = useState<Item>(item)
    const [updatingItem, setUpdatingItem] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        setSelectedItemData(item)
    }, [item])

    const updateItem = (e: React.FormEvent) => {
        e.preventDefault()
        setUpdatingItem(true)

        ProtectedAxios.post("/api/common/item/update", { ...selectedItemData, user_id: user.user_id })
            .then(res => {
                if (res.data) {
                    setUpdatingItem(false)
                    dialogStateSetter(false)
                    functionToExecuteAfterUpdatingItem(res.data)
                    setSelectedItemData({ item_id: 0, name: "", lot_number: "", item_description: "", hs_code: "", item_value: 0, customer_name: "", customer_permit_number: "", created_by: user.user_id, created_at: "", updated_at: "" })
                }
            })
            .catch((error: any) => {
                setUpdatingItem(false)
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
                        <DialogTitle>Update Item</DialogTitle>
                        <DialogDescription>
                            Update the details and click on save button
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={updateItem}>
                        <div className="grid gap-4 py-4">
                            <div className="">
                                <Label htmlFor="name" className="text-right">
                                    Name
                                </Label>
                                <Input required type='text' id="name" className="col-span-3" value={selectedItemData.name} onChange={e => { setError(""); setSelectedItemData({ ...selectedItemData, name: e.target.value }) }} />
                            </div>

                            <div className="">
                                <Label htmlFor="description" className="text-right">
                                    Item Description
                                </Label>
                                <Textarea required id="description" className="col-span-3" value={selectedItemData.item_description} onChange={e => { setError(""); setSelectedItemData({ ...selectedItemData, item_description: e.target.value }) }} />
                            </div>

                            <div className='grid grid-cols-2 gap-4'>
                                <div className="">
                                    <Label htmlFor="lot_number" className="text-right">
                                        Lot Number
                                    </Label>
                                    <Input required type='text' id="lot_number" className="col-span-3" value={selectedItemData.lot_number} onChange={e => { setError(""); setSelectedItemData({ ...selectedItemData, lot_number: e.target.value }) }} />
                                </div>

                                <div className="">
                                    <Label htmlFor="hs_code" className="text-right">
                                        HS Code
                                    </Label>
                                    <Input required type='text' id="hs_code" className="col-span-3" value={selectedItemData.hs_code} onChange={e => { setError(""); setSelectedItemData({ ...selectedItemData, hs_code: e.target.value }) }} />
                                </div>
                            </div>

                            <div className='grid grid-cols-2 gap-4'>
                                <div className="">
                                    <Label htmlFor="item_value" className="text-right">
                                        Item Value
                                    </Label>
                                    <Input required type='number' id="item_value" className="col-span-3" value={selectedItemData.item_value} onChange={e => { setError(""); setSelectedItemData({ ...selectedItemData, item_value: parseFloat(e.target.value) }) }} />
                                </div>

                                <div className="">
                                    <Label htmlFor="customer_name" className="text-right">
                                        Customer Name
                                    </Label>
                                    <Input required type='text' id="customer_name" className="col-span-3" value={selectedItemData.customer_name} onChange={e => { setError(""); setSelectedItemData({ ...selectedItemData, customer_name: e.target.value }) }} />
                                </div>
                            </div>

                            <div className="">
                                <Label htmlFor="customer_permit_number" className="text-right">
                                    Customer Permit Number
                                </Label>
                                <Input required type='text' id="customer_permit_number" className="col-span-3" value={selectedItemData.customer_permit_number} onChange={e => { setError(""); setSelectedItemData({ ...selectedItemData, customer_permit_number: e.target.value }) }} />
                            </div>

                            {error.length > 0
                                &&
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <span className='col-span-4 mt-1 text-sm px-4 pr-8 py-3 destructive group border-destructive bg-destructive text-destructive-foreground rounded-md relative'>
                                        {error}
                                        <Button className='p-0 h-auto hover:bg-transparent absolute right-3 top-3' variant="ghost" onClick={() => setError("")}><X className='w-3' /></Button>
                                    </span>
                                </div>
                            }
                        </div>

                        <DialogFooter>
                            <Button type='submit' className='gap-2' disabled={updatingItem}>
                                Save
                                {updatingItem
                                    &&
                                    <CgSpinner className="animate-spin text-xl" />
                                }
                            </Button>
                        </DialogFooter>
                    </form>

                </DialogContent>
            </Dialog>
        </>
    )
}

export default EditItemDialog