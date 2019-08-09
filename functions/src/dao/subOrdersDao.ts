import Mysql from '../utils/mysql';
import * as log4js from 'log4js';
const logger = log4js.getLogger();
logger.level = 'debug';

export default class SubOrdersDao {
    public mysql: Mysql;
    constructor() {
        this.mysql = new Mysql();
    }

    async saveSubOrders(subOrders: any, orderidreceived: any) {
        logger.info('Dao: Method saveSubOrders Startting');
        let orderid: any = orderidreceived;
        return await Promise.all(subOrders.map((subOrder: any) => {
            let sql = `INSERT INTO suborder(orderid,description,quantity,captured,received,status)
            values(${orderid}, '${subOrder.description}', ${subOrder.quantity},
            ${subOrder.captured},${subOrder.received},${subOrder.status})`;
            logger.debug('Dao: Method saveSubOrders Ending');
            return this.mysql.query(sql);
        }));
    }

    async getsubOrdersById(orderid: number) {
        logger.info('DAO: Method getsubOrdersById Startting');
        let sql = `SELECT * FROM suborder WHERE orderid=${orderid}`
        logger.debug('DAO: Method getsubOrdersById Ending');
        return await this.mysql.query(sql);;
    }

}