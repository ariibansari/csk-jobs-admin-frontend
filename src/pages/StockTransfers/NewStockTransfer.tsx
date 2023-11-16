import { Button } from "@/components/ui/button"
import AuthenticatedUsersLayout from "../layouts/AuthenticatedUsersLayout"
import { useContext, useEffect, useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { BadgeCheck, Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Label } from "@radix-ui/react-label"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import ProtectedAxios from "@/api/protectedAxios"
import { Item, Location } from "@/utils/types"
import CreateItemDialog from "@/components/items/CreateItemDialog"
import { Input } from "@/components/ui/input"
import { Box, TrendingDown, TrendingUp, X } from "lucide-react"
import CreateLocationDialog from "@/components/locations/CreateLocationDialog"
import { DateTimePicker } from "@/components/ui/dateTimePicker"
import { UserContext } from "@/context/UserProvider"
import { CgSpinner } from "react-icons/cg"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog"


const NewStockTransfer = ({ transferType }: { transferType: "IN" | "OUT" }) => {
    const { user } = useContext(UserContext)

    const [transferSucceeded, setTransferSucceeded] = useState(false)

    const navigate = useNavigate()
    const [error, setError] = useState("")

    const [loadingItems, setLoadingItems] = useState(true)
    const [items, setItems] = useState<Item[]>([])
    const [itemsSelectState, setItemsSelectState] = useState(false)
    const [selectedItem, setSelectedItem] = useState<Item | null>(null)

    const [quantity, setQuantity] = useState(0)

    const [loadingLocations, setLoadingLocations] = useState(true)
    const [locations, setLocations] = useState<Location[]>([])
    const [locationsSelectState, setLocationsSelectState] = useState(false)
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)

    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const handleDateChange = (date: Date) => {
        setSelectedDate(date);
    };

    const [savingStockTransfer, setSavingStockTransfer] = useState(false)

    const [loadingCurrentStock, setLoadingCurrentStock] = useState(true)
    const [currentStock, setCurrentStock] = useState<{ quantity: number, unit: string | undefined }>({ quantity: 0, unit: undefined })


    const getAllItems = () => {
        setLoadingItems(true)
        ProtectedAxios.get("/api/common/items")
            .then(res => {
                if (res.data) {
                    setItems(res.data)
                    setLoadingItems(false)
                }
            })
            .catch((error: any) => {
                setLoadingItems(false)
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
    const getAllLocations = () => {
        setLoadingLocations(true)
        ProtectedAxios.get("/api/common/locations")
            .then(res => {
                if (res.data) {
                    setLocations(res.data)
                    setLoadingLocations(false)
                }
            })
            .catch((error: any) => {
                setLoadingLocations(false)
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
        getAllItems()
        getAllLocations()
    }, [])


    const getItemStockAtLocation = () => {
        setLoadingCurrentStock(true)
        toast({ itemID: "stockQuantityToast" }).dismiss()
        ProtectedAxios.get(`/api/common/inventory/items/${selectedItem?.item_id}/locations/${selectedLocation?.location_id}/stock`)
            .then(res => {
                if (res.data) {
                    setCurrentStock({ quantity: res.data.quantity, unit: res.data.unit })
                    setLoadingCurrentStock(false)

                    if (res.data.quantity === 0) {
                        toast({
                            itemID: "stockQuantityToast",
                            variant: "destructive",
                            title: `'${selectedItem?.name}' have 0 stock at '${selectedLocation?.location}'. Change the item or location to continue stock out`
                        })
                    }
                }
            })
            .catch((error: any) => {
                setLoadingCurrentStock(false)
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
        if (transferType === "OUT" && selectedItem?.item_id && selectedLocation?.location_id) {
            getItemStockAtLocation()
        }
    }, [transferType, selectedItem, selectedLocation])


    const saveTransfer = () => {
        setError("")

        if (selectedItem === null) {
            setError("Please select an item to continue")
            return
        }
        if (quantity <= 0) {
            setError("Quantity must be greater than 0")
            return
        }

        if (selectedLocation === null) {
            setError("Please select a location to continue")
            return
        }

        if (selectedDate === null) {
            setError("Please select a transfer date-time to continue")
            return
        }

        if (transferType === "OUT" && quantity > currentStock.quantity) {
            setError(`Quantity must be less then or equal to ${currentStock.quantity}`)
            return
        }

        setSavingStockTransfer(true)
        const requestBody = { user_id: user.user_id, quantity, transferred_at: selectedDate, item_id: selectedItem?.item_id, location_id: selectedLocation?.location_id, transfer_type: transferType }
        ProtectedAxios.post("/api/common/stockTransfer/add", requestBody)
            .then(res => {
                if (res.data) {
                    setTransferSucceeded(true)
                    setSavingStockTransfer(false)
                }
            })
            .catch((error: any) => {
                setSavingStockTransfer(false)
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

    const reset = () => {
        setTransferSucceeded(false)
        setSelectedItem(null)
        setQuantity(0)
        setSelectedLocation(null)
        setSelectedDate(null)
    }

    return (
        <AuthenticatedUsersLayout>
            <div className="flex flex-col justify-center items-center">
                <div className="flex justify-between items-center gap-3 w-[20rem] max-w-[95vw]">
                    <h1 className="text-2xl font-medium text-center">Stock Transfer</h1>
                    <span className="h-7 w-[1px] bg-slate-500/70" />
                    <div className="flex items-center gap-1">
                        <h2>Stock {transferType === "IN" ? "In" : "Out"}</h2>
                        {transferType === "IN"
                            ?
                            <TrendingDown className="rotate-90 w-5 h-5 text-green-500" />
                            :
                            <TrendingUp className="w-5 h-5 text-destructive" />
                        }
                    </div>
                </div>

                {!transferSucceeded
                    &&
                    <div className="flex flex-col gap-10 w-[20rem] max-w-[95vw]">
                        <p className="text-center mt-2 text-muted-foreground">Select and fill all the details to add a new stock transfer</p>

                        <div>
                            <div>
                                {loadingItems || loadingLocations
                                    ?
                                    <div className="flex flex-col gap-3">
                                        <div>
                                            <Skeleton className="w-[50%] h-4 mb-3" />
                                            <Skeleton className="w-[100%] h-10 " />
                                            {transferType === "IN"
                                                &&
                                                <div className="flex justify-end my-3"><Skeleton className="h-10 w-28" /></div>
                                            }
                                        </div>
                                        <div>
                                            <Skeleton className="w-[50%] h-4 mb-3" />
                                            <Skeleton className="w-[100%] h-10 " />
                                            <div className="flex justify-end my-3"><Skeleton className="h-10 w-28" /></div>
                                        </div>
                                        <div>
                                            <Skeleton className="w-[50%] h-4 mb-3" />
                                            <Skeleton className="w-[100%] h-10 " />
                                        </div>
                                    </div>

                                    :
                                    <div className="flex flex-col gap-7">
                                        <div>
                                            <Label className="text-sm">Select Item</Label>
                                            <Popover open={itemsSelectState} onOpenChange={setItemsSelectState}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        className="w-[100%] justify-between"
                                                    >
                                                        {selectedItem
                                                            ? <>{selectedItem.name.substring(0, 30)} {selectedItem?.name.length > 30 && "..."}</>
                                                            : "No item selected..."}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[20rem] max-w-[95vw] p-0">
                                                    <Command>
                                                        <CommandInput placeholder="Search item..." />
                                                        <CommandEmpty>No items found.</CommandEmpty>
                                                        <CommandGroup>
                                                            {items.map((item) => (
                                                                <CommandItem
                                                                    key={item.item_id}
                                                                    value={JSON.stringify(item)}
                                                                    onSelect={(currentValue) => {
                                                                        setSelectedItem(JSON.parse(currentValue))
                                                                        setItemsSelectState(false)
                                                                    }}
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            "mr-2 h-4 w-4",
                                                                            selectedItem?.item_id === item.item_id ? "opacity-100" : "opacity-0"
                                                                        )}
                                                                    />
                                                                    {item.name}
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>

                                            <div className="flex justify-end mt-3">
                                                <CreateItemDialog
                                                    toggleButton={<Button variant="outline" size="sm">Add New Item</Button>}
                                                    functionToExecuteAfterAddingItem={(new_item: Item) => {
                                                        setItems(prev => {
                                                            let updatedItems = [...prev]
                                                            updatedItems.unshift(new_item)
                                                            return updatedItems
                                                        })
                                                        setSelectedItem(new_item)
                                                    }}
                                                />
                                            </div>
                                        </div>


                                        <div>
                                            <Label className="text-sm">Select Location</Label>
                                            <Popover open={locationsSelectState} onOpenChange={setLocationsSelectState}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        className="w-[100%] justify-between"
                                                    >
                                                        {selectedLocation
                                                            ? <>{selectedLocation.location.substring(0, 30)} {selectedLocation?.location.length > 30 && "..."}</>
                                                            : "No location selected..."}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[20rem] max-w-[95vw] p-0">
                                                    <Command>
                                                        <CommandInput placeholder="Search location..." />
                                                        <CommandEmpty>No locations found.</CommandEmpty>
                                                        <CommandGroup>
                                                            {locations.map((location) => (
                                                                <CommandItem
                                                                    key={location.location_id}
                                                                    value={JSON.stringify(location)}
                                                                    onSelect={(currentValue) => {
                                                                        setSelectedLocation(JSON.parse(currentValue))
                                                                        setLocationsSelectState(false)
                                                                    }}
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            "mr-2 h-4 w-4",
                                                                            selectedLocation?.location_id === location.location_id ? "opacity-100" : "opacity-0"
                                                                        )}
                                                                    />
                                                                    {location.location}
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>

                                            <div className="flex justify-end mt-3">
                                                <CreateLocationDialog
                                                    toggleButton={<Button variant="outline" size="sm">Add New Location</Button>}
                                                    functionToExecuteAfterAddingLocation={(new_location: Location) => {
                                                        setLocations(prev => {
                                                            let updatedLocations = [...prev]
                                                            updatedLocations.unshift(new_location)
                                                            return updatedLocations
                                                        })
                                                        setSelectedLocation(new_location)
                                                    }}
                                                />
                                            </div>
                                        </div>


                                        <div>
                                            <Label htmlFor="quantity" className="text-sm">Quantity</Label>
                                            <Input
                                                type="number"
                                                id="quantity"
                                                value={quantity}
                                                onChange={e => setQuantity(parseInt(e.target.value))}
                                                disabled={transferType === "OUT" && (selectedItem === null || selectedLocation === null || currentStock.quantity === 0)}
                                            />
                                            {transferType === "OUT"
                                                &&
                                                <p className="mt-2 text-sm mb-4">
                                                    Current Stock Quantity:
                                                    <span className="text-muted-foreground">
                                                        {selectedItem === null || selectedLocation === null
                                                            ? " Select an Item and Location to see stock"
                                                            :
                                                            loadingCurrentStock
                                                                ? " Loading..."
                                                                : ` ${currentStock.quantity} ${currentStock.unit ? `(${currentStock.unit})` : ""}`
                                                        }
                                                    </span>
                                                </p>
                                            }
                                        </div>


                                        <div>
                                            <Label htmlFor="transfer_date_time" className="text-sm">Date Time</Label>
                                            <DateTimePicker
                                                date={selectedDate || new Date()}
                                                setDate={handleDateChange}
                                                disabled={transferType === "OUT" && (selectedItem === null || selectedLocation === null || currentStock.quantity === 0)}
                                            />
                                        </div>

                                        {error.length > 0
                                            &&
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <span className='col-span-4 mt-1 text-sm px-4 pr-8 py-3 destructive group border-destructive bg-destructive text-destructive-foreground rounded-md relative'>
                                                    {error}
                                                    <Button className='p-0 h-auto hover:bg-transparent absolute right-3 top-3' variant="ghost" onClick={() => setError("")}><X className='w-3' /></Button>
                                                </span>
                                            </div>
                                        }
                                    </div>
                                }
                            </div>

                            <div className="flex justify-between items-center w-[100%] mt-16">
                                <Button variant="ghost" onClick={() => navigate(-1)}>Back</Button>
                                <Button onClick={saveTransfer} className="gap-2" disabled={savingStockTransfer || (transferType === "OUT" && (selectedItem === null || selectedLocation === null || currentStock.quantity === 0))}>
                                    Save
                                    {!savingStockTransfer
                                        &&
                                        <>
                                            {
                                                transferType === "IN"
                                                    ?
                                                    <TrendingDown className="rotate-90 w-5 h-5 text-green-500" />
                                                    :
                                                    <TrendingUp className="w-5 h-5 text-destructive/70" />
                                            }
                                        </>
                                    }
                                    {savingStockTransfer
                                        &&
                                        <CgSpinner className="animate-spin text-xl" />
                                    }
                                </Button>
                            </div>
                        </div>
                    </div>
                }

                {transferSucceeded
                    &&
                    <div className="flex flex-col gap-10 w-[18rem]">
                        <div>
                            <div className="flex flex-col items-center justify-center mt-16">
                                <div className="relative">
                                    <Box className="w-28 h-28 fill-primary text-background" />
                                    {transferType === "IN"
                                        ?
                                        <TrendingDown className="rotate-90 w-9 h-9 text-green-500 absolute top-0 right-2" />
                                        :
                                        <TrendingUp className="w-9 h-9 text-destructive absolute top-2 right-2" />
                                    }
                                    <BadgeCheck className="absolute bottom-5 left-2 w-8 h-8 fill-green-700 text-background" />
                                </div>
                                <p className="text-center text-lg px-2">New stock transfer successfully saved</p>
                            </div>

                            <div className="flex justify-between items-center w-[100%] mt-16">
                                <NavLink to="/">
                                    <Button variant="ghost">
                                        Manage Stocks
                                    </Button>
                                </NavLink>

                                <Dialog>
                                    <DialogTrigger><Button>New Transfer</Button></DialogTrigger>
                                    <DialogContent>
                                        <div className="flex flex-col items-center justify-center py-20 gap-10">
                                            <div className="flex flex-col items-center gap-1">
                                                <h2 className="text-2xl font-medium">New Stock Transfer</h2>
                                                <p className="text-muted-foreground">Select an option to continue</p>
                                            </div>
                                            <div className="flex gap-5">
                                                <NavLink to="/stock-transfer/stock-in"><Button className="gap-2" onClick={reset} size="lg">Stock In <TrendingDown className="rotate-[110deg] w-4 h-4 text-green-500" /></Button></NavLink>
                                                <NavLink to="/stock-transfer/stock-out"><Button className="gap-2" onClick={reset} size="lg" variant="outline">Stock Out <TrendingUp className="w-5 h-5 text-destructive/70 rotate-[-10deg]" /></Button></NavLink>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                        </DialogFooter>

                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </AuthenticatedUsersLayout >
    )
}

export default NewStockTransfer