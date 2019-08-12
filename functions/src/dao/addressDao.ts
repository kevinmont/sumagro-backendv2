import Mysql from '../utils/mysql';
import * as log4js from 'log4js';
const logger =log4js.getLogger();
logger.level='debug';

export default class AddressDao{
    public mysql: Mysql;

    constructor(){
        this.mysql= new Mysql();
    }

    async getAddress(address:any){
        logger.info(`Dao: statting getAdress`);
        logger.info(`Dao: address: ${address}`);
        let sql=`SELECT id FROM address where localidad='${address}'`;
        logger.info(`Dao: ending getAdress`);
        return await this.mysql.query(sql);
    }

    async getLocalidadAddressById(addressId: number){
        logger.info('DAO:Method getLocalidadAddressById Startting');
        let sql= `SELECT localidad FROM address WHERE id=${addressId}`;
        logger.debug('DAO: Method getLocalidadAddressById Ending');
        return await this.mysql.query(sql);
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
    async getAddressById(addressId:number){
        logger.info('DAO: Method getAddressById Starting');
        let sql= `SELECT * FROM address WHERE id= ${addressId}`;
        logger.debug('DAO: Method getAddressById Ending');
    return await this.mysql.query(sql);
    }
}