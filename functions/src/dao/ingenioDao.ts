import Mysql from '../utils/mysql';
import * as log4js from 'log4js';
const logger = log4js.getLogger();
logger.level = 'debug';

export default class ingenioDao {

    public mysql: Mysql;
    constructor() {
        this.mysql = new Mysql();
    }

    async getIngenio(ingenioId: any) {
        logger.info('Dao:Method getIngenio Startting');
        let sql = `SELECT EXISTS(SELECT id FROM ingenios WHERE id=${ingenioId});`;
        let execution: any = await this.mysql.query(sql);
        logger.debug('Dao: Method getIngenio Ending');
        return execution[0][`EXISTS(SELECT id FROM ingenios WHERE id=${ingenioId})`];
    }

    async deleteIngeniosById(ingenioId:string){
        logger.info('DAO: Method deleteIngeniosById Starting');
        let sql = `DELETE FROM ingenios WHERE id = ${ingenioId}`;
        logger.debug('DAO: Method deleteIngeniosById Ending');
        return await this.mysql.query(sql);
        
    }

    
}
