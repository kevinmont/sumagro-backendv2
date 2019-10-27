export interface SumagroReportDao {
    getReportInfo(table: string, type: string, dateStart: string, dateEnd: string, data: any, ingenioName: string, subType?: string): Promise<any>
    getDataOfWarehouse(tableName: string, dateStart: string, dateEnd: string, productos: any, ordenes: any, clientes: any): Promise<any>
    getDataByProduct(ingenioId: number, productos: any, tableName: string, dateStart: string, dateEnd: string): Promise<any>
    getAplicatedEntityInfo(ingenioId: number,zonas: [string], ejidos: [string], parcelas: [string], productos: [string], subType: string, dateStart: string, dateEnd: string, type: string): Promise<any>
    getAplicatedOutParcel(dateStart: string, dateEnd: string): Promise<any>
}