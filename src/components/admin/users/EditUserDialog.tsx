import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
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
import { Check, ChevronsUpDown, Eye, EyeOff, X } from 'lucide-react'
import ProtectedAxios from '@/api/protectedAxios'
import { Label } from '@/components/ui/label'
import { User } from '@/utils/types'
import { toast } from '@/components/ui/use-toast'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { cn } from '@/lib/utils'
import { DateTimePicker } from '@/components/ui/dateTimePicker'
import { addMonths } from 'date-fns'
import { SubscriptionDetails } from '@/hooks/useSubscriptionDetails'

const EditUserDialog = ({ selectedUser, functionToExecuteAfterUpdatingUser, toggleButton, dialogState, dialogStateSetter }: { selectedUser: User, functionToExecuteAfterUpdatingUser: Function, toggleButton?: React.ReactElement, dialogState: boolean, dialogStateSetter: Dispatch<SetStateAction<boolean>> }) => {
    const [selectedUserData, setSelectedUserData] = useState<User>(selectedUser)

    const [updatingUser, setUpdatingUser] = useState(false)
    const [error, setError] = useState("")

    const [password, setPassword] = useState("")
    const [viewingPassword, setViewingPassword] = useState(false)

    const [loadingSubscriptionDetails, setLoadingSubscriptionDetails] = useState(false)
    const [subscriptionDetails, setSubscriptionDetails] = useState<SubscriptionDetails | null>(null)

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
        if (dialogState) {
            fetchSubscriptionDetails()

            setSelectedUserData(selectedUser)

            if (selectedUser.offline_plan) {
                setAddOfflinePlan(true)
                setSelectedPlan(selectedUser.offline_plan)
                if (selectedUser.offline_plan_access_expires_at) {
                    setOfflinePlanExpirationDate(new Date(selectedUser.offline_plan_access_expires_at))
                }
            }
        }

        return () => { setAddOfflinePlan(false); setSelectedPlan(""); setOfflinePlanExpirationDate(null) }
    }, [selectedUser])

    useEffect(() => {
        fetchPlans()
    }, [])

    const fetchSubscriptionDetails = () => {
        setLoadingSubscriptionDetails(true)
        ProtectedAxios.get(`/api/subscription/subscribedPlanDetails/${selectedUser.user_id}`)
            .then(res => {
                setSubscriptionDetails(res.data)
                setLoadingSubscriptionDetails(false)
            })
            .catch(err => {
                console.log(err);
                setLoadingSubscriptionDetails(false)
                if (err.response.status === 500) {
                    alert(err.response.data.error)
                }
            })
    }

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

    const updateUser = (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (addOfflinePlan && !selectedPlan) {
            setError("Select a plan to continue")
            return
        }

        setUpdatingUser(true)

        ProtectedAxios.post("/api/admin/updateUser", { ...selectedUserData, password, addOfflinePlan, selectedPlan, offlinePlanExpirationDate })
            .then(res => {
                if (res.data) {
                    functionToExecuteAfterUpdatingUser(res.data.updated_user_data)

                    toast({
                        variant: "success",
                        title: res.data.message
                    })

                    dialogStateSetter(false)
                    setUpdatingUser(false)

                }
            })
            .catch((error: any) => {
                setUpdatingUser(false)
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
                        <DialogTitle>Edit Warehouse User</DialogTitle>
                        <DialogDescription>
                            Update the details and click on save button to update the user
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={updateUser}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                    Name
                                </Label>
                                <Input required type='text' id="name" className="col-span-3" value={selectedUserData.name} onChange={e => { setError(""); setSelectedUserData({ ...selectedUserData, name: e.target.value }) }} />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="company_name" className="text-right">
                                    Company
                                </Label>
                                <Input type='text' id="company_name" className="col-span-3" value={selectedUserData.companyName} onChange={e => { setError(""); setSelectedUserData({ ...selectedUserData, companyName: e.target.value }) }} />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="password" className="text-right">
                                    Password
                                </Label>
                                <div className='relative col-span-3'>
                                    <Input type={viewingPassword ? 'text' : 'password'} placeholder='set new password' className='pr-10' id="password" value={password} onChange={e => { setError(""); setPassword(e.target.value) }} />
                                    <Button type="button" variant="ghost" className='absolute right-2 top-[50%] translate-y-[-50%] p-1 hover:bg-transparent' onClick={() => setViewingPassword(prev => !prev)}>
                                        {viewingPassword
                                            ? <Eye className='w-5' />
                                            : <EyeOff className='w-5' />
                                        }
                                    </Button>
                                </div>
                            </div>

                            <hr />

                            {loadingSubscriptionDetails
                                ?
                                <div className="flex items-center gap-4 mr-4">
                                    <Skeleton className='w-7 h-7 ml-auto' />
                                    <Skeleton className='col-span-3 w-[100%] h-2' />
                                </div>

                                :
                                <>
                                    {(subscriptionDetails === null || subscriptionDetails.offline_plan_access)
                                        ?
                                        <>
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
                                            </div>
                                        </>

                                        :
                                        <div className=' mb-4'>
                                            <div className="flex items-center space-x-2 opacity-50">
                                                <Checkbox disabled id="add-free-plan-checkbox" checked={addOfflinePlan} onClick={() => setAddOfflinePlan(prev => !prev)} />
                                                <label
                                                    htmlFor="add-free-plan-checkbox"
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    Add offline plan access
                                                </label>
                                            </div>
                                            <p className='text-sm mt-2 text-muted-foreground'>User already on active subscription can't add offline plan access</p>
                                        </div>
                                    }
                                </>
                            }

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
                            <Button type='submit' className='gap-2' disabled={updatingUser}>
                                Update
                                {updatingUser
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

export default EditUserDialog