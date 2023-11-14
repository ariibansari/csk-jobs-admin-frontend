import { useContext, useEffect, useState } from "react"
import { StockTransfer } from "@/utils/types"
import ProtectedAxios from "@/api/protectedAxios"
import { toast } from "@/components/ui/use-toast"
import { EventContext } from "@/context/EventProvider"
import { UserContext } from "@/context/UserProvider"
import AuthenticatedUsersLayout from "../layouts/AuthenticatedUsersLayout"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { DatePickerWithRange } from "@/components/ui/datePickerWithRange"
import { DateRange } from "react-day-picker"
import { addDays } from "date-fns"
import { Input } from "@/components/ui/input"
import { StockMovementReportDataTable } from "@/components/stockMovementReport/StockMovementReportDataTable"
import { stockMovementReportColumns } from "@/components/stockMovementReport/stockMovementReportColumns"


const StockMovementReport = () => {
  const [stockMovements, setStockMovements] = useState<StockTransfer[]>([])
  const [fetchingStockMovements, setFetchingStockMovements] = useState(false)


  const [dateFilterDropdownState, setDateFilterDropdownState] = useState(false)
  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  })
  const [dateFilterError, setDateFilterError] = useState("")
  const [dateFilterApplied, setDateFilterApplied] = useState(false)
  const [searchText, setSearchText] = useState("")


  const getAllStockMovements = (text: string, date_from: Date | undefined, date_to: Date | undefined) => {
    setFetchingStockMovements(true)
    const mySearchText = text
    ProtectedAxios.post("/api/common/reports/stockMovement", { searchText: mySearchText, dateFrom: date_from, dateTo: date_to })
      .then(res => {
        if (res.data) {
          setStockMovements(res.data)
          setFetchingStockMovements(false)
        }
      })
      .catch((error: any) => {
        setFetchingStockMovements(false)

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
    getAllStockMovements(searchText, date?.from, date?.to)
  }, [])



  const applySearchFilter = (text: string) => {
    setSearchText(text)
    setTimeout(() => {
      if (date && date.from && date.to) {
        let from = date.from
        let to = date.to
        getAllStockMovements(text, from, addDays(to, 1))
      }
      else {
        getAllStockMovements(text, undefined, undefined)
      }
    }, 500)
  }

  const applyDateRangeFilter = () => {
    setDateFilterError("")

    if (date && (date.from === undefined || date.to === undefined)) {
      setDateFilterError("Please choose a start and end date to continue")
      return
    }

    if (date && date.from && date.to) {
      const date_from = date.from
      const date_to = addDays(date.to, 1)

      setDateFilterDropdownState(false)
      setDateFilterApplied(true)

      getAllStockMovements(searchText, date_from, date_to)
    }
  }

  const clearDateRangeFilter = () => {
    setDate({
      from: undefined,
      to: undefined
    })
    setDateFilterApplied(false)
    setDateFilterDropdownState(false)
    getAllStockMovements(searchText, undefined, undefined)

  }


  return (
    <AuthenticatedUsersLayout>
      <div className='flex justify-between'>
        <h1 className='text-2xl font-medium'>Stock Movement Report</h1>
      </div>

      <div className="flex mt-10 mb-5 gap-2">
        <Input className="w-[428px]" placeholder="search item" value={searchText} onChange={e => applySearchFilter(e.target.value)} />
        <div className="relative z-10">
          <DropdownMenu open={dateFilterDropdownState} onOpenChange={setDateFilterDropdownState}>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="icon" className="relative">
                <Filter className="w-5" />
                {dateFilterApplied
                  &&
                  <span className="absolute bg-red-700 w-2 h-2 rounded-full top-2 right-2" />
                }
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="border bg-background rounded-md p-3 w-[22rem]">
              <DropdownMenuLabel>Filter by date range</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="flex flex-col gap-2 my-4 px-3">
                <div className="">
                  <DatePickerWithRange date={date} setDate={setDate} />
                  {dateFilterError.length > 0
                    &&
                    <p className="text-sm px-2 pt-2 text-destructive">{dateFilterError}</p>
                  }
                </div>
                <div className="flex justify-between mt-4">
                  <Button variant="outline" onClick={clearDateRangeFilter}>Clear</Button>
                  <Button size="sm" onClick={applyDateRangeFilter}>Apply</Button>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <StockMovementReportDataTable columns={stockMovementReportColumns} data={stockMovements} loadingState={fetchingStockMovements} />

    </AuthenticatedUsersLayout>
  )
}

export default StockMovementReport