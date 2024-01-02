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
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import EventEmitter from "@/utils/EventEmitter"
import { User } from "@/utils/types"
import { useEffect, useState } from "react"
import { SubscriptionDetails } from "@/hooks/useSubscriptionDetails"
import ProtectedAxios from "@/api/protectedAxios"
import { CgSpinner } from "react-icons/cg"
import OfflinePlanBadge from "@/components/ui/offlinePlanBadge"
import { format } from "date-fns"


export const usersColumns: ColumnDef<User>[] = [
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
    accessorKey: "email",
    header: "Email",
  },
  // {
  //   id: "Plan",
  //   header: "Plan",
  //   cell: ({ row }) => {
  //     const user = row.original
  //     const [loadingSubscriptionDetails, setLoadingSubscriptionDetails] = useState(false)
  //     const [subscriptionDetails, setSubscriptionDetails] = useState<SubscriptionDetails | null>(null)
  //     useEffect(() => {
  //       fetchSubscriptionDetails()
  //     }, [row])

  //     const fetchSubscriptionDetails = () => {
  //       setLoadingSubscriptionDetails(true)
  //       ProtectedAxios.get(`/api/subscription/subscribedPlanDetails/${user.user_id}`)
  //         .then(res => {
  //           setSubscriptionDetails(res.data)
  //           setLoadingSubscriptionDetails(false)
  //         })
  //         .catch(err => {
  //           console.log(err);
  //           setLoadingSubscriptionDetails(false)
  //           if (err.response.status === 500) {
  //             alert(err.response.data.error)
  //           }
  //         })
  //     }

  //     return (
  //       <>
  //         {loadingSubscriptionDetails
  //           ? <CgSpinner className="animate-spin text-xl" />

  //           :
  //           subscriptionDetails
  //             ?
  //             // Have an admin-created subscription access
  //             subscriptionDetails.offline_plan_access
  //               ?
  //               <p className='flex flex-col items-start gap-2'>
  //                 {subscriptionDetails.plan}
  //                 <OfflinePlanBadge />
  //                 {subscriptionDetails.offline_plan_access_expires_at !== undefined
  //                   &&
  //                   <span className="text-muted-foreground">Ends on: {format(new Date(subscriptionDetails.offline_plan_access_expires_at), "dd/MM/yyyy p")}</span>
  //                 }
  //               </p>

  //               :
  //               // Have an actual subscription
  //               <p className='flex items-center gap-2'>{subscriptionDetails.plan}</p>

  //             :
  //             // Have no active subscription
  //             <p className='text-red-500'>No Plan</p>
  //         }
  //       </>
  //     )
  //   }
  // },
  {
    accessorKey: "Chats",
    header: "Chats",
    cell: ({row}) => {
      return row.original.Chats?.length
    }
  },
  {
    accessorKey: "Messages",
    header: "Messages",
    cell: ({row}) => {
      return row.original.Messages?.length
    }
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
    header: "Actions",
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
                  // payload={{ user_id: user.user_id, name: user.name, email: user.email, password: "", isBlocked: user.isBlocked, companyName: user.companyName }}
                  payload={{ ...user }}
                  eventName="EDIT_USER"
                  emitOnClick={true}
                  emitButtonText="Edit"
                  emitButtonClasses="w-[100%] px-2 py-1 rounded-sm"
                />
              </DropdownMenuItem>
              <DropdownMenuItem disabled>{user.isBlocked ? "Unblock" : "Block"}</DropdownMenuItem>
              <DropdownMenuItem className="p-0">
                <EventEmitter
                  payload={{ ...user }}
                  eventName="DELETE_USER"
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
