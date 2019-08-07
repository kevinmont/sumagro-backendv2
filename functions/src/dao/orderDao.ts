import Mysql from '../utils/mysql';
import * as log4js from 'log4js';
const logger = log4js.getLogger();
logger.level = 'debug';

export default class OrderDao{
    public mysql: Mysql;

    constructor(){
        this.mysql = new Mysql();
    }

    async deleteOrderById(orderId:string){
        logger.info('DAO: Method deleteOrderById Starting');
        let sql = `DELETE FROM orders WHERE id = ${orderId}`;
        logger.debug('DAO: Method deleteOrderById Ending');
        return await this.mysql.query(sql);
        
    }

    
}