import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import { ItemReport } from "@/utils/types"


export const itemReportColumns: ColumnDef<ItemReport>[] = [
  {
    accessorKey: "item_id",
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
    accessorKey: "item_name",
    header: "Item Name",
  },
  {
    accessorKey: "hs_code",
    header: "HS Code",
  },
  {
    accessorKey: "item_value",
    header: "Value",
    cell: ({ row }) => {
      return row.original.item_value.toLocaleString()
    }
  },
  {
    accessorKey: "unit",
    header: "Unit",
  },
  {
    accessorKey: "remarks",
    header: "Remarks",
  },
  {
    accessorKey: "quantity_by_location",
    header: "Quantity",
    cell: ({ row }) => {
      const items = row.original
      let data = ''
      Object.entries(items.quantity_by_location).forEach(([location, quantity]) => {
        data = `${data}${location}: ${quantity}\n`;
      });

      return <span style={{ wordWrap: "break-word", whiteSpace: "pre-wrap" }}>{data}</span>
    }
  },
  {
    accessorKey: "total_quantity",
    header: "Total Quantity",
  },
]
