export interface QrdataDao {
    registeringQrData(record:any, coordenateId:any): Promise<any>
    getQrDataCoordenateId(coordenateid: any): Promise<any>
}