export interface Ingenio{
    addressid:number,
    email:string,
    name:string
}
export const ingenioSection = [
 "intransit",
 "inventory",
 "outputs",
 "entrance",
 "aplicated"
]
export const ingeniosTypes = {
    intransit:"en transito",
 inventory: "inventario",
 outputs:"salidas",
 entrance:"entradas",
 aplicated:"aplicados"
}

export const arrtypes=[
    "outputs",
    "entrance",
    "aplicated",
    "inventory",
    "intransit"
]

export const arrTypesFilters=[
    "outputs",
    "entrance",
    "aplicated",
    "inventory",
    "intransit",
    "sumagrointransit",
    "sumagrooutputs"
]

export enum arrTypesFiltersCompare{
    outputs= "outputs",
    entrance= "entrance",
    aplicated= "aplicated",
    inventory= "inventory",
    intransit="intransit",
    sumagrointransit="sumagrointransit",
    sumagrooutputs="sumagrooutputs"
}

export enum types{
    outputs= "outputs",
    entrance= "entrance",
    aplicated= "aplicated",
    inventory= "inventory",
    intransit="intransit"
}
