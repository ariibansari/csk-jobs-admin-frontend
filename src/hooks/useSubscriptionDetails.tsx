import { useContext, useEffect, useState } from 'react'
import ProtectedAxios from '../api/protectedAxios'
import { UserContext } from '../context/UserProvider'

const useSubscriptionDetails = () => {
    const { user } = useContext(UserContext)
    const [subscriptionDetails, setSubscriptionDetails] = useState(null)
    const [loadingSubscriptionDetails, setLoadingSubscriptionDetails] = useState(true)

    useEffect(() => {
        if (user.customer_id) {
            fetchSubscriptionDetails()
        } else {
            setLoadingSubscriptionDetails(false)
        }
    }, [user])

    const fetchSubscriptionDetails = () => {
        setLoadingSubscriptionDetails(true)
        ProtectedAxios.get(`/api/stripe/subscribedPlanDetails/${user.customer_id}`)
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