import { useContext, useEffect, useState } from "react"
import AuthenticatedUsersLayout from "./layouts/AuthenticatedUsersLayout"
import { Location } from "@/utils/types"
import ProtectedAxios from "@/api/protectedAxios"
import { toast } from "@/components/ui/use-toast"
import { EventContext } from "@/context/EventProvider"
import CreateLocationDialog from "@/components/locations/CreateLocationDialog"
import { LocationsDataTable } from "@/components/locations/LocationsDataTable"
import { locationsColumns } from "@/components/locations/locationsColumns"
import EditLocationDialog from "@/components/locations/EditLocationDialog"
import DeleteLocationDialog from "@/components/locations/DeleteLocationDialog"

const LocationManager = () => {
    const { event, setEvent } = useContext(EventContext)

    const [locations, setLocations] = useState<Location[]>([])
    const [fetchingLocations, setFetchingLocations] = useState(false)

    const [selectedLocationData, setSelectedLocationData] = useState<Location>({ location: "", created_by: 0 })
    const [editLocationDialogState, setEditLocationDialogState] = useState(false)
    const [deleteLocationDialogState, setDeleteLocationDialogState] = useState(false)


    const getAllLocations = () => {
        setFetchingLocations(true)
        ProtectedAxios.get("/api/common/locations")
            .then(res => {
                if (res.data) {
                    setLocations(res.data)
                    setFetchingLocations(false)
                }
            })
            .catch((error: any) => {
                setFetchingLocations(false)

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
        getAllLocations()
    }, [])


    useEffect(() => {
        if (event.eventName === "EDIT_LOCATION") {
            const data: any = event.payload
            setSelectedLocationData({ location_id: data.location_id, location: data.location, created_by: data.created_by, created_at: data.created_at, updated_at: data.updated_at })
            setEditLocationDialogState(true)

            //reset the event
            setEvent({ eventName: "INITIAL_EVENT", payload: {} })
        }
    }, [event])


    useEffect(() => {
        if (event.eventName === "DELETE_LOCATION") {
            const data: any = event.payload
            setSelectedLocationData({ location_id: data.location_id, location: data.location, created_by: data.created_by, created_at: data.created_at, updated_at: data.updated_at })
            setDeleteLocationDialogState(true)

            //reset the event
            setEvent({ eventName: "INITIAL_EVENT", payload: {} })
        }
    }, [event])

    return (
        <AuthenticatedUsersLayout>
            <div className='flex justify-between'>
                <h1 className='text-2xl font-medium'>Manage Locations</h1>
                <CreateLocationDialog
                    functionToExecuteAfterAddingLocation={(new_location: Location) => {
                        setLocations(prev => {
                            let updatedLocations = [...prev]
                            updatedLocations.unshift(new_location)
                            return updatedLocations
                        })
                    }}
                />
            </div>

            <LocationsDataTable columns={locationsColumns} data={locations} loadingState={fetchingLocations} />

            <EditLocationDialog
                location={selectedLocationData}
                functionToExecuteAfterUpdatingLocation={(updated_location: Location) => {
                    setLocations(prev => {
                        let updatedLocations = [...prev]
                        let indexOfSelectedLocation = updatedLocations.findIndex(location => location.location_id === updated_location.location_id)
                        updatedLocations[indexOfSelectedLocation] = { ...updated_location }
                        return updatedLocations
                    })
                }}
                dialogState={editLocationDialogState}
                dialogStateSetter={setEditLocationDialogState}
            />

            <DeleteLocationDialog
                location={selectedLocationData}
                functionToExecuteAfterDeletingLocation={(deleted_location: Location) => {
                    setLocations(prev => {
                        let updatedLocations = prev.filter(location => location.location_id !== deleted_location.location_id)
                        return updatedLocations
                    })
                }}
                dialogState={deleteLocationDialogState}
                dialogStateSetter={setDeleteLocationDialogState}
            />

        </AuthenticatedUsersLayout>
    )
}

export default LocationManager