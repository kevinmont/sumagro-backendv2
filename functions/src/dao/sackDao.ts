import Mysql from '../utils/mysql';
import * as log4js from 'log4js';
const logger = log4js.getLogger();
logger.level = 'debug';

export default class SackDao{
    public mysql: Mysql;

    constructor(mysql: Mysql){
        this.mysql = mysql;
    }

    async saveSackIntrasit(record:any,operatorName:string,parseId:number){
        logger.info('DAO: Method saveSackIntrasit Starting');
        let sql = `INSERT INTO sumagrointransit(id,description,ingenioid,operationunit,plates,orderid,operator,date) 
        VALUES(${parseId},"${record.description}", ${record.ingenioId}, "${record.operationUnit}", 
        "${record.plates}", ${record.orderId}, "${operatorName}","${record.date}")`;
        logger.debug('DAO: Method saveSackIntrasit Ending');
        return await this.mysql.query(sql);
    }

    async delIntransit(sackId:number){
        logger.info('DAO: Method saveSackIntrasit Starting');
        let sql = `DELETE FROM sumagrointransit where id=${sackId}`;
        logger.debug('DAO: Method saveSackIntrasit Ending');
        return await this.mysql.query(sql);
    }

    async saveSackOutputs(record:any,operatorName:any, parseId:number){
        logger.info('DAO: Method saveSackOutputs Starting');
        let sql = `INSERT INTO sumagrooutputs(id,date,description,ingenioid,operator,orderid) 
        VALUES(${parseId},"${record.date}", "${record.description}", ${record.ingenioId}, 
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
        VALUES(${record.SackId}, "${record.description}", null, null, null)`;
        logger.debug('DAO: Method saveSack Ending');
        return await this.mysql.query(sql);
    }

    async saveSackEntrance(entrance:any){
        logger.info('DAO: Method saveSackEntrance Starting');
        let sql = `INSERT INTO entrance(id,date,description,ingenioid,operatorid,orderid) 
        VALUES(${entrance.id}, "${entrance.date}", "${entrance.description}", ${entrance.ingenioId}, "${entrance.operatorid}", ${entrance.orderId})`;
        logger.debug('DAO: Method saveSackEntrance Ending');
        return await this.mysql.query(sql);
    }

    async saveSackInventory(inventory:any){
        logger.info('DAO: Method saveSackEntrance Starting');
        let sql = `INSERT INTO inventory(id,ingenioid,description,operator,date) 
        VALUES(${inventory.id}, ${inventory.ingenioId}, "${inventory.description}", "${inventory.operator}", "${inventory.date}")`;
        logger.debug('DAO: Method saveSackEntrance Ending');
        return await this.mysql.query(sql);
    }

    async deleteInventory(inventoryId: any){
        logger.info(`Dao: Method deleteInventory Startting`);
        let sql= `DELETE FROM inventory WHERE id=${inventoryId}`;
        logger.debug(`Dao: Method deleteInventory Ending`);
        return await this.mysql.query(sql);
    }

    async getIds(ingenioId:number,table:string,producto:string,page:number,peer_page:number){

        logger.info(`Dao: Method getIds Startting`);
        let sql="";
        if(ingenioId!=-1){
        sql= `select id from ${table}  WHERE ingenioid=${ingenioId} and description='${producto}' LIMIT ${peer_page} OFFSET ${page};`;
        }else{
            sql= `select id from ${table}  WHERE and description='${producto}' LIMIT ${peer_page} OFFSET ${page};`;
        }
        logger.debug(`Dao: Method getIds Ending`);
        return await this.mysql.query(sql);
    }


}
