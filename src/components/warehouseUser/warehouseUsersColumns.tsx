import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "../ui/badge"
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
import EventEmitter from "../../utils/EventEmitter"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type WarehouseUser = {
  user_id: number,
  name: string,
  username: string,
  email: string,
  isBlocked: boolean
}

export const warehouseUsersColumns: ColumnDef<WarehouseUser>[] = [
  {
    accessorKey: "user_id",
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
    accessorKey: "username",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="hover:bg-transparent p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Username
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "isBlocked",
    header: "Access",
    cell: ({ row }) => {
      const isBlocked = row.getValue("isBlocked")
      return <Badge variant={isBlocked ? "destructive" : "secondary"}>{isBlocked ? "Blocked" : "Active"}</Badge>
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original

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
                  payload={{ user_id: user.user_id, name: user.name, username: user.username, email: user.email, password: "", isBlocked: user.isBlocked }}
                  eventName="EDIT_WAREHOUSE_USER"
                  emitOnClick={true}
                  emitButtonText="Edit"
                  emitButtonClasses="w-[100%] px-2 py-1 rounded-sm"
                />
              </DropdownMenuItem>
              <DropdownMenuItem disabled>{user.isBlocked ? "Unblock" : "Block"}</DropdownMenuItem>
              <DropdownMenuItem className="p-0">
                <EventEmitter
                  payload={{ user_id: user.user_id, name: user.name, username: user.username, email: user.email, password: "", isBlocked: user.isBlocked }}
                  eventName="DELETE_WAREHOUSE_USER"
                  emitOnClick={true}
                  emitButtonText="Delete"
                  emitButtonClasses="w-[100%] px-2 py-1 rounded-sm"
                />
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
