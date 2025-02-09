

export interface Log {
    time_spent: number
    attempts: number
    authentication: string
    errors: number
    success: boolean
    mobile: boolean
    input: any[]
    channel: any
    history: History[]
}

export interface Authorization {
    authorization_code: string
    bin: string
    last4: string
    exp_month: string
    exp_year: string
    channel: string
    card_type: string
    bank: string
    country_code: string
    brand: string
    account_name: string
    sender_bank?: string
    sender_bank_account_number?: string
    sender_country?: string
    sender_name?: string
    receiver_bank_account_number?: string
    receiver_bank?: string
    narration?: string
    reusable: boolean
    signature: string
}

export interface Customer {
    id: number
    first_name: string
    last_name: string
    email: string
    customer_code: string
    phone: string
    metadata: Record<string, any>
    risk_action: string
    international_format_phone: string
}

export interface ChargeSuccess {
    id: number
    domain: string
    status: string
    reference: string
    amount: number
    message: any
    gateway_response: string
    paid_at: string
    created_at: string
    channel: string
    currency: string
    ip_address: string
    metadata: number
    log: Log
    fees: any
    customer: Omit<Customer, 'international_format_phone'>
    authorization: Authorization
    plan: Record<string, any>
}