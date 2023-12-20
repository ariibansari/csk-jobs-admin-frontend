import { useContext, useEffect, useState } from "react"
import AuthenticatedUsersLayout from "../layouts/AuthenticatedUsersLayout"
import Axios from "@/api/axios"
import { toast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { UserContext } from "@/context/UserProvider"
import { CgSpinner } from "react-icons/cg"
import ProtectedAxios from "@/api/protectedAxios"

const SubscriptionList = () => {
    const { user } = useContext(UserContext)
    const [plans, setPlans] = useState([])
    const [loading, setLoading] = useState(true)

    const [selectedPrice, setSelectedPrice] = useState("")
    const [creatingCheckoutSession, setCreatingCheckoutSession] = useState(false)

    useEffect(() => {
        fetchPlans()
    }, [])

    const fetchPlans = () => {
        setLoading(true)
        Axios.get("/api/subscription/allSubscriptionPlans")
            .then(res => {
                if (res.data) {
                    setPlans(res.data)
                    setLoading(false)
                }
            })
            .catch(err => {
                setLoading(false)
                console.log(err);
                toast({
                    variant: "destructive",
                    title: "There was some issue getting the plans, please try again later"
                })
            })
    }

    const createCheckoutSession = (price_id: string) => {
        setCreatingCheckoutSession(true)
        ProtectedAxios.post("/api/subscription/createCheckoutSession", { price_id, customer_id: user.customer_id })
            .then(res => {
                if (res.data) {
                    window.location.href = res.data
                    setCreatingCheckoutSession(false)
                }
            })
            .catch(err => {
                setCreatingCheckoutSession(false)
                console.log(err);
                toast({
                    variant: "destructive",
                    title: "There was some issue in fetching the subscription, please try again later"
                })
            })

    }

    return (
        <AuthenticatedUsersLayout>
            <div className=''>
                <h1 className='text-2xl font-semibold'>Subscription List</h1>
                <p className="mt-2 text-muted-foreground">Select a plan to continue</p>
                <div className="flex flex-wrap my-10 justify-start">
                    {loading
                        ?
                        [1, 2, 3, 4].map(i => (
                            <Skeleton key={i} className="sm:w-[45%] m-[1rem] max-w-[90%] min-h-[15dvh] py-6 " />
                        ))

                        :
                        plans.map((plan: any, i) => (
                            <div key={i} className="sm:w-[45%] m-[1rem] max-w-[90%] min-h-[10dvh] py-6 rounded-md bg-clip-padding backdrop-filter backdrop-blur-3xl bg-opacity-20 border border-muted bg-gray-400">
                                <div className="h-[100%] flex justify-between items-center container gap-5">
                                    <div>
                                        <h3 className="text-lg font-medium">{plan?.metadata?.plan_name}</h3>
                                        <h4 className="text-sm font-medium">${plan.unit_amount / 100}/month</h4>
                                        <ul className="my-3">
                                            {JSON.parse(plan?.metadata?.offerings).map((data: any, i: number) => (
                                                <li key={i} className="text-sm my-1 grid grid-cols-8"><span><Check className="w-3 text-green-600" /></span><p className="col-span-7">{data.offering}</p></li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="flex gap-8">
                                        <span className="w-[1px] h-10 bg-gray-400 dark:bg-gray-700" />
                                        <Button
                                            className="gap-2"
                                            onClick={() => { setSelectedPrice(plan.id); createCheckoutSession(plan.id) }}
                                            disabled={creatingCheckoutSession}
                                        >
                                            Select Plan
                                            {creatingCheckoutSession && selectedPrice === plan.id
                                                &&
                                                <CgSpinner className="animate-spin text-xl" />
                                            }
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </AuthenticatedUsersLayout>
    )
}

export default SubscriptionList