import Mysql from '../utils/mysql';
import * as log4js from 'log4js';
const logger = log4js.getLogger();
logger.level = 'debug';

export default class ingenioDao {

    public mysql: Mysql;
    constructor(mysql: Mysql) {
        this.mysql = mysql;
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

    async createIngenio(ingenio:any){
        logger.info('DAO: Method createIngenio Starting');
        let sql = `INSERT INTO ingenios(addressid,email,name) VALUES(${ingenio.addressid},"${ingenio.email}","${ingenio.name}")`;
        logger.debug('DAO: Method createIngenio Ending');
        return await this.mysql.query(sql);
    }

    async getIngenioByEmail(email:any){
        logger.info('DAO: Method getIngenioByEmail Starting');
        let sql = `SELECT * FROM ingenios WHERE email = "${email}"`;
        logger.debug('DAO: Method getIngenioByEmail Ending');
        return await this.mysql.query(sql);
    }

    async getIngenioById(ingenioId:any){
        logger.info('DAO: Method getIngenioById Starting');
        let sql = `SELECT * FROM ingenios WHERE id = ${ingenioId}`;
        logger.debug('DAO: Method getIngenioById Ending');
        return await this.mysql.query(sql);
    }

    async getAllIngenios(params: any =''){
        logger.info('DAO: Method getAllIngenios Stratting');
        let sql = `SELECT * FROM ingenios ${params}`;
        logger.info(`sql: ${sql}`);
        logger.debug('DAO: Method getAllIngenios Ending');
        return await this.mysql.query(sql);
    }

    async getCountFormule(type:any,ingenioId:number,params:any=''){
        logger.info('DAO: Method getCountFormule Startting');
        let sql=`select description, count(description) AS count
        from ${type} where ingenioid=${ingenioId} group by description ${params}`;
        logger.info(`sql get: ${sql}`);
        logger.debug('DAO: Method getCountFormule Ending');
        return await this.mysql.query(sql);
    }

    async getDatatable(type:any,ingenioId:number,params:any=''){
        logger.info('DAO: Method getDatatables Startting');
        let sql=`SELECT * FROM ${type} WHERE ingenioid=${ingenioId} ${params}`;
        logger.info(`sql getDataTable: ${sql}`);
        logger.debug('DAO: Method getDatatables Ending');
        return await this.mysql.query(sql);
    }
    
}
