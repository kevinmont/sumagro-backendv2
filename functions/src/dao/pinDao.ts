
import Mysql from '../utils/mysql';
import * as log4js from 'log4js';
const logger = log4js.getLogger();
logger.level = 'debug';

export default class PinDao{
    public mysql: Mysql;
    constructor(){
        this.mysql = new Mysql();
    }

    async getPin(){
        logger.info('DAO: Method getpin Startting');
        let sql = `SELECT * from pin`;
        logger.debug('DAO: Method getPin Ending');
        return await this.mysql.query(sql); 
        
    }

    
}