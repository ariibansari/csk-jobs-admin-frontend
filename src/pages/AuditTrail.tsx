import { useEffect, useState } from "react"
import AuthenticatedUsersLayout from "./layouts/AuthenticatedUsersLayout"
import ProtectedAxios from "@/api/protectedAxios"
import { toast } from "@/components/ui/use-toast"
import { AuditTrailDataTable } from "@/components/auditTrail/AuditTrailDataTable"
import { auditTrailColumns } from "@/components/auditTrail/auditTrailColumns"

const AuditTrail = () => {
    const [auditTrails, setAuditTrails] = useState([])
    const [fetchingAuditTrails, setFetchingAuditTrails] = useState(true)

    const getAuditTrails = () => {
        setFetchingAuditTrails(true)
        ProtectedAxios.get("/api/admin/auditTrails")
            .then(res => {
                if (res.data) {
                    setAuditTrails(res.data)
                    setFetchingAuditTrails(false)
                }
            })
            .catch((error: any) => {
                setFetchingAuditTrails(false)
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
        getAuditTrails()
    }, [])


    return (
        <AuthenticatedUsersLayout>
            <div className='flex justify-between'>
                <h1 className='text-2xl font-medium'>Audit Trail</h1>
            </div>

            <AuditTrailDataTable data={auditTrails} columns={auditTrailColumns} loadingState={fetchingAuditTrails} />

        </AuthenticatedUsersLayout>
    )
}

export default AuditTrail