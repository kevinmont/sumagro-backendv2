import Mysql from '../utils/mysql';
import * as log4js from 'log4js';

const logger=log4js.getLogger();
logger.level='debug';

export default class OrderDao{
    public mysql: Mysql;

    constructor(){
        this.mysql= new Mysql();
    }

    async saveOrder(object: any) {
        logger.info('Dao: Method saveOrder Startting');
        let sql = `INSERT INTO orders(ingenioid,shippingdate,client,addressid,remissionnumber) 
        VALUES(${object.ingenioId}, '${object.shippingDate}', '${object.client}', 
        ${object.addressid}, ${object.remissionNumber})`;
        let t:any= await this.mysql.query(sql);
        logger.info('Dao: Method saveOrder Ending');
            console.log(`t: ${typeof JSON.stringify(t)}`);
            console.log(`t: ${ JSON.stringify(t)}`);
        return t.insertId;
    }

    async getOrder(remissionnumber: number, ingenioid:number){
        logger.info('Dao: Method getOrder Startting');
        let sql = `SELECT id FROM orders WHERE remissionnumber=${remissionnumber} AND ingenioid=${ingenioid}`;
        logger.info('Dao: Method getOrder Ending');
        return await this.mysql.query(sql);
    }
}