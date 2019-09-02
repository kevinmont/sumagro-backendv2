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
        let sql=`select distinct(description), count(description) as quantity
        from inventory where ingenioid=${ingenioId} and date >= '${dateStart}T00:00:00.000Z'
        and date <= '${dateEnd}T00:00:00.000Z'
        group by description`;
        logger.info(`sql inventory: ${sql}`);
        logger.debug('Dao: Method getdatainventory Ending');
        return await this.mysql.query(sql);
    }
}