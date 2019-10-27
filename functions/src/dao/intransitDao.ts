export interface IntransitDao {
    getcountFormuleIntransit(params?: any): Promise<any>,
    getalldataIntransit(): Promise<any>,
    getDataByDateAndIngenioOfproduct(dateStart: any, dateEnd: any, ingenioId: any, table: any): Promise<any>,
    getDataByDateAndIngenioOfOrder(dateStart: any, dateEnd: any, ingenioId: any, table: any): Promise<any>
}