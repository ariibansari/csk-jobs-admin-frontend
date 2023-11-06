import { Location, Unit } from '@/utils/types'
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
import { UserContext } from '@/context/UserProvider'
import ProtectedAxios from '@/api/protectedAxios'
import { toast } from '../ui/use-toast'
import { Label } from '@/components/ui/label'

const EditUnitDialog = ({ unit, functionToExecuteAfterUpdatingUnit, toggleButton, dialogState, dialogStateSetter }: { unit: Unit, functionToExecuteAfterUpdatingUnit: Function, toggleButton?: React.ReactElement, dialogState: boolean, dialogStateSetter: Dispatch<SetStateAction<boolean>> }) => {
    const { user } = useContext(UserContext)
    const [selectedUnitData, setSelectedUnitData] = useState<Unit>(unit)
    const [updatingUnit, setUpdatingUnit] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        setSelectedUnitData(unit)
    }, [unit])

    const updateUnit = (e: React.FormEvent) => {
        e.preventDefault()
        setUpdatingUnit(true)

        ProtectedAxios.post("/api/admin/unit/update", { ...selectedUnitData, user_id: user.user_id })
            .then(res => {
                if (res.data) {
                    setUpdatingUnit(false)
                    dialogStateSetter(false)
                    functionToExecuteAfterUpdatingUnit(res.data)
                    setSelectedUnitData({ unit: "", created_by: user.user_id })
                }
            })
            .catch((error: any) => {
                setUpdatingUnit(false)
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
                        <DialogTitle>Update Unit</DialogTitle>
                        <DialogDescription>
                            Update the details and click on save button
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={updateUnit}>
                        <div className="grid gap-4 py-4">
                            <div className="">
                                <Label htmlFor="name" className="text-right">
                                    Unit
                                </Label>
                                <Input required type='text' id="name" className="col-span-3" value={selectedUnitData.unit} onChange={e => { setError(""); setSelectedUnitData({ ...selectedUnitData, unit: e.target.value }) }} />
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
                            <Button type='submit' className='gap-2' disabled={updatingUnit}>
                                Save
                                {updatingUnit
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

export default EditUnitDialog