export interface SubOrdersDao {
    saveSubOrders(subOrders: any, orderidreceived: any): Promise<any>
    getsubOrdersById(orderid: number): Promise<any>
    updatestatus(subOrderId:any): Promise<any>
    updateRecived(subOrderId:any): Promise<any>
    updateCaptured(subOrderId:any): Promise<any>
}