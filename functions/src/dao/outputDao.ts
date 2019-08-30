import Mysql from '../utils/mysql';
import * as log4js from 'log4js'

const logger = log4js.getLogger();
logger.level ='debug';

export default class Output{
    public mysql:Mysql;

    constructor(mysql:Mysql){
        this.mysql= mysql;
    }

    async getAllDataByDate(dateStart:any, dateEnd:any, ingenioId:any){
        logger.info('DAO: Method getAllDataByDate Startting');
        let sql=`SELECT * FROM outputs where ingenioid=${ingenioId} and date >= '${dateStart} 00:00:00.000' 
        and date <= '${dateEnd} 23:59:59.000'`;
        logger.info(`sql getAllDataByDate: ${sql}`);
        logger.debug('Dao: Method getAllDataByDate Ending');
        return await this.mysql.query(sql);
    }
}
