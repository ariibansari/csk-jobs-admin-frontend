import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import { StockTransfer } from "@/utils/types"
import { format } from "date-fns"

export const stockMovementReportColumns: ColumnDef<StockTransfer>[] = [
  {
    accessorKey: "stock_transfer_id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="hover:bg-transparent p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "transferred_at",
    header: "Date Time",
    cell: ({ row }) => {
      return format(new Date(row.original.transferred_at), "dd/MM/yyyy, p")
    },
    meta: {
      showFilter: true,
      filterType: "date_range"
    }
  },
  {
    accessorKey: "item_name",
    header: "Item",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "unit",
    header: "Unit",
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "transfer_type",
    header: "IN/OUT",
    cell: ({ row }) => {
      const { transfer_type } = row.original
      return (
        <div className="flex items-center gap-1">
          {transfer_type}
        </div>
      )

    }
  },
  {
    accessorKey: "transferred_by_username",
    header: "Transferred By",
  },
]
