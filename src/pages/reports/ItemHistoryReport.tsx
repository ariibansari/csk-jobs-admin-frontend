import { useEffect, useState } from 'react'
import AuthenticatedUsersLayout from '../layouts/AuthenticatedUsersLayout'
import ProtectedAxios from '@/api/protectedAxios'
import { toast } from '@/components/ui/use-toast'
import { ItemReport } from '@/utils/types'
import { ItemHistoryReportDataTable } from '@/components/itemHistoryReport/ItemHistoryReportDataTable'
import { itemHistoryReportColumns } from '@/components/itemHistoryReport/itemHistoryReportColumns'
import { addDays, format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"


const ItemHistoryReport = () => {
    const [data, setData] = useState<ItemReport[]>([])
    const [date, setDate] = useState<Date>()
    const [searchText, setSearchText] = useState("")
    const [fetchingData, setFetchingData] = useState(true)
    const [datePopoverState, setDatePopoverState] = useState(false)

    const getReportData = (_date?: Date | undefined) => {
        setFetchingData(true)
        let dateValue = undefined
        if (_date) {
            dateValue = addDays(_date, 1)
        }
        else {
            if (date) {
                dateValue = addDays(date, 1)
            }
        }
        ProtectedAxios.post(`/api/common/reports/itemHistory`, { searchText, date: dateValue })
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
            <div className='flex justify-between relative'>
                <h1 className='text-2xl font-medium'>Item History Report</h1>
                <div className='absolute right-0 -bottom-14'>
                    <Popover open={datePopoverState} onOpenChange={setDatePopoverState}>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-[280px] justify-start text-left font-normal",
                                    !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={e => { setDate(e); getReportData(e); setDatePopoverState(false) }}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
            <div>
                <ItemHistoryReportDataTable columns={itemHistoryReportColumns} data={data} loadingState={fetchingData} />
            </div>
        </AuthenticatedUsersLayout>
    )
}

export default ItemHistoryReport