

export type PaystackEvent = 'customeridentification.failed'
    | 'customeridentification.success'
    | 'dedicatedaccount.assign.failed'
    | 'dedicatedaccount.assign.success'
    | 'charge.success'
    | 'transfer.success'
    | 'transfer.failed'
    | 'transfer.reversed';