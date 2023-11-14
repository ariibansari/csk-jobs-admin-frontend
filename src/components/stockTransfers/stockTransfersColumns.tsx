import { Column, ColumnDef, FilterFn } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu"
import { ArrowDown, ArrowUp, ArrowUpDown, MoreHorizontal } from "lucide-react"
import EventEmitter from "@/utils/EventEmitter"
import { StockTransfer } from "@/utils/types"
import { useContext, useMemo, useState } from "react"
import { UserContext } from "@/context/UserProvider"
import { format } from "date-fns"

export const stockTransfersColumns: ColumnDef<StockTransfer>[] = [
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
          {transfer_type === "IN"
            ? <ArrowDown className="w-4 h-4 text-green-500" />
            : <ArrowUp className="w-4 h-4 text-destructive" />
          }
          {transfer_type}
        </div>
      )

    }
  },
  {
    accessorKey: "transferred_by_username",
    header: "Transferred By",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const stock_transfer = row.original
      const { user } = useContext(UserContext)

      if (user.role === "ADMIN") {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem className="p-0">
                  <EventEmitter
                    payload={{ ...stock_transfer }}
                    eventName="DELETE_STOCK_TRANSFER"
                    emitOnClick={true}
                    emitButtonText="Delete"
                    emitButtonClasses="w-[100%] px-2 py-1 rounded-sm"
                  />
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
    },
  },
]
