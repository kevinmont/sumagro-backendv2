import Mysql from '../utils/mysql';
import * as log4js from 'log4js';
const logger = log4js.getLogger();
logger.level = 'debug';

export default class AddressDao{
    public mysql: Mysql;

    constructor(){
        this.mysql = new Mysql();
    }

    async CreateAddress(address:any){
        logger.info('DAO: Method CreateAddress Starting');
        let sql = `INSERT INTO address(calle,numero,ciudad,localidad,municipio) VALUES(${address.street},${address.number},"${address.city}","${address.location}","${address.municipality}");`;
        logger.debug('DAO: Method CreateAddress Ending');
        return await this.mysql.query(sql);
    }

    async getAddresByAttributes(address:any){
        logger.info('DAO: Method CreateAddress Starting');
        let sql = `SELECT * FROM address WHERE calle = ${address.street} AND numero = ${address.number} AND ciudad = "${address.city}" AND localidad = "${address.location}" AND municipio = "${address.municipality}"`;
        logger.debug('DAO: Method CreateAddress Ending');
        return await this.mysql.query(sql);
    }
}