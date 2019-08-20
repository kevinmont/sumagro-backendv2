import Mysql from '../utils/mysql';
import * as log4js from 'log4js';
const logger = log4js.getLogger();
logger.level = 'debug';

export default class SubOrdersDao {
    public mysql: Mysql;
    constructor(mysql: Mysql) {
        this.mysql = mysql;
    }

    async saveSubOrders(subOrders: any, orderidreceived: any) {
        logger.info('Dao: Method saveSubOrders Startting');
        let orderid: any = orderidreceived;
        return await Promise.all(subOrders.map((subOrder: any) => {
            let sql = `INSERT INTO suborder(orderid,description,quantity,captured,received,status)
            values(${orderid}, '${subOrder.description}', ${subOrder.quantity},
            false,false,false)`;
            logger.debug('Dao: Method saveSubOrders Ending');
            console.log(`DAO: sql suborder ${sql}`);
            return this.mysql.query(sql);
        }));
    }

    async getsubOrdersById(orderid: number) {
        logger.info('DAO: Method getsubOrdersById Startting');
        let sql = `SELECT * FROM suborder WHERE orderid=${orderid}`
        logger.debug('DAO: Method getsubOrdersById Ending');
        return await this.mysql.query(sql);;
    }

    async updatestatus(subOrderId:any){
        logger.info(`DAO: Method updatestatus Startting`);
        let sql=`update suborder set status=1 where id=${subOrderId}`;
        logger.debug(`DAO: Method updatestatus Ending`);
        return await this.mysql.query(sql);
    }

    async updateRecived(subOrderId:any){
        logger.info(`DAO: Method updatestatus Startting`);
        let sql=`update suborder set received=1 where id=${subOrderId}`;
        logger.debug(`DAO: Method updatestatus Ending`);
        return await this.mysql.query(sql);
    }

}