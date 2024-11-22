import { Account } from "./account"
import { Budget } from "./budget"

export enum PaymentEnum {
    Expense= 'Expense',
    Income= 'Income'
}

export type PaymentType = PaymentEnum.Expense | PaymentEnum.Income

export interface Payment {
    amount: number
    description: string
    type: PaymentType
    account: WithId<Account>
    category?: WithId<Budget>
    created_on: Date
}