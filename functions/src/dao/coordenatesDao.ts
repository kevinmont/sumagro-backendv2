import Mysql from '../utils/mysql';
import * as log4js from 'log4js';

const logger = log4js.getLogger()
logger.level= 'debug';

export default class CoordenatesDao{
    public mysql: Mysql;

    constructor(){
        this.mysql= new Mysql();
    }

    async registeringCoordenates(latitud:any, longitud:any){
        logger.info('DAO: Method registeringCoordenates Startting');
        let sql=`INSERT INTO coordenates(latitud,longitud) values('${latitud}','${longitud}')`;
        let res:any= await this.mysql.query(sql);
        logger.debug('DAO: Method registeringCoordenates Ending');
        return res.insertId;
    }
}