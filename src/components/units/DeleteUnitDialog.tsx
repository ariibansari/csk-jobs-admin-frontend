import { Unit } from '@/utils/types'
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

const DeleteUnitDialog = ({ unit, functionToExecuteAfterDeletingUnit, toggleButton, dialogState, dialogStateSetter }: { unit: Unit, functionToExecuteAfterDeletingUnit: Function, toggleButton?: React.ReactElement, dialogState: boolean, dialogStateSetter: Dispatch<SetStateAction<boolean>> }) => {
    const { user } = useContext(UserContext)
    const [selectedUnitData, setSelectedUnitData] = useState<Unit>(unit)
    const [deletingUnit, setDeletingUnit] = useState(false)

    useEffect(() => {
        setSelectedUnitData(unit)
    }, [unit])

    const deleteUnit = () => {
        setDeletingUnit(true)

        ProtectedAxios.post("/api/admin/unit/delete", { user_id: user.user_id, unit_id: selectedUnitData.unit_id })
            .then(res => {
                if (res.data) {
                    setDeletingUnit(false)
                    dialogStateSetter(false)
                    functionToExecuteAfterDeletingUnit(res.data)
                    setSelectedUnitData({ unit: "", created_by: user.user_id })
                }
            })
            .catch((error: any) => {
                setDeletingUnit(false)
                if (error.response?.status === 409 && error.response?.data.error) {
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
                        <DialogTitle>Delete Unit</DialogTitle>
                    </DialogHeader>
                    <div>
                        <p>Are you sure you want to delete this unit?</p>
                        <DialogDescription>
                            <p>{selectedUnitData.unit}</p>
                        </DialogDescription>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => deleteUnit()} variant="destructive" className='gap-2' disabled={deletingUnit}>
                            Yes, Delete
                            {deletingUnit
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

export default DeleteUnitDialog