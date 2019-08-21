import Mysql from '../utils/mysql';
import * as log4js from 'log4js';

const logger = log4js.getLogger();
logger.level = 'debug';

export default class IntransitDao {
    public mysql : Mysql;

    constructor(mysql : Mysql) {
        this.mysql = mysql;
    }

    async getcountFormuleIntransit(params:any = ''){
       logger.info(`DAO: Method getcountFormuleIntransit Startting`); 
        let sql=`select description, count(description) AS count from ${params} group by description`;
       logger.debug(`Dao: Method getcountFormuleIntransit Ending`);
       return await this.mysql.query(sql);
    }

    async getalldataIntransit(){
        logger.info('DAO: Method getalldataIntransit Startting');
        let sql=`Select * from sumagrointransit`;
        logger.debug('DAO Method getalldataIntransit Ending');
        return await this.mysql.query(sql);
    }
}
