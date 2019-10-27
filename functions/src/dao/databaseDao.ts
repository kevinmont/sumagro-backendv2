export interface DatabaseDao {
    saveDatabase(arr: any, addressId: any, coordenatesId: any, ingenioId: any): Promise<any>,
    getRecordsByIngenioId(ingenioId: number): Promise<any>,
    getParcelaRest(codigo: string): Promise<any>,
    updatedParcelasRest(count: number, codigo: string, dateAplicated: string): Promise<any>,
    getEjidoByIngenio(ingenioId: any): Promise<any>,
    getRecordsByEjido(ejido: string): Promise<any>,
    updateProperty(codigo: string, type: string, value: string): Promise<any>,
    updatedParcelas(codigo: string, type: string, value: string): Promise<any>,
    getCoordenatesIdsByProductor(productor: string): Promise<any>,
    getRecordsByRango(ingenioId: number, rangoIni: number, rangoFin: number): Promise<any>,
    pendingQuantityRecords(ingenioId: number): Promise<any>,
    getTotalRecords(ingenioId: number): Promise<any>
}