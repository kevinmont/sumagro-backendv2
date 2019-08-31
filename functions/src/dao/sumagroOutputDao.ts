import Mysql from '../utils/mysql';
import * as log4js from 'log4js';
const logger=log4js.getLogger();
logger.level= 'debug';

export default class SumagroOutputDao{
    public mysql:Mysql;

    constructor(mysql:Mysql){
        this.mysql=mysql;
    }

    async getAllDataOutputs(){
        logger.info('DAO: Method getAllDataOutputs Startting');
        let sql=`select * from sumagrooutputs`;
        logger.debug('DAO: Method getAllDataOutputs Ending');
        return await this.mysql.query(sql);
    }

    async saveOutputs(record:any,operatorName:any){
        logger.info('DAO: Method saveOutputs Starting');
        let sql = `INSERT INTO outputs(id,description,operator,userid,ingenioid) 
        VALUES(${record.id}, "${record.description}", "${operatorName}", 
        "${record.userId}", ${record.ingenioId})`;
        logger.debug('DAO: Method saveOutputs Ending');
        return await this.mysql.query(sql);
    }

    async getAllDataByDate(dateStart:any, dateEnd:any){
        logger.info('DAO: Method getAllDataByDate Startting');
        let sql=`SELECT * FROM outputs where date >= '${dateStart}T00:00:00.000Z' 
        and date <= '${dateEnd}T23:59:59.000Z'`;
        logger.info(`sql getAllDataByDate: ${sql}`);
        logger.debug('Dao: Method getAllDataByDate Ending');
        return await this.mysql.query(sql);
    }
}