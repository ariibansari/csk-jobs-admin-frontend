import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import { InventoryReport, ItemReport } from "@/utils/types"


export const inventoryReportColumns: ColumnDef<InventoryReport>[] = [
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
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "item_description",
    header: "Description",
  },
  {
    accessorKey: "hs_code",
    header: "HS Code",
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
]