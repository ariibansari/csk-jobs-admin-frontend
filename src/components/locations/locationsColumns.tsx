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
import { Location } from "@/utils/types"
import { useContext } from "react"
import { UserContext } from "@/context/UserProvider"


export const locationsColumns: ColumnDef<Location>[] = [
  {
    accessorKey: "location_id",
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
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "username",
    header: "Creator",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const location = row.original
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
                  payload={{ ...location }}
                  eventName="EDIT_LOCATION"
                  emitOnClick={true}
                  emitButtonText="Edit"
                  emitButtonClasses="w-[100%] px-2 py-1 rounded-sm"
                />
              </DropdownMenuItem>
              {user.role === "ADMIN"
                &&
                <DropdownMenuItem className="p-0">
                  <EventEmitter
                    payload={{ ...location }}
                    eventName="DELETE_LOCATION"
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
