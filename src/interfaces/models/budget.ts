export interface Limit {
    amount: number,
    month: Date
}

export interface Budget {
    name: string,
    icon: string,
    limit?: WithId<Limit>
}