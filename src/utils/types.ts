export type User = {
    user_id?: number,
    name: string,
    email: string,
    companyName?: string,
    password?: string,
    isBlocked?: boolean,
    offline_plan?: "PLAN_A" | "PLAN_B" | "PLAN_C" | "PLAN_D",
    offline_plan_access_given_at?: Date | null,
    offline_plan_access_expires_at?: Date | null,
}

export type ApiKey = {
    api_key_id?: number,
    api_key: string,
    api_key_name: string,
    user_id?: number,
    created_at: Date | null,
    updated_at?: Date | null,
    last_used?: Date | null,
    active?: Boolean,
}