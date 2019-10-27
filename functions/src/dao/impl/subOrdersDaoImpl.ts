import * as log4js from 'log4js';
import Mysql from '../../utils/mysql';
import { AbstractDao } from '../abstractDao';
import { SubOrdersDao } from '../subOrdersDao';

const logger = log4js.getLogger('sumagro.dao.impl.SubOrdersDaoImpl');

export class SubOrdersDaoImpl extends AbstractDao implements SubOrdersDao {
    
    constructor(db: Mysql) {
        super(db)
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
            return this.db.query(sql);
        }));
    }

    async getsubOrdersById(orderid: number) {
        logger.info('DAO: Method getsubOrdersById Startting');
        let sql = `SELECT * FROM suborder WHERE orderid=${orderid}`
        logger.debug('DAO: Method getsubOrdersById Ending');
        return await this.db.query(sql);;
    }

    async updatestatus(subOrderId:any){
        logger.info(`DAO: Method updatestatus Startting`);
        let sql=`update suborder set status=1 where id=${subOrderId}`;
        logger.debug(`DAO: Method updatestatus Ending`);
        return await this.db.query(sql);
    }

    async updateRecived(subOrderId:any){
        logger.info(`DAO: Method updatestatus Startting`);
        let sql=`update suborder set received=1 where id=${subOrderId}`;
        logger.debug(`DAO: Method updatestatus Ending`);
        return await this.db.query(sql);
    }

    async updateCaptured(subOrderId:any){
        logger.info(`DAO: Method updatestatus Startting`);
        let sql=`update suborder set captured=1 where id=${subOrderId}`;
        logger.debug(`DAO: Method updatestatus Ending`);
        return await this.db.query(sql);
    }

}