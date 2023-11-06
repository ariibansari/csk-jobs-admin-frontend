import { Location } from '@/utils/types'
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

const CreateLocationDialog = ({ functionToExecuteAfterAddingLocation, toggleButton }: { functionToExecuteAfterAddingLocation: Function, toggleButton?: React.ReactElement }) => {
    const { user } = useContext(UserContext)
    const [newLocationData, setNewLocationData] = useState<Location>({ location: "", created_by: user.user_id })
    const [creatingNewLocation, setCreatingNewLocation] = useState(false)
    const [createNewLocationDialogState, setCreateNewLocationDialogState] = useState(false)
    const [error, setError] = useState("")

    const createNewLocation = (e: React.FormEvent) => {
        e.preventDefault()
        setCreatingNewLocation(true)

        ProtectedAxios.post("/api/common/location/add", { ...newLocationData, user_id: user.user_id })
            .then(res => {
                if (res.data) {
                    setCreatingNewLocation(false)
                    setCreateNewLocationDialogState(false)
                    functionToExecuteAfterAddingLocation({ ...newLocationData, username: res.data.username, location_id: res.data.location_id, created_at: res.data.created_at, updated_at: res.data.updated_at })
                    setNewLocationData({ location: "", created_by: user.user_id })
                }
            })
            .catch((error: any) => {
                setCreatingNewLocation(false)
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
            <Dialog open={createNewLocationDialogState} onOpenChange={setCreateNewLocationDialogState}>
                <DialogTrigger>
                    {toggleButton
                        ? toggleButton
                        : <Button>Create New</Button>
                    }
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>New Location</DialogTitle>
                        <DialogDescription>
                            Fill in the details to create a new location
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={createNewLocation}>
                        <div className="grid gap-4 py-4">
                            <div className="">
                                <Label htmlFor="name" className="text-right">
                                    Location
                                </Label>
                                <Input required type='text' id="name" className="col-span-3" value={newLocationData.location} onChange={e => { setError(""); setNewLocationData({ ...newLocationData, location: e.target.value }) }} />
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
                            <Button type='submit' className='gap-2' disabled={creatingNewLocation}>
                                Create
                                {creatingNewLocation
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

export default CreateLocationDialog