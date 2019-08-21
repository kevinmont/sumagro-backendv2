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

export enum TYPEINGENIO {
    outputs= "outputs",
    entrance= "entrance",
    aplicated= "aplicated",
    inventory= "inventory",
    intransit="intransit"
}