import Mysql from '../utils/mysql';
import * as log4js from 'log4js';
const logger = log4js.getLogger();
logger.level = 'debug';

export default class InventoryDao {

    public mysql: Mysql;
    constructor(mysql: Mysql) {
        this.mysql = mysql;
    }

    async getdatainventoryByDate(dateStart:string, dateEnd: string, ingenioId:any){
        logger.info('DAO: Method getdatainventory Startting');
        let sql=`SELECT * FROM inventory where ingenioid=${ingenioId} and date >= '${dateStart} 00:00:00.000' 
        and date <= '${dateEnd} 23:59:59.000'`;
        logger.debug('Dao: Method getdatainventory Ending');
        return await this.mysql.query(sql);
    }
}