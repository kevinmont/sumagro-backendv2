import * as log4js from 'log4js';
import Mysql from '../../utils/mysql';
import { AbstractDao } from '../abstractDao';
import { IngenioDao } from '../ingenioDao';

const logger = log4js.getLogger('sumagro.dao.impl.IngenioDaoImpl');

export class IngenioDaoImpl extends AbstractDao implements IngenioDao{

    constructor(db: Mysql) {
        super(db)
    }

    async getIngenio(ingenioId: any) {
        logger.info('Dao:Method getIngenio Startting');
        let sql = `SELECT EXISTS(SELECT id FROM ingenios WHERE id=${ingenioId});`;
        let execution: any = await this.db.query(sql);
        logger.debug('Dao: Method getIngenio Ending');
        return execution[0][`EXISTS(SELECT id FROM ingenios WHERE id=${ingenioId})`];
    }

    async getIngenioDetails(ingenioId:number){
        logger.info("Dao: Method getIngenioDetails Startting");
        let query = `SELECT * from ingenios where id=${ingenioId}`;
        let response = await this.db.query(query);
        logger.info("Dao: Method getIngenioDetails Ended");
        return response;
    }

    async deleteIngeniosById(ingenioId:string){
        logger.info('DAO: Method deleteIngeniosById Starting');
        let sql = `DELETE FROM ingenios WHERE id = ${ingenioId}`;
        logger.debug('DAO: Method deleteIngeniosById Ending');
        return await this.db.query(sql);
        
    }

    async createIngenio(ingenio:any){
        logger.info('DAO: Method createIngenio Starting');
        let sql = `INSERT INTO ingenios(addressid,email,name) VALUES(${ingenio.addressid},"${ingenio.email}","${ingenio.name}")`;
        logger.debug('DAO: Method createIngenio Ending');
        return await this.db.query(sql);
    }

    async getIngenioByEmail(email:any){
        logger.info('DAO: Method getIngenioByEmail Starting');
        let sql = `SELECT * FROM ingenios WHERE email = "${email}"`;
        logger.debug('DAO: Method getIngenioByEmail Ending');
        return await this.db.query(sql);
    }

    async getIngenioById(ingenioId:any){
        logger.info('DAO: Method getIngenioById Starting');
        let sql = `SELECT * FROM ingenios WHERE id = ${ingenioId}`;
        logger.debug('DAO: Method getIngenioById Ending');
        return await this.db.query(sql);
    }

    async getAllIngenios(params: any =''){
        logger.info('DAO: Method getAllIngenios Stratting');
        let sql = `SELECT * FROM ingenios ${params}`;
        logger.info(`sql: ${sql}`);
        logger.debug('DAO: Method getAllIngenios Ending');
        return await this.db.query(sql);
    }

    async getCountFormule(type:any,ingenioId:number,params:any=''){
        logger.info('DAO: Method getCountFormule Startting');
        let sql=`select description, count(description) AS count
        from ${type} where ingenioid=${ingenioId} group by description ${params}`;
        logger.info(`sql get: ${sql}`);
        logger.debug('DAO: Method getCountFormule Ending');
        return await this.db.query(sql);
    }

    async getDatatable(type:any,ingenioId:number,params:any=''){
        logger.info('DAO: Method getDatatables Startting');
        let sql=`SELECT * FROM ${type} WHERE ingenioid=${ingenioId} ${params}`;
        logger.info(`sql getDataTable: ${sql}`);
        logger.debug('DAO: Method getDatatables Ending');
        return await this.db.query(sql);
    }

    async getListOfIngenios(){
        logger.info("'DAO: Method getListOfIngenios Startting'");
        let query = "SELECT id,name FROM `sumagro-dev`.ingenios";
        logger.info("'DAO: Method getListOfIngenios Ending'");
        return await this.db.query(query);           
    }

    async geListOfOrdersByAlmacen(table:string){
        logger.info("'DAO: Method geListOfOrdersByAlmacen Startting'");
        let query = `SELECT distinct(a.orderid) as id,b.remissionnumber FROM ${table} as a,orders as b where a.orderid=b.id;`;
        logger.info("'DAO: Method geListOfOrdersByAlmacen Ending'");
        return await this.db.query(query);           
    }

    async getDataAplicated(ingenioId:any, params=''){
        logger.info('DAO: Method getDataAplicated Startting');
        let sql=`SELECT * FROM aplicated where ingenioid=${ingenioId} and used = '1' ${params}`;
        logger.info(`sql method getDataAplicated: ${sql}`);
        logger.debug(`DAO: Method getDataAplicated Ending`);
        return await this.db.query(sql);
    }

    async geListOfOrderByIngenio(ingenioId:number){
        logger.info("DAO: Method geListOfOrderByIngenio Starting");
        let query = "Select id,remissionnumber from orders where"+` ingenioid=${ingenioId};`;
        logger.info("DAO: Method geListOfOrderByIngenio Ended");
        return this.db.query(query);
    }

    async getListOfZones(ingenioId:number,type:string){
        logger.info("DAO: Method getListOfZones Starting");
        let query = "Select "+((type=="ejido")?"ejidolocalidad":type)+" from `sumagro-dev`.database where"+` ingenioid=${ingenioId};`;
        console.log("QUERY",query);
        logger.info("DAO: Method getListOfZones Ended");
        return this.db.query(query);
    }
    
    async getListOfClients(){
        logger.info("DAO: Method getListOfClients Starting");
        let query = "Select id,name from ingenios";
        console.log("QUERY",query);
        logger.info("DAO: Method getListOfClients Ended");
        return this.db.query(query);
    }
}
