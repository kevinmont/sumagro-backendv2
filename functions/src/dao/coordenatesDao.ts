import Mysql from '../utils/mysql';
import * as log4js from 'log4js';

const logger = log4js.getLogger()
logger.level= 'debug';

export default class CoordenatesDao{
    public mysql: Mysql;

    constructor(mysql:Mysql){
        this.mysql= mysql;
    }

    async registeringCoordenates(latitud:any, longitud:any){
        logger.info('DAO: Method registeringCoordenates Startting');
        let sql=`INSERT INTO coordenates(latitud,longitud) values('${latitud}','${longitud}')`;
        let res:any= await this.mysql.query(sql);
        logger.debug('DAO: Method registeringCoordenates Ending');
        return res.insertId;
    }

    async getCoordenatesById(coordenatesId: any){
        logger.info('DAO: Method getCoordenatesById Startting');
        let sql= `SELECT * FROM coordenates WHERE id=${coordenatesId}`;
        logger.info('DAO: Method getCoordenatesById Ending');
        return await this.mysql.query(sql);
    }
   
    async saveCordenate(record:any){
        logger.info('DAO: Method saveCordenate Starting');
        let sql = `INSERT INTO coordenates(latitud,longitud) 
        VALUES("${record.qrData.latitud}","${record.qrData.longitud}")`;
        logger.debug('DAO: Method saveCordenate Ending');
        return await this.mysql.query(sql);
    }

    async getCordenate(record:any){
        logger.info('DAO: Method getCordenate Starting');
        let sql = `SELECT * coordenates FROM WHERE latitud = "${record.qrData.latitud}" AND longitud = "${record.qrData.longitud}"`;
        logger.debug('DAO: Method getCordenate Ending');
        return await this.mysql.query(sql);
    }
}