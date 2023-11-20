export type NewWarehouseUser = {
    user_id: number,
    name: string,
    email: string,
    username: string,
    password: string,
    isBlocked: boolean,
}

export type Item = {
    item_id?: number,
    item_name: string,
    lot_number: string,
    hs_code: string,
    item_value: number,
    customer_name: string,
    customs_permit_number: string,
    remarks?: string,
    sku: string,
    artist_name: string,
    dimension: string,
    year_of_creation: number,
    created_by: number,
    username?: string,
    unit_id?: number,
    unit?: string,
    created_at: string,
    updated_at?: string,
}

export type AuditTrail = {
    audit_trail_id: number,
    action: "ITEM_UPDATED" | "ITEM_DELETED" | "LOCATION_UPDATED" | "LOCATION_DELETED",
    performed_by: number,
    username: string,
    timestamp: string,
    status: string,
    table_name: string,
    record_id: number,
    data_before: JSON,
    data_after: JSON,
}

export type Location = {
    location_id?: number,
    location: string,
    created_by?: number,
    username?: string,
    created_at?: string,
    updated_at?: string
}

export type Unit = {
    unit_id?: number,
    unit: string,
    created_by?: number,
    username?: string,
    created_at?: string,
    updated_at?: string
}

export type StockTransfer = {
    stock_transfer_id?: number,
    quantity: number,
    transferred_at: "",
    created_at?: ""
    transferred_by: number,
    transferred_by_username?: string,
    item_id: number,
    item_name?: string
    unit_id: number,
    unit?: string,
    location_id: number,
    location?: string,
    transfer_type: "IN" | "OUT "
}

export type ItemReport = {
    item_id: number,
    name: string,
    unit: string,
    item_description: string,
    item_value: number,
    hs_code: string,
    quantity_by_location: Object,
    total_quantity: number
}

export type InventoryReport = {
    item_id: number,
    name: string,
    item_description: string,
    hs_code: string,
    quantity: number,
    unit: string,
    location_id: number,
    location: string,
}