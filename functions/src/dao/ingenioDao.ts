import Mysql from '../utils/mysql';
import * as log4js from 'log4js';
const logger = log4js.getLogger();
logger.level = 'debug';

export default class IngenioDao{
    public mysql: Mysql;

    constructor(){
        this.mysql = new Mysql();
    }

    async deleteIngeniosById(ingenioId:string){
        logger.info('DAO: Method deleteIngeniosById Starting');
        let sql = `DELETE FROM ingenios WHERE id = ${ingenioId}`;
        logger.debug('DAO: Method deleteIngeniosById Ending');
        return await this.mysql.query(sql);
        
    }

    
}