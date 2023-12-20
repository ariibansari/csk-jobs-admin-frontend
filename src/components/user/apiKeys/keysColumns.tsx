import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
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
import { ArrowUpDown, Clipboard, ClipboardCheck, MoreHorizontal } from "lucide-react"
import EventEmitter from "@/utils/EventEmitter"
import { ApiKey } from "@/utils/types"
import { useContext, useEffect, useState } from "react"
import ProtectedAxios from "@/api/protectedAxios"
import { CgSpinner } from "react-icons/cg"
import { format } from "date-fns"
import { toast } from "@/components/ui/use-toast"
import { EventContext } from "@/context/EventProvider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"


export const keysColumns: ColumnDef<ApiKey>[] = [
  {
    accessorKey: "api_key_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="hover:bg-transparent p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "api_key",
    header: "API Key",
    cell: ({ row }) => {
      const { api_key } = row.original
      const [copied, setCopied] = useState(false)
      useEffect(() => {
        if (copied) {
          setTimeout(() => {
            setCopied(false)
          }, 2000)
        }
      }, [copied])

      return <div className="flex items-center gap-2">
        {api_key.substring(0, 5) + "........" + api_key.substring(api_key.length - 5, api_key.length)}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(api_key);
                  setCopied(true)
                }}
                size="icon"
                className="w-8 h-8 p-2"
                variant="ghost"
              >
                {copied
                  ? <ClipboardCheck />
                  : <Clipboard />
                }
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{copied ? "copied" : "copy"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    }
  },
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ row }) => {
      const created_at_date = row.original.created_at
      if (created_at_date) {
        return format(new Date(created_at_date), "MMM dd, yyyy")
      }
    }
  },
  {
    accessorKey: "last_used",
    header: "Last Used",
    cell: ({ row }) => {
      const last_used_date = row.original.last_used
      if (last_used_date) {
        return format(last_used_date, "dd/MM/yyyy")
      } else {
        return "Never"
      }
    }
  },
  {
    accessorKey: "active",
    header: "Status",
    cell: ({ row }) => {
      const active = row.getValue("active")
      return <Badge variant={!active ? "destructive" : "secondary"}>{!active ? "Disabled" : "Active"}</Badge>
    }
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const key = row.original
      const { setEvent } = useContext(EventContext)
      const [togglingStatus, setTogglingStatus] = useState(false)

      const toggleKeyStatus = () => {
        setTogglingStatus(true)
        ProtectedAxios.post("/api/user/apiKey/toggleStatus", { api_key_id: key.api_key_id })
          .then(res => {
            if (res.data) {
              setEvent({ eventName: "TOGGLE_KEY_STATUS", payload: { api_key_id: key.api_key_id, updated_status: res.data.updated_status } })
              setTogglingStatus(false)
            }
          })
          .catch((error: any) => {
            setTogglingStatus(false)

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
                  payload={{ ...key }}
                  eventName="EDIT_KEY"
                  emitOnClick={true}
                  emitButtonText="Edit"
                  emitButtonClasses="w-[100%] px-2 py-1 rounded-sm"
                />
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toggleKeyStatus()} className="flex items-center gap-2">
                {key.active ? "Disable" : "Enable"}
                {togglingStatus
                  &&
                  <CgSpinner className="animate-spin text-xl" />
                }
              </DropdownMenuItem>
              <DropdownMenuItem className="p-0">
                <EventEmitter
                  payload={{ ...key }}
                  eventName="DELETE_KEY"
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
