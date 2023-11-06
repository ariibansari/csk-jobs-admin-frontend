import { Unit } from '@/utils/types'
import React, { useContext, useState } from 'react'
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

const CreateUnitDialog = ({ functionToExecuteAfterAddingUnit, toggleButton }: { functionToExecuteAfterAddingUnit: Function, toggleButton?: React.ReactElement }) => {
    const { user } = useContext(UserContext)
    const [newUnitData, setNewUnitData] = useState<Unit>({ unit: "", created_by: user.user_id })
    const [creatingNewUnit, setCreatingNewUnit] = useState(false)
    const [createNewUnitDialogState, setCreateNewUnitDialogState] = useState(false)
    const [error, setError] = useState("")

    const createNewUnit = (e: React.FormEvent) => {
        e.preventDefault()
        setCreatingNewUnit(true)

        ProtectedAxios.post("/api/admin/unit/add", { ...newUnitData, user_id: user.user_id })
            .then(res => {
                if (res.data) {
                    setCreatingNewUnit(false)
                    setCreateNewUnitDialogState(false)
                    functionToExecuteAfterAddingUnit({ ...newUnitData, username: res.data.username, unit_id: res.data.unit_id, created_at: res.data.created_at, updated_at: res.data.updated_at })
                    setNewUnitData({ unit: "", created_by: user.user_id })
                }
            })
            .catch((error: any) => {
                setCreatingNewUnit(false)
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
            <Dialog open={createNewUnitDialogState} onOpenChange={setCreateNewUnitDialogState}>
                <DialogTrigger>
                    {toggleButton
                        ? toggleButton
                        : <Button>Create New</Button>
                    }
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>New Unit</DialogTitle>
                        <DialogDescription>
                            Fill in the details to create a new unit
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={createNewUnit}>
                        <div className="grid gap-4 py-4">
                            <div className="">
                                <Label htmlFor="name" className="text-right">
                                    Unit
                                </Label>
                                <Input required type='text' id="name" className="col-span-3" value={newUnitData.unit} onChange={e => { setError(""); setNewUnitData({ ...newUnitData, unit: e.target.value }) }} />
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
                            <Button type='submit' className='gap-2' disabled={creatingNewUnit}>
                                Create
                                {creatingNewUnit
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

export default CreateUnitDialog