import { useContext, useEffect, useState } from 'react'
import ProtectedAxios from '../api/protectedAxios'
import { UserContext } from '../context/UserProvider'

export type SubscriptionDetails = {
    plan: string,
    offline_plan_access: string,
    offline_plan_access_expires_at?: string,
    plan_renews_on?: string,
}
const useSubscriptionDetails = () => {
    const { user } = useContext(UserContext)
    const [subscriptionDetails, setSubscriptionDetails] = useState(null)
    const [loadingSubscriptionDetails, setLoadingSubscriptionDetails] = useState(true)

    useEffect(() => {
        if (user.customer_id && user.role === "USER") {
            fetchSubscriptionDetails()
        } else {
            setLoadingSubscriptionDetails(false)
        }
    }, [user])

    const fetchSubscriptionDetails = () => {
        setLoadingSubscriptionDetails(true)
        ProtectedAxios.get(`/api/subscription/subscribedPlanDetails/${user.user_id}`)
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

    const refreshSubscriptionDetails = () => {
        fetchSubscriptionDetails()
    }

    return [subscriptionDetails, loadingSubscriptionDetails, refreshSubscriptionDetails]
}

export default useSubscriptionDetails