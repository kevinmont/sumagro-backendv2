export interface AplicatedDao {
    getCounterAplicated(codigo: string): Promise<any>,
    getOutPlot(productor: string): Promise<any>,
    getAplicatedByOperator(operator: string): Promise<any>,
    getAplicatedById(id: number): Promise<any>,
    saveAplicated(record: any, operatorName: string): Promise<any>,
    updatedAplicated(id: number, longitud: number, latitud: number, dateAplicated: string, inPLot: boolean): Promise<any>,
    saveParcelaSack(id:number,parcela:string,date:string): Promise<any>,
    getDataByIngenioAndDateForProducts(dateStart:any, dateEnd:any, ingenioId:any): Promise<any>
}