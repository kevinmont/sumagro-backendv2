import { SubOrders } from './SubOrders';
export interface Order{
   
    client: string,
    clientAddress: string,
    remissionNumber: number,
    shippingDate: Date,
    subOrders: SubOrders[],
    status: string,
    operator: string,
    operationUnit: string,
    plates: string,
    ingenioId: string,
}

export const STATUS ={
    PENDING: "PENDING",
    TRANSIT: "TRANSIT",
    DELIVERED: "DELIBERED"
}