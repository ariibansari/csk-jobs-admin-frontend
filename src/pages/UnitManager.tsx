import { useContext, useEffect, useState } from "react"
import AuthenticatedUsersLayout from "./layouts/AuthenticatedUsersLayout"
import { Unit } from "@/utils/types"
import ProtectedAxios from "@/api/protectedAxios"
import { toast } from "@/components/ui/use-toast"
import { EventContext } from "@/context/EventProvider"
import CreateUnitDialog from "@/components/units/CreateUnitDialog"
import { UnitsDataTable } from "@/components/units/UnitsDataTable"
import { unitsColumns } from "@/components/units/unitsColumns"
import EditUnitDialog from "@/components/units/EditUnitDialog"
import DeleteUnitDialog from "@/components/units/DeleteUnitDialog"
import { UserContext } from "@/context/UserProvider"


const UnitManager = () => {
    const { event, setEvent } = useContext(EventContext)
    const { user } = useContext(UserContext)

    const [units, setUnits] = useState<Unit[]>([])
    const [fetchingUnits, setFetchingUnits] = useState(false)

    const [selectedUnitData, setSelectedUnitData] = useState<Unit>({ unit: "", created_by: 0 })
    const [editUnitDialogState, setEditUnitDialogState] = useState(false)
    const [deleteUnitDialogState, setDeleteUnitDialogState] = useState(false)


    const getAllUnits = () => {
        setFetchingUnits(true)
        ProtectedAxios.get("/api/common/units")
            .then(res => {
                if (res.data) {
                    setUnits(res.data)
                    setFetchingUnits(false)
                }
            })
            .catch((error: any) => {
                setFetchingUnits(false)

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

    useEffect(() => {
        getAllUnits()
    }, [])


    useEffect(() => {
        if (event.eventName === "EDIT_UNIT") {
            const data: any = event.payload
            setSelectedUnitData({ unit_id: data.unit_id, unit: data.unit, created_by: data.created_by, created_at: data.created_at, updated_at: data.updated_at })
            setEditUnitDialogState(true)

            //reset the event
            setEvent({ eventName: "INITIAL_EVENT", payload: {} })
        }
    }, [event])


    useEffect(() => {
        if (event.eventName === "DELETE_UNIT") {
            const data: any = event.payload
            setSelectedUnitData({ unit_id: data.unit_id, unit: data.unit, created_by: data.created_by, created_at: data.created_at, updated_at: data.updated_at })
            setDeleteUnitDialogState(true)

            //reset the event
            setEvent({ eventName: "INITIAL_EVENT", payload: {} })
        }
    }, [event])

    return (
        <AuthenticatedUsersLayout>
            <div className='flex justify-between'>
                <h1 className='text-2xl font-medium'>Manage Units</h1>
                {user.role === "ADMIN"
                    &&
                    <CreateUnitDialog
                        functionToExecuteAfterAddingUnit={(new_unit: Unit) => {
                            setUnits(prev => {
                                let updatedUnits = [...prev]
                                updatedUnits.unshift(new_unit)
                                return updatedUnits
                            })
                        }}
                    />
                }
            </div>

            <UnitsDataTable columns={unitsColumns} data={units} loadingState={fetchingUnits} />

            <EditUnitDialog
                unit={selectedUnitData}
                functionToExecuteAfterUpdatingUnit={(updated_unit: Unit) => {
                    setUnits(prev => {
                        let updatedUnits = [...prev]
                        let indexofSelectedUnit = updatedUnits.findIndex(unit => unit.unit_id === updated_unit.unit_id)
                        updatedUnits[indexofSelectedUnit] = { ...updated_unit }
                        return updatedUnits
                    })
                }}
                dialogState={editUnitDialogState}
                dialogStateSetter={setEditUnitDialogState}
            />

            <DeleteUnitDialog
                unit={selectedUnitData}
                functionToExecuteAfterDeletingUnit={(deleted_unit: Unit) => {
                    setUnits(prev => {
                        let updatedUnits = prev.filter(unit => unit.unit_id !== deleted_unit.unit_id)
                        return updatedUnits
                    })
                }}
                dialogState={deleteUnitDialogState}
                dialogStateSetter={setDeleteUnitDialogState}
            />

        </AuthenticatedUsersLayout>
    )
}

export default UnitManager