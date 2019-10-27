export interface OutputDao {
    getAllDataByDate(dateStart:any, dateEnd:any): Promise<any>
    getDataByIngenioAndDateForProduct(dateStart:any, dateEnd:any, ingenioId:any): Promise<any>
}