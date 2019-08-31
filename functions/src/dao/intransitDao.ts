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

    async getAllDataByDate(dateStart:any, dateEnd:any, ingenioId:any){
        logger.info('DAO: Method getAllDataByDate Startting');
        let sql=`SELECT * FROM intransit where ingenioId=${ingenioId} and date >= '${dateStart}T00:00:00.000Z' 
        and date <= '${dateEnd}T23:59:59.000Z'`;
        logger.info(`sql getAllDataByDate: ${sql}`);
        logger.debug('Dao: Method getAllDataByDate Ending');
        return await this.mysql.query(sql);
    }

    async getAllDataByDateSumagro(dateStart:any, dateEnd:any){
        logger.info('DAO: Method getAllDataByDate Startting');
        let sql=`SELECT * FROM sumagrointransit where date >= '${dateStart}T00:00:00.000Z' 
        and date <= '${dateEnd}T23:59:59.000Z'`;
        logger.info(`sql getAllDataByDate: ${sql}`);
        logger.debug('Dao: Method getAllDataByDate Ending');
        return await this.mysql.query(sql);
    }
}
