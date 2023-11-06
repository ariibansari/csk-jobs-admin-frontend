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
    name: string,
    item_description: string,
    lot_number: string,
    hs_code: string,
    item_value: number,
    customer_name: string,
    customer_permit_number: string,
    created_by: number,
    username?: string,
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