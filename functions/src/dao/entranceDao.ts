export interface EntranceDao {
    getAllDataByDate(ingenioId:any,dateStart:any,dateEnd:any): Promise<any>,
    getDataReportEntranceByOrder(ingenioId:number,dateStart:string,dateEnd:string): Promise<any>
}