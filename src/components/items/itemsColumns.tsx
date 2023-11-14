import { ColumnDef } from "@tanstack/react-table"
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
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import EventEmitter from "@/utils/EventEmitter"
import { Item } from "@/utils/types"
import { useContext } from "react"
import { UserContext } from "@/context/UserProvider"


export const itemsColumns: ColumnDef<Item>[] = [
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
    accessorKey: "unit",
    header: "Unit",
  },
  {
    accessorKey: "item_description",
    header: "Description",
  },
  {
    accessorKey: "lot_number",
    header: "Lot No",
  },
  {
    accessorKey: "hs_code",
    header: "HS Code",
  },
  {
    accessorKey: "item_value",
    header: "Value",
  },
  {
    accessorKey: "customer_name",
    header: "Customer",
  },
  {
    accessorKey: "customer_permit_number",
    header: "Permit No",
  },
  {
    accessorKey: "username",
    header: "Creator",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const item = row.original
      const { user } = useContext(UserContext)
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
                  payload={{ ...item }}
                  eventName="EDIT_ITEM"
                  emitOnClick={true}
                  emitButtonText="Edit"
                  emitButtonClasses="w-[100%] px-2 py-1 rounded-sm"
                />
              </DropdownMenuItem>
              {user.role === "ADMIN"
                &&
                <DropdownMenuItem className="p-0">
                  <EventEmitter
                    payload={{ ...item }}
                    eventName="DELETE_ITEM"
                    emitOnClick={true}
                    emitButtonText="Delete"
                    emitButtonClasses="w-[100%] px-2 py-1 rounded-sm"
                  />
                </DropdownMenuItem>
              }
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
