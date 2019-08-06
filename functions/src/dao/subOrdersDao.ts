import Mysql from '../utils/mysql';
import * as log4js from 'log4js';
const logger = log4js.getLogger();
logger.level = 'debug';

export default class SubOrdersDao {
    public mysql: Mysql;
    constructor() {
        this.mysql = new Mysql();
    }

    async saveSubOrders(subOrders: any) {
        let sql = `INSERT INTO suborder(orderid,description,quantity,captured,received,status)
        values(${subOrders.orderid}, '${subOrders.description}', ${subOrders.quantity},
        ${subOrders.captured},${subOrders.received},${subOrders.status})`;
        console.log("consulta: " + sql);
        return await this.mysql.query(sql);
    }

}