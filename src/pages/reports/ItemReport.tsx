import { useEffect, useState } from 'react'
import AuthenticatedUsersLayout from '../layouts/AuthenticatedUsersLayout'
import ProtectedAxios from '@/api/protectedAxios'
import { toast } from '@/components/ui/use-toast'
import { ItemReportDataTable } from '@/components/itemReport/ItemReportDataTable'
import { itemReportColumns } from '@/components/itemReport/itemReportColumns'
import { ItemReport } from '@/utils/types'

const ItemReport = () => {
    const [data, setData] = useState<ItemReport[]>([])
    const [fetchingData, setFetchingData] = useState(true)

    const getReportData = () => {
        setFetchingData(true)
        ProtectedAxios.get("/api/common/reports/item")
            .then(res => {
                if (res.data) {
                    setData(res.data)
                    setFetchingData(false)
                }
            })
            .catch((error: any) => {
                setFetchingData(false)

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
        getReportData()
    }, [])

    return (
        <AuthenticatedUsersLayout>
            <div className='flex justify-between'>
                <h1 className='text-2xl font-medium'>Item Report</h1>
            </div>
            <div>
                <ItemReportDataTable columns={itemReportColumns} data={data} loadingState={fetchingData} />
            </div>
        </AuthenticatedUsersLayout>
    )
}

export default ItemReport