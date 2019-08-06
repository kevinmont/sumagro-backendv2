import Mysql from '../utils/mysql';
import * as log4js from 'log4js';

const logger = log4js.getLogger();
logger.level='debug';

export default class UserDao{
    public mysql: Mysql;

    constructor(){
        this.mysql= new Mysql();
    }

    async getUser(userId:any){
        logger.info(`Dao: Method getUser startting`);
        let sql= `SELECT EXISTS(SELECT * FROM users WHERE id='${userId}')`;
        let execution: any= await this.mysql.query(sql);

         let count= execution[0][`EXISTS(SELECT id FROM ingenios WHERE id=${userId})`];
         logger.debug(`Dao: Method getUser Ending`);
        (count < 1)?  false : true; 
    }

    async deleteUser(userId: any){
        logger.info(`Dao: Method deleteUser Startting`);
        let sql= `DELETE FROM users WHERE id='${userId}'`;
        logger.debug(`Dao: Method deleteUsers Ending`);
        return await this.mysql.query(sql);
    }

}
