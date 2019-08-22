import Mysql from '../utils/mysql';
import * as log4js from 'log4js';

const logger = log4js.getLogger()
logger.level= 'debug';

export default class QrdataDao{
    public mysql: Mysql;

    constructor(mysql:Mysql){
        this.mysql= mysql;
    }

    async registeringQrData(record:any, coordenateId:any){
        logger.info('DAO: Method registeringQrData Startting');
        let sql=`INSERT INTO coordenates(bultos,codigo,fechadeemision,formula,coordenateid,productor,superficie) 
        values(${record.qrData.bultos},'${record.qrData.codigo}', '${new Date()}', '${record.formula}', ${coordenateId},
        '${record.qrData.productor}', '${record.qrData.superficie}')`;
        let res:any= await this.mysql.query(sql);
        logger.debug('DAO: Method registeringQrData Ending');
        return res.insertId;
    }

    async getQrDataCoordenateId(coordenateid:any){
        logger.info('DAO: Method getQrDataCoordenateId Starting');
        let sql = `SELECT * FROM coordenates where coordenateid id = ${coordenateid}`;
        logger.debug('DAO: Method getQrDataCoordenateId Ending');
        return await this.mysql.query(sql);
    }
}