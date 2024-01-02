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
    Chats?: [],
    Messages?: []
}

export type Files = {
    id: number,
    type: string,
    file: File,
}