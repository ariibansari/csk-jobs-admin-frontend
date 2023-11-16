import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import { AuditTrail } from "@/utils/types"
import { format } from "date-fns"


export const auditTrailColumns: ColumnDef<AuditTrail>[] = [
  {
    accessorKey: "audit_trail_id",
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
    accessorKey: "action",
    header: "Action",
  },
  {
    accessorKey: "performed_by",
    header: "Performed By",
    cell: ({ row }) => {
      return row.original.username
    }
  },
  {
    accessorKey: "timestamp",
    header: "Time",
    cell: ({ row }) => {
      return format(new Date(row.original.timestamp), "Pp")
    }
  },
  {
    accessorKey: "table_name",
    header: "Table",
  },
  {
    accessorKey: "data_before",
    header: "Before",
    cell: ({ row }) => {
      const auditTrail: any = { ...row.original }
      if (auditTrail.action === "ITEM_UPDATED") {
        return (
          <div className="flex flex-col gap-2 ">
            <div className="">Name: <span className="">{auditTrail.data_before?.name}</span></div>
            <div className="">Description: <span className="">{auditTrail.data_before?.item_description}</span></div>
            <div className="">Lot No: <span className="">{auditTrail.data_before?.lot_number}</span></div>
            <div className="">HS Code: <span className="">{auditTrail.data_before?.hs_code}</span></div>
            <div className="">Value: <span className="">{auditTrail.data_before?.item_value}</span></div>
            <div className="">Customer: <span className="">{auditTrail.data_before?.customer_name}</span></div>
            <div className="">Permit No: <span className="">{auditTrail.data_before?.customer_permit_number}</span></div>
          </div>
        )
      }
      if (auditTrail.action === "ITEM_DELETED" && auditTrail.status === "SUCCESS") {
        return (
          <div className="flex flex-col gap-2 ">
            <div className="">Name: <span className="">{auditTrail.data_before?.name}</span></div>
            <div className="">Description: <span className="">{auditTrail.data_before?.item_description}</span></div>
            <div className="">Lot No: <span className="">{auditTrail.data_before?.lot_number}</span></div>
            <div className="">HS Code: <span className="">{auditTrail.data_before?.hs_code}</span></div>
            <div className="">Value: <span className="">{auditTrail.data_before?.item_value}</span></div>
            <div className="">Customer: <span className="">{auditTrail.data_before?.customer_name}</span></div>
            <div className="">Permit No: <span className="">{auditTrail.data_before?.customer_permit_number}</span></div>
          </div>
        )
      }
      if (auditTrail.action === "UNIT_UPDATED") {
        return (
          <div className="flex flex-col gap-2 ">
            <div className="">Unit: <span className="">{auditTrail.data_before?.unit}</span></div>
          </div>
        )
      }
      if (auditTrail.action === "UNIT_DELETED" && auditTrail.status === "SUCCESS") {
        return (
          <div className="flex flex-col gap-2 ">
            <div className="">Unit: <span className="">{auditTrail.data_before?.unit}</span></div>
          </div>
        )
      }
      if (auditTrail.action === "LOCATION_UPDATED") {
        return (
          <div className="flex flex-col gap-2 ">
            <div className="">Location: <span className="">{auditTrail.data_before?.location}</span></div>
          </div>
        )
      }
      if (auditTrail.action === "LOCATION_DELETED" && auditTrail.status === "SUCCESS") {
        return (
          <div className="flex flex-col gap-2 ">
            <div className="">Location: <span className="">{auditTrail.data_before?.location}</span></div>
          </div>
        )
      }
      if (auditTrail.action === "STOCK_TRANSFER_DELETED") {
        return (
          <div className="flex flex-col gap-2 ">
            <div className="">Item: <span className="">{auditTrail.data_before?.item_ref?.name}</span></div>
            <div className="">Location: <span className="">{auditTrail.data_before?.location_ref?.location}</span></div>
            <div className="">Quantity: <span className="">{auditTrail.data_before?.quantity}</span></div>
            <div className="">Unit: <span className="">{auditTrail.data_before?.item_ref?.unit_ref?.unit}</span></div>
            <div className="">Type: <span className="">{auditTrail.data_before?.transfer_type}</span></div>
            <div className="">Created At: <span className="">{format(new Date(auditTrail.data_before?.created_at), "Pp")}</span></div>
            <div className="">Created By: <span className="">{auditTrail.data_before?.transferred_by_user_ref?.username}</span></div>
          </div>
        )
      }

      // DATA: {"item_id":17,"item_ref":{"name":"Item A","unit_ref":{"unit":"Count"}},"quantity":50,"created_at":"2023-11-16T12:22:34.783Z","location_id":19,"location_ref":{"location":"Warehouse ABC"},"transfer_type":"IN","transferred_at":"2023-11-16T12:22:25.174Z","transferred_by":16,"stock_transfer_id":36}


    }
  },
  {
    accessorKey: "data_after",
    header: "After",
    cell: ({ row }) => {
      const auditTrail: any = { ...row.original }
      if (auditTrail.action === "ITEM_CREATED") {
        return (
          <div className="flex flex-col gap-2 ">
            <div className="">Name: <span className="">{auditTrail.data_after?.name}</span></div>
            <div className="">Description: <span className="">{auditTrail.data_after?.item_description}</span></div>
            <div className="">Lot No: <span className="">{auditTrail.data_after?.lot_number}</span></div>
            <div className="">HS Code: <span className="">{auditTrail.data_after?.hs_code}</span></div>
            <div className="">Value: <span className="">{auditTrail.data_after?.item_value}</span></div>
            <div className="">Customer: <span className="">{auditTrail.data_after?.customer_name}</span></div>
            <div className="">Permit No: <span className="">{auditTrail.data_after?.customer_permit_number}</span></div>
          </div>
        )
      }
      if (auditTrail.action === "ITEM_UPDATED") {
        return (
          <div className="flex flex-col gap-2 ">
            <div className="">Name: <span className="">{auditTrail.data_after?.name}</span></div>
            <div className="">Description: <span className="">{auditTrail.data_after?.item_description}</span></div>
            <div className="">Lot No: <span className="">{auditTrail.data_after?.lot_number}</span></div>
            <div className="">HS Code: <span className="">{auditTrail.data_after?.hs_code}</span></div>
            <div className="">Value: <span className="">{auditTrail.data_after?.item_value}</span></div>
            <div className="">Customer: <span className="">{auditTrail.data_after?.customer_name}</span></div>
            <div className="">Permit No: <span className="">{auditTrail.data_after?.customer_permit_number}</span></div>
          </div>
        )
      }
      if (auditTrail.action === "UNIT_CREATED") {
        return (
          <div className="flex flex-col gap-2 ">
            <div className="">Unit: <span className="">{auditTrail.data_after?.unit}</span></div>
          </div>
        )
      }
      if (auditTrail.action === "UNIT_UPDATED") {
        return (
          <div className="flex flex-col gap-2 ">
            <div className="">Unit: <span className="">{auditTrail.data_after?.unit}</span></div>
          </div>
        )
      }
      if (auditTrail.action === "LOCATION_CREATED") {
        return (
          <div className="flex flex-col gap-2 ">
            <div className="">Location: <span className="">{auditTrail.data_after?.location}</span></div>
          </div>
        )
      }
      if (auditTrail.action === "LOCATION_UPDATED") {
        return (
          <div className="flex flex-col gap-2 ">
            <div className="">Location: <span className="">{auditTrail.data_after?.location}</span></div>
          </div>
        )
      }

    }
  },
  {
    accessorKey: "status",
    header: "Status",
  },
]
