import { useEffect, useState } from 'react'
import AuthenticatedUsersLayout from '../layouts/AuthenticatedUsersLayout'
import ProtectedAxios from '@/api/protectedAxios'
import { toast } from '@/components/ui/use-toast'
import { InventoryReport } from '@/utils/types'
import { InventoryReportDataTable } from '@/components/inventoryReport/InventoryReportDataTable'
import { inventoryReportColumns } from '@/components/inventoryReport/inventoryReportColumns'

const InventoryReport = () => {
  const [data, setData] = useState<InventoryReport[]>([])
  const [fetchingData, setFetchingData] = useState(true)

  const getReportData = () => {
    setFetchingData(true)
    ProtectedAxios.get("/api/common/reports/inventory")
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
        <h1 className='text-2xl font-medium'>Inventory Report</h1>
      </div>
      <div>
        <InventoryReportDataTable columns={inventoryReportColumns} data={data} loadingState={fetchingData} />
      </div>
    </AuthenticatedUsersLayout>
  )
}

export default InventoryReport