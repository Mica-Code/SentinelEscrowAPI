import { TransferInitiated } from "paystack-sdk/dist/transfer/interface";


export type TransferData = TransferInitiated['data'];


export interface TransferSuccess {
    amount: number
    currency: string
    domain: string
    failures: any
    id: number
    integration: Integration
    reason: string
    reference: string
    source: string
    source_details: any
    status: string
    titan_code: any
    transfer_code: string
    transferred_at: any
    recipient: Recipient
    session: Session
    created_at: string
    updated_at: string
}

export interface Integration {
    id: number
    is_live: boolean
    business_name: string
}

export interface Recipient {
    active: boolean
    currency: string
    description: string
    domain: string
    email: any
    id: number
    integration: number
    metadata: any
    name: string
    recipient_code: string
    type: string
    is_deleted: boolean
    details: Details
    created_at: string
    updated_at: string
}

export interface Details {
    account_number: string
    account_name: any
    bank_code: string
    bank_name: string
}

export interface Session {
    provider: any
    id: any
}
