import Mysql from '../utils/mysql';
import * as log4js from 'log4js';

const logger =log4js.getLogger();
logger.level='debug';

export default class AddressDao{
    public mysql: Mysql;

    constructor(){
        this.mysql= new Mysql();
    }

    // async saveAddress(address:any){
    //     let sql= `INSERT INTO address(localidad) values(${address});`;
    //     return await this.mysql.query(sql);
    // }

    async getAddress(address:any){
        logger.info(`Dao: statting getAdress`);
        logger.info(`Dao: address: ${address}`);

        let sql=`SELECT id FROM address where localidad='${address}'`;
        logger.info(`Dao: ending getAdress`);
        return await this.mysql.query(sql);
    }
}