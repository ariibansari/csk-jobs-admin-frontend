import { StockTransfer, Unit } from '@/utils/types'
import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { CgSpinner } from 'react-icons/cg'
import { UserContext } from '@/context/UserProvider'
import ProtectedAxios from '@/api/protectedAxios'
import { toast } from '../ui/use-toast'
import { ArrowDown, ArrowUp } from 'lucide-react'

const DeleteStockTransfersDialog = ({ stockTransfer, functionToExecuteAfterDeletingStockTransfer, toggleButton, dialogState, dialogStateSetter }: { stockTransfer: StockTransfer, functionToExecuteAfterDeletingStockTransfer: Function, toggleButton?: React.ReactElement, dialogState: boolean, dialogStateSetter: Dispatch<SetStateAction<boolean>> }) => {
    const { user } = useContext(UserContext)
    const [selectedStockTransferData, setSelectedStockTransferData] = useState<StockTransfer>(stockTransfer)
    const [deletingStockTransfer, setDeletingStockTransfer] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        setSelectedStockTransferData(stockTransfer)
    }, [stockTransfer])

    const deleteStockTransfer = () => {
        setDeletingStockTransfer(true)

        ProtectedAxios.post("/api/admin/stockTransfer/delete", { user_id: user.user_id, stock_transfer_id: selectedStockTransferData.stock_transfer_id })
            .then(res => {
                if (res.data) {
                    setDeletingStockTransfer(false)
                    dialogStateSetter(false)
                    functionToExecuteAfterDeletingStockTransfer(res.data)
                    setSelectedStockTransferData({ quantity: 0, transferred_at: "", transferred_by: 0, item_id: 0, unit_id: 0, location_id: 0, transfer_type: "IN" })
                }
            })
            .catch((error: any) => {
                setDeletingStockTransfer(false)
                if (error.response?.status === 409 && error.response?.data.error) {
                    setError(error.response?.data.error)
                    return
                }

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
        <>
            <Dialog open={dialogState} onOpenChange={dialogStateSetter}>
                {toggleButton
                    &&
                    <DialogTrigger>
                        {toggleButton}
                    </DialogTrigger>
                }
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Stock Transfer</DialogTitle>
                    </DialogHeader>
                    <div className='py-4'>
                        <p>Are you sure you want to delete this stock transfer?</p>
                        <DialogDescription className='pt-3'>
                            <div className='flex flex-col gap-1'>
                                <div className="flex items-center gap-1">
                                    {selectedStockTransferData.transfer_type === "IN"
                                        ? <ArrowDown className="w-4 h-4 text-green-500" />
                                        : <ArrowUp className="w-4 h-4 text-destructive" />
                                    }
                                    {selectedStockTransferData.transfer_type}
                                </div>
                                <p>{selectedStockTransferData.item_name}</p>
                                <p>{selectedStockTransferData.quantity} ({selectedStockTransferData.unit})</p>
                                <p>{selectedStockTransferData.location}</p>
                            </div>
                        </DialogDescription>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => deleteStockTransfer()} variant="destructive" className='gap-2' disabled={deletingStockTransfer}>
                            Yes, Delete
                            {deletingStockTransfer
                                &&
                                <CgSpinner className="animate-spin text-xl" />
                            }
                        </Button>
                    </DialogFooter>

                </DialogContent>
            </Dialog>
        </>
    )
}

export default DeleteStockTransfersDialog