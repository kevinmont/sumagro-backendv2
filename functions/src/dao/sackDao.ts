import Mysql from '../utils/mysql';
import * as log4js from 'log4js';
const logger = log4js.getLogger();
logger.level = 'debug';

export default class SackDao{
    public mysql: Mysql;

    constructor(mysql: Mysql){
        this.mysql = mysql;
    }

    async saveSackIntrasit(record:any,parseId:number){
        logger.info('DAO: Method saveSackIntrasit Starting');
        let sql = `INSERT INTO sumagrointransit(id,description,ingenioid,operationunit,plates,orderid,operator) 
        VALUES(${parseId},"${record.description}", ${record.ingenioId}, "${record.operationUnit}", 
        "${record.plates}", ${record.orderId}, "${record.operator}")`;
        logger.debug('DAO: Method saveSackIntrasit Ending');
        return await this.mysql.query(sql);
    }

    async saveSackOutputs(record:any,operatorName:any, parseId:number){
        logger.info('DAO: Method saveSackOutputs Starting');
        let sql = `INSERT INTO sumagrooutputs(id,date,description,ingenioid,operator,orderid) 
        VALUES(${parseId},"${new Date()}", "${record.description}", ${record.ingenioId}, 
        "${operatorName}", ${record.orderId})`;
        logger.debug('DAO: Method saveSackOutputs Ending');
        return await this.mysql.query(sql);
    }

    async getSackById(sackId:any){
        logger.info('DAO: Method getSackById Starting');
        let sql = `SELECT * FROM sacksingenio where id = ${sackId}`;
        logger.debug('DAO: Method getSackById Ending');
        return await this.mysql.query(sql);
    }

    async saveSack(record:any){
        logger.info('DAO: Method saveSack Starting');
        let sql = `INSERT INTO sacks(id,description,userid,coordenatesid,clave) 
        VALUES(${record.SackId}, "${record.description}", null, 0, null)`;
        logger.debug('DAO: Method saveSack Ending');
        return await this.mysql.query(sql);
    }

    async saveSackEntrance(entrance:any){
        logger.info('DAO: Method saveSackEntrance Starting');
        let sql = `INSERT INTO entrance(id,date,description,ingenioid,operatorid,orderid) 
        VALUES(${entrance.id}, "${new Date()}", "${entrance.description}", ${entrance.ingenioId}, "${entrance.operatorid}", ${entrance.orderId})`;
        logger.debug('DAO: Method saveSackEntrance Ending');
        return await this.mysql.query(sql);
    }

    async saveSackInventory(inventory:any){
        logger.info('DAO: Method saveSackEntrance Starting');
        let sql = `INSERT INTO intansit(id,ingenioid,description,operator,date) 
        VALUES(${inventory.id}, ${inventory.ingenioId}, "${inventory.description}", "${inventory.operator}", "${new Date()}")`;
        logger.debug('DAO: Method saveSackEntrance Ending');
        return await this.mysql.query(sql);
    }

}
