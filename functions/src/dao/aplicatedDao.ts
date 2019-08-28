import Mysql from '../utils/mysql';
import * as log4js from 'log4js';

const logger = log4js.getLogger()
logger.level= 'debug';

export default class AplicatedDao{
    public mysql: Mysql;

    constructor(mysql:Mysql){
        this.mysql= mysql;
    }

    async getAplicatedByOperator(operator: string){
        logger.info('DAO: Method getAplicatedByOperator Startting');
        let sql= `SELECT * FROM aplicated WHERE operator='${operator}'`;
        logger.info('DAO: Method getAplicatedByOperator Ending');
        return await this.mysql.query(sql);
    }

    async saveAplicated(record:any,coordenateId:any){
        logger.info('DAO: Method saveAplicated Starting');
        let sql = `INSERT INTO aplicated(id,coordenatesid,description,inplot,used,dateaplicated,ingenioid,operator) 
        VALUES(${record.id}, ${coordenateId}, "${record.description}", 0, 0, 
        "${new Date()}", ${record.ingenioId}, ${record.operator})`;
        logger.debug('DAO: Method saveAplicated Ending');
        return await this.mysql.query(sql);
    }
}