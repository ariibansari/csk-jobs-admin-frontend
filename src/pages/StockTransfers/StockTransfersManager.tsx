import { useContext, useEffect, useState } from "react"
import { StockTransfer } from "@/utils/types"
import ProtectedAxios from "@/api/protectedAxios"
import { toast } from "@/components/ui/use-toast"
import { EventContext } from "@/context/EventProvider"
import AuthenticatedUsersLayout from "../layouts/AuthenticatedUsersLayout"
import { NavLink } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { StockTransfersDataTable } from "@/components/stockTransfers/StockTransfersDataTable"
import { stockTransfersColumns } from "@/components/stockTransfers/stockTransfersColumns"
import DeleteStockTransfersDialog from "@/components/stockTransfers/DeleteStockTransfersDialog"
import { Filter, TrendingDown, TrendingUp } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { DatePickerWithRange } from "@/components/ui/datePickerWithRange"
import { DateRange } from "react-day-picker"
import { addDays } from "date-fns"
import { Input } from "@/components/ui/input"


const StockTransferManager = () => {
  const { event, setEvent } = useContext(EventContext)

  const [stockTransfers, setStockTransfers] = useState<StockTransfer[]>([])
  const [fetchingStockTransfers, setFetchingStockTransfers] = useState(false)

  const [selectedStockTransferData, setSelectedStockTransferData] = useState<StockTransfer>({ quantity: 0, transferred_at: "", transferred_by: 0, item_id: 0, unit_id: 0, location_id: 0, transfer_type: "IN" })
  const [deleteStockTransferDialogState, setDeleteStockTransferDialogState] = useState(false)

  const [dateFilterDropdownState, setDateFilterDropdownState] = useState(false)
  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  })
  const [dateFilterError, setDateFilterError] = useState("")
  const [dateFilterApplied, setDateFilterApplied] = useState(false)
  const [searchText, setSearchText] = useState("")


  const getAllStockTransfers = (text: string, date_from: Date | undefined, date_to: Date | undefined) => {
    setFetchingStockTransfers(true)
    const mySearchText = text
    ProtectedAxios.post("/api/common/stockTransfers", { searchText: mySearchText, dateFrom: date_from, dateTo: date_to })
      .then(res => {
        if (res.data) {
          setStockTransfers(res.data)
          setFetchingStockTransfers(false)
        }
      })
      .catch((error: any) => {
        setFetchingStockTransfers(false)

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
    getAllStockTransfers(searchText, date?.from, date?.to)
  }, [])



  useEffect(() => {
    if (event.eventName === "DELETE_STOCK_TRANSFER") {
      const data: any = event.payload
      setSelectedStockTransferData({ stock_transfer_id: data.stock_transfer_id, quantity: data.quantity, transferred_at: data.transferred_at, transferred_by: data.transferred_by, transferred_by_username: data.transferred_by_username, item_id: data.item_id, item_name: data.item_name, unit_id: data.unit_id, unit: data.unit, location_id: data.location_id, location: data.location, transfer_type: data.transfer_type })
      setDeleteStockTransferDialogState(true)

      //reset the event
      setEvent({ eventName: "INITIAL_EVENT", payload: {} })
    }
  }, [event])



  const applySearchFilter = (text: string) => {
    setSearchText(text)
    setTimeout(() => {
      if (date && date.from && date.to) {
        let from = date.from
        let to = date.to
        getAllStockTransfers(text, from, addDays(to, 1))
      }
      else {
        getAllStockTransfers(text, undefined, undefined)
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

      getAllStockTransfers(searchText, date_from, date_to)
    }
  }

  const clearDateRangeFilter = () => {
    setDate({
      from: undefined,
      to: undefined
    })
    setDateFilterApplied(false)
    setDateFilterDropdownState(false)
    getAllStockTransfers(searchText, undefined, undefined)

  }


  return (
    <AuthenticatedUsersLayout>
      <div className='flex justify-between'>
        <h1 className='text-2xl font-medium'>Manage Stock Transfers</h1>

        <div className="flex gap-4">
          <NavLink to="/stock-transfer/stock-in"><Button className="gap-2">Stock In <TrendingDown className="rotate-[110deg] w-4 h-4 text-green-500" /></Button></NavLink>
          <NavLink to="/stock-transfer/stock-out"><Button className="gap-2" variant="outline">Stock Out <TrendingUp className="w-5 h-5 text-destructive/70 rotate-[-10deg]" /></Button></NavLink>
        </div>
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

      <StockTransfersDataTable columns={stockTransfersColumns} data={stockTransfers} loadingState={fetchingStockTransfers} />

      <DeleteStockTransfersDialog
        stockTransfer={selectedStockTransferData}
        functionToExecuteAfterDeletingStockTransfer={(deleted_stock_transfer: StockTransfer) => {
          setStockTransfers(prev => {
            let updatedStocktransfers = prev.filter(stockTransfer => stockTransfer.stock_transfer_id !== deleted_stock_transfer.stock_transfer_id)
            return updatedStocktransfers
          })
        }}
        dialogState={deleteStockTransferDialogState}
        dialogStateSetter={setDeleteStockTransferDialogState}
      />

    </AuthenticatedUsersLayout>
  )
}

export default StockTransferManager