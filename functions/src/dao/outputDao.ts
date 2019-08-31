import Mysql from '../utils/mysql';
import * as log4js from 'log4js';

const logger = log4js.getLogger();
logger.level ='debug';

export default class OutputDao{
    public mysql:Mysql;

    constructor(mysql:Mysql){
        this.mysql= mysql;
    }
    
    async getAllDataByDate(dateStart:any, dateEnd:any){
        logger.info('DAO: Method getAllDataByDate Startting');
        let sql=`SELECT * FROM outputs where date >= '${dateStart}T00:00:00.000Z' 
        and date <= '${dateEnd}T23:59:59.000Z'`;
        logger.info(`sql getAllDataByDate: ${sql}`);
        logger.debug('Dao: Method getAllDataByDate Ending');
        return await this.mysql.query(sql);
    }

    async getAllDataByDateByIngenio(dateStart:any, dateEnd:any, ingenioId:any){
        logger.info('DAO: Method getAllDataByDate Startting');
        let sql=`SELECT * FROM outputs where ingenioid=${ingenioId} and date >= '${dateStart}T00:00:00.000Z' 
        and date <= '${dateEnd}T23:59:59.000Z'`;
        logger.info(`sql getAllDataByDate: ${sql}`);
        logger.debug('Dao: Method getAllDataByDate Ending');
        return await this.mysql.query(sql);
    }
}
