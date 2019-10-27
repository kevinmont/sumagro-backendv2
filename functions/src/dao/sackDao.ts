export interface SackDao {
    saveSackIntrasit(record: any, operatorName: string, parseId: number): Promise<any>,
    delIntransit(sackId: number): Promise<any>,
    saveSackOutputs(record: any, operatorName: any, parseId: number): Promise<any>,
    getSackById(sackId: any): Promise<any>,
    saveSack(record: any): Promise<any>,
    saveSackEntrance(entrance: any): Promise<any>,
    saveSackInventory(inventory: any): Promise<any>,
    deleteInventory(inventoryId: any): Promise<any>,
    getIds(ingenioId: number, table: string, producto: string, page: number, peer_page: number): Promise<any>
}