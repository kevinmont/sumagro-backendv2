export interface SumagroOutputDao {
    getAllDataOutputs(): Promise<any>
    saveOutputs(record: any, operatorName: any, productor: any): Promise<any>
    getAllDataByDate(dateStart: any, dateEnd: any): Promise<any>
    getDataByIngenioAndDateForProducts(dateStart: any, dateEnd: any, ingenioId: any): Promise<any>
    getDataByIngenioAndDateForOrders(dateStart: any, dateEnd: any, ingenioId: any): Promise<any>
}