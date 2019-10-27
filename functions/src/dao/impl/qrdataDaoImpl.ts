import * as log4js from 'log4js';
import Mysql from '../../utils/mysql';
import { AbstractDao } from '../abstractDao';
import { QrdataDao } from '../qrdataDao';

const logger = log4js.getLogger('sumagro.dao.impl.QrdataDaoImpl');

export class QrdataDaoImpl extends AbstractDao implements QrdataDao{

    constructor(db: Mysql){
        super(db);
    }

    async registeringQrData(record: any, coordenateId: any){
        logger.info('DAO: Method registeringQrData Startting');
        let sql=`INSERT INTO coordenates(bultos,codigo,fechadeemision,formula,coordenateid,productor,superficie) 
        values(${record.qrData.bultos},'${record.qrData.codigo}', '${new Date()}', '${record.formula}', ${coordenateId},
        '${record.qrData.productor}', '${record.qrData.superficie}')`;
        let res:any= await this.db.query(sql);
        logger.debug('DAO: Method registeringQrData Ending');
        return res.insertId;
    }

    async getQrDataCoordenateId(coordenateid: any){
        logger.info('DAO: Method getQrDataCoordenateId Starting');
        let sql = `SELECT * FROM coordenates where coordenateid id = ${coordenateid}`;
        logger.debug('DAO: Method getQrDataCoordenateId Ending');
        return await this.db.query(sql);
    }
}
