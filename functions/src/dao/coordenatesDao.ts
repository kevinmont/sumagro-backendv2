export interface CoordenatesDao {
    registeringCoordenates(latitud:any, longitud:any): Promise<any>,
    getCoordenatesById(coordenatesId: any): Promise<any>,
    saveCordenate(record:any): Promise<any>,
    getCordenate(record:any): Promise<any>,
}