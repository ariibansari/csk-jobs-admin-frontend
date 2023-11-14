import { Item, Unit } from '@/utils/types'
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
import { Check, ChevronsUpDown, X } from 'lucide-react'
import { Textarea } from '../ui/textarea'
import { UserContext } from '@/context/UserProvider'
import ProtectedAxios from '@/api/protectedAxios'
import { toast } from '../ui/use-toast'
import { Label } from '@/components/ui/label'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from '@/lib/utils'
import { Skeleton } from '../ui/skeleton'
import { NavLink } from 'react-router-dom'

const EditItemDialog = ({ item, functionToExecuteAfterUpdatingItem, toggleButton, dialogState, dialogStateSetter }: { item: Item, functionToExecuteAfterUpdatingItem: Function, toggleButton?: React.ReactElement, dialogState: boolean, dialogStateSetter: Dispatch<SetStateAction<boolean>> }) => {
    const { user } = useContext(UserContext)
    const [selectedItemData, setSelectedItemData] = useState<Item>(item)
    const [updatingItem, setUpdatingItem] = useState(false)
    const [error, setError] = useState("")

    const [loadingUnits, setLoadingUnits] = useState(true)
    const [units, setUnits] = useState<Unit[]>([])
    const [unitsSelectState, setUnitsSelectState] = useState(false)
    const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null)

    const getAllUnits = () => {
        setLoadingUnits(true)
        ProtectedAxios.get("/api/common/units")
            .then(res => {
                if (res.data) {
                    setUnits(res.data)
                    setLoadingUnits(false)
                }
            })
            .catch((error: any) => {
                setLoadingUnits(false)
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
        getAllUnits()
    }, [])

    useEffect(() => {
        setSelectedItemData(item)
        if (item.unit && item.unit_id) {
            setSelectedUnit({ unit_id: item.unit_id, unit: item.unit })
        }
    }, [item])

    const updateItem = (e: React.FormEvent) => {
        e.preventDefault()
        setUpdatingItem(true)

        if (!selectedUnit?.unit_id) {
            setError("Please select a unit of measurement for this item")
            setUpdatingItem(false)
            return
        }

        ProtectedAxios.post("/api/common/item/update", { ...selectedItemData, user_id: user.user_id, unit_id: selectedUnit.unit_id })
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

                    {loadingUnits
                        ?
                        <div className="flex flex-col gap-8">
                            <div>
                                <Skeleton className="w-[50%] h-4 mb-3" />
                                <Skeleton className="w-[100%] h-10 " />
                            </div>
                            <div className='flex gap-6'>
                                <div className='w-[50%]'>
                                    <Skeleton className="w-[50%] h-4 mb-3" />
                                    <Skeleton className="w-[100%] h-10 " />
                                </div>
                                <div className='w-[50%]'>
                                    <Skeleton className="w-[50%] h-4 mb-3" />
                                    <Skeleton className="w-[100%] h-10 " />
                                </div>
                            </div>
                            <div className='flex gap-6'>
                                <div className='w-[50%]'>
                                    <Skeleton className="w-[50%] h-4 mb-3" />
                                    <Skeleton className="w-[100%] h-10 " />
                                </div>
                                <div className='w-[50%]'>
                                    <Skeleton className="w-[50%] h-4 mb-3" />
                                    <Skeleton className="w-[100%] h-10 " />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-end my-3"><Skeleton className="h-10 w-28" /></div>
                            </div>
                        </div>

                        :
                        //after units are loaded check if there is any unit in the system if not then prompt user to create new units to continue creating new item
                        <>
                            {units.length === 0
                                ?
                                <div className='mt-6'>
                                    <h3 className='text-red-500'>There are no units created in the system. Create atleast one unit to continue updating an item</h3>
                                    <div className='w-[100%] flex justify-end mt-6'>
                                        <NavLink to="/unit-manager"><Button>Manage Units</Button></NavLink>
                                    </div>
                                </div>

                                :
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

                                        <div>
                                            <Label className="text-sm">Select Unit of Measurement</Label>
                                            <Popover open={unitsSelectState} onOpenChange={setUnitsSelectState}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        className="w-[100%] justify-between"
                                                    >
                                                        {selectedUnit
                                                            ? <>{selectedUnit.unit.substring(0, 30)} {selectedUnit?.unit.length > 30 && "..."}</>
                                                            : "No unit selected..."}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[20rem] max-w-[95vw] p-0">
                                                    <Command>
                                                        <CommandInput placeholder="Search unit..." />
                                                        <CommandEmpty>No units found.</CommandEmpty>
                                                        <CommandGroup>
                                                            {units.map((unit) => (
                                                                <CommandItem
                                                                    key={unit.unit_id}
                                                                    value={JSON.stringify(unit)}
                                                                    onSelect={(currentValue) => {
                                                                        setSelectedUnit(JSON.parse(currentValue))
                                                                        setUnitsSelectState(false)
                                                                    }}
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            "mr-2 h-4 w-4",
                                                                            selectedUnit?.unit_id === unit.unit_id ? "opacity-100" : "opacity-0"
                                                                        )}
                                                                    />
                                                                    {unit.unit}
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
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
                            }
                        </>
                    }


                </DialogContent>
            </Dialog>
        </>
    )
}

export default EditItemDialog