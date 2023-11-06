import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import { AuditTrail } from "@/utils/types"


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

    }
  },
  {
    accessorKey: "data_after",
    header: "After",
    cell: ({ row }) => {
      const auditTrail: any = { ...row.original }
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

    }
  },
  {
    accessorKey: "status",
    header: "Status",
  },
]
