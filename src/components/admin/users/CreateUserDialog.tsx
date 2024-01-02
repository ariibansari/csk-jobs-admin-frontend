import ProtectedAxios from '@/api/protectedAxios'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { DateTimePicker } from '@/components/ui/dateTimePicker'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'
import { User } from '@/utils/types'
import { addMonths } from 'date-fns'
import { Check, ChevronsUpDown, Eye, EyeOff, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { CgSpinner } from 'react-icons/cg'

const CreateUserDialog = ({ functionToExecuteAfterAddingUser, toggleButton }: { functionToExecuteAfterAddingUser: Function, toggleButton?: React.ReactElement }) => {
    const [newUserData, setNewUserData] = useState<User>({ name: "", companyName: "", email: "", password: "" })
    const [creatingNewUser, setCreatingNewUser] = useState(false)
    const [creatingNewUserDialogState, setCreatingNewUserDialogState] = useState(false)
    const [error, setError] = useState("")
    const [viewingPassword, setViewingPassword] = useState(false)

    const [addOfflinePlan, setAddOfflinePlan] = useState(false)

    const [plansCombobox, setPlansCombobox] = useState(false)
    const [plans, setPlans] = useState([])
    const [loadingPlans, setLoadingPlans] = useState(true)
    const [selectedPlan, setSelectedPlan] = useState("")

    const [offlinePlanExpirationDate, setOfflinePlanExpirationDate] = useState<Date | null>(addMonths(new Date(), 1));
    const handleDateChange = (date: Date) => {
        setOfflinePlanExpirationDate(date);
    };

    useEffect(() => {
        fetchPlans()
    }, [])

    const fetchPlans = () => {
        setLoadingPlans(true)
        ProtectedAxios.get("/api/admin/getPlanTypes")
            .then(res => {
                if (res.data) {
                    setPlans(res.data)
                    setLoadingPlans(false)
                }
            })
            .catch(err => {
                setLoadingPlans(false)
                console.log(err);
                toast({
                    variant: "destructive",
                    title: "There was some issue getting the plans, please try again later"
                })
            })
    }


    const createNewUser = (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (addOfflinePlan && !selectedPlan) {
            setError("Select a plan to continue")
            return
        }

        setCreatingNewUser(true)
        ProtectedAxios.post("/api/admin/createUser", { ...newUserData, addOfflinePlan, selectedPlan, offlinePlanExpirationDate })
            .then(res => {
                if (res.data) {
                    functionToExecuteAfterAddingUser(res.data.new_user_data)

                    toast({
                        variant: "success",
                        title: res.data.message
                    })

                    setNewUserData({ name: "", email: "", password: "" })
                    setCreatingNewUserDialogState(false)
                    setCreatingNewUser(false)
                }
            })
            .catch((error: any) => {
                setCreatingNewUser(false)
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
            <Dialog open={creatingNewUserDialogState} onOpenChange={setCreatingNewUserDialogState}>
                <DialogTrigger>
                    {toggleButton
                        ? toggleButton
                        : <Button>Create New</Button>
                    }
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>New User</DialogTitle>
                        <DialogDescription>
                            Fill in the details to create a new user
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={createNewUser}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                    Name <span className='text-destructive'>*</span>
                                </Label>
                                <Input required type='text' id="name" className="col-span-3" value={newUserData.name} onChange={e => { setError(""); setNewUserData({ ...newUserData, name: e.target.value }) }} />
                            </div>

                            {/* <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="company" className="text-right">
                                    Company
                                </Label>
                                <Input type='text' id="company" className="col-span-3" value={newUserData.companyName} onChange={e => { setError(""); setNewUserData({ ...newUserData, companyName: e.target.value }) }} />
                            </div> */}

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="email" className="text-right">
                                    Email <span className='text-destructive'>*</span>
                                </Label>
                                <Input required type='email' id="email" className="col-span-3" value={newUserData.email} onChange={e => { setError(""); setNewUserData({ ...newUserData, email: e.target.value }) }} />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="password" className="text-right">
                                    Password <span className='text-destructive'>*</span>
                                </Label>
                                <div className='relative col-span-3'>
                                    <Input required type={viewingPassword ? 'text' : 'password'} className='pr-10' id="password" value={newUserData.password} onChange={e => { setError(""); setNewUserData({ ...newUserData, password: e.target.value }) }} />
                                    <Button type="button" variant="ghost" className='absolute right-2 top-[50%] translate-y-[-50%] p-1 hover:bg-transparent' onClick={() => setViewingPassword(prev => !prev)}>
                                        {viewingPassword
                                            ? <Eye className='w-5' />
                                            : <EyeOff className='w-5' />
                                        }
                                    </Button>
                                </div>
                            </div>

                            {/* <hr />

                            <div>
                                <div className="flex items-center space-x-2 mb-4">
                                    <Checkbox id="add-free-plan-checkbox" checked={addOfflinePlan} onClick={() => setAddOfflinePlan(prev => !prev)} />
                                    <label
                                        htmlFor="add-free-plan-checkbox"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Add offline plan access
                                    </label>
                                </div>

                                {addOfflinePlan
                                    &&
                                    <>
                                        {
                                            loadingPlans
                                                ?
                                                <div className='grid gap-4 pb-4'>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Skeleton className='w-20 h-4 ml-auto' />
                                                        <Skeleton className='col-span-3 w-[100%] h-10' />
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Skeleton className='w-20 h-4 ml-auto' />
                                                        <Skeleton className='col-span-3 w-[100%] h-10' />
                                                    </div>
                                                </div>

                                                :
                                                <div className='grid gap-4 pb-4'>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="plan-select" className="text-right">
                                                            Plan
                                                        </Label>
                                                        <Popover open={plansCombobox} onOpenChange={setPlansCombobox}>
                                                            <PopoverTrigger asChild className='w-[100%]'>
                                                                <Button
                                                                    id="plan-select"
                                                                    variant="outline"
                                                                    role="combobox"
                                                                    aria-expanded={plansCombobox}
                                                                    className="w-[100%] justify-between col-span-3"
                                                                >
                                                                    {selectedPlan
                                                                        ? selectedPlan.toUpperCase()
                                                                        : "Select plan..."
                                                                    }
                                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                                </Button>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-[100%] p-0">
                                                                <Command>
                                                                    <CommandInput placeholder="Search plan..." />
                                                                    <CommandEmpty>No plan found.</CommandEmpty>
                                                                    <CommandGroup>
                                                                        {plans.map((plan: any, i: number) => (
                                                                            <CommandItem
                                                                                key={i}
                                                                                value={plan}
                                                                                onSelect={(currentValue) => {
                                                                                    setSelectedPlan(currentValue === selectedPlan ? "" : currentValue.toUpperCase())
                                                                                    setPlansCombobox(false)
                                                                                }}
                                                                            >
                                                                                <Check
                                                                                    className={cn(
                                                                                        "mr-2 h-4 w-4",
                                                                                        selectedPlan.toLowerCase() === plan.toLowerCase() ? "opacity-100" : "opacity-0"
                                                                                    )}
                                                                                />
                                                                                {plan}
                                                                            </CommandItem>
                                                                        ))}
                                                                    </CommandGroup>
                                                                </Command>
                                                            </PopoverContent>
                                                        </Popover>
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="exp-date" className="text-right">
                                                            Ends on
                                                        </Label>
                                                        <div className='col-span-3'>
                                                            <DateTimePicker
                                                                date={offlinePlanExpirationDate || new Date()}
                                                                setDate={handleDateChange}
                                                            // disabled={transferType === "OUT" && (selectedItem === null || selectedLocation === null || currentStock.quantity === 0)}
                                                            />
                                                        </div>
                                                    </div>

                                                </div>
                                        }
                                    </>
                                }
                            </div> */}

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
                            <Button type='submit' className='gap-2' disabled={creatingNewUser}>
                                Create
                                {creatingNewUser
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

export default CreateUserDialog