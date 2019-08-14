import Mysql from '../utils/mysql';
import * as log4js from 'log4js';
const logger = log4js.getLogger();
logger.level = 'debug';

export default class SackDao{
    public mysql: Mysql;

    constructor(){
        this.mysql = new Mysql();
    }

    async saveSackIntrasit(record:any){
        logger.info('DAO: Method saveSackIntrasit Starting');
        let sql = `INSERT INTO sumagrointransit(description,ingenioid,operationunit,plates,orderid,operator) 
        VALUES("${record.description}", ${record.ingenioId}, "${record.operationUnit}", 
        "${record.plates}", ${record.orderId}, "${record.operator}")`;
        logger.debug('DAO: Method saveSackIntrasit Ending');
        return await this.mysql.query(sql);
    }

    async saveSackOutputs(record:any,operatorName:any){
        logger.info('DAO: Method saveSackOutputs Starting');
        let sql = `INSERT INTO sumagrooutputs(date,description,ingenioid,operator,orderid) 
        VALUES("${new Date()}", "${record.description}", ${record.ingenioId}, 
        "${operatorName}", ${record.orderId})`;
        logger.debug('DAO: Method saveSackOutputs Ending');
        return await this.mysql.query(sql);
    }

    async getSackById(sackId:any){
        logger.info('DAO: Method getSackById Starting');
        let sql = `SELECT * FROM sacksingenio where id = "${sackId}"`;
        logger.debug('DAO: Method getSackById Ending');
        return await this.mysql.query(sql);
    }

}
