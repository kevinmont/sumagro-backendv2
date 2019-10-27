export interface InventoryDao {
    getdatainventoryByDate(dateStart: string, dateEnd: string, ingenioId: any): Promise<any>
}