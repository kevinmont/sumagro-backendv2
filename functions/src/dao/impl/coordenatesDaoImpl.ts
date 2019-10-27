import * as log4js from 'log4js';
import Mysql from "../../utils/mysql";
import { AbstractDao } from "../abstractDao";
import { CoordenatesDao } from "../coordenatesDao";

const logger = log4js.getLogger('sumagro.dao.impl.CoordenatesDao');

export class CoordenatesDaoImpl extends AbstractDao implements CoordenatesDao{

    constructor(db: Mysql){
        super(db)
    }

    async registeringCoordenates(latitud: any, longitud: any) {
        logger.info('DAO: Method registeringCoordenates Startting');
        let sql=`INSERT INTO coordenates(latitud,longitud) values('${latitud}','${longitud}')`;
        let res:any= await this.db.query(sql);
        logger.debug('DAO: Method registeringCoordenates Ending');
        return res.insertId;
    }

    async getCoordenatesById(coordenatesId: any) {
        logger.info('DAO: Method getCoordenatesById Startting');
        let sql= `SELECT * FROM coordenates WHERE id=${coordenatesId}`;
        logger.info('DAO: Method getCoordenatesById Ending');
        return await this.db.query(sql);
    }
   
    async saveCordenate(record: any) {
        logger.info('DAO: Method saveCordenate Starting');
        let sql = `INSERT INTO coordenates(latitud,longitud) 
        VALUES("${record.qrData.latitud}","${record.qrData.longitud}")`;
        logger.debug('DAO: Method saveCordenate Ending');
        return await this.db.query(sql);
    }

    async getCordenate(record: any) {
        logger.info('DAO: Method getCordenate Starting');
        let sql = `SELECT * coordenates FROM WHERE latitud = "${record.qrData.latitud}" AND longitud = "${record.qrData.longitud}"`;
        logger.debug('DAO: Method getCordenate Ending');
        return await this.db.query(sql);
    }
}