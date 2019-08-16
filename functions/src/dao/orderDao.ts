import Mysql from '../utils/mysql';
import * as log4js from 'log4js';

const logger=log4js.getLogger();
logger.level='debug';

export default class OrderDao{
    public mysql: Mysql;

    constructor(mysql: Mysql){
        this.mysql= mysql;
    }

    async saveOrder(object: any) {
        logger.info('Dao: Method saveOrder Startting');
        let sql = `INSERT INTO orders(ingenioid,shippingdate,client,addressid,remissionnumber) 
        VALUES(${object.ingenioId}, '${object.shippingDate}', '${object.client}', 
        ${object.addressid}, ${object.remissionNumber})`;
        let t:any= await this.mysql.query(sql);
        logger.info('Dao: Method saveOrder Ending');
        return t.insertId;
    }

    async getOrder(remissionnumber: number, ingenioid:number){
        logger.info('Dao: Method getOrder Startting');
        let sql = `SELECT id FROM orders WHERE remissionnumber=${remissionnumber} AND ingenioid=${ingenioid}`;
        logger.info('Dao: Method getOrder Ending');
        return await this.mysql.query(sql);
    }

    async deleteOrderById(orderId:string){
        logger.info('DAO: Method deleteOrderById Starting');
        let sql = `DELETE FROM orders WHERE id = ${orderId}`;
        logger.debug('DAO: Method deleteOrderById Ending');
        return await this.mysql.query(sql);
        
    }
    async getOrderById(orderId:any){
        logger.info('DAO: Method getOrderById Startting');
        let sql= `SELECT EXISTS(SELECT * FROM orders WHERE id=${orderId})`;
        let exisis: any= await this.mysql.query(sql);
        logger.debug('DAO: Method getOrderById Ending');
        return exisis[0][`EXISTS(SELECT * FROM orders WHERE id=${orderId})`];
    }
    
    async updateStatus(orderId: any, status:string){
        logger.info('DAO: Method updateStatus Startting');        
        let sql = `update orders set status='${status}' WHERE id=${orderId}`;
        logger.debug('DAO: Method updateStatus Ending');
        return await this.mysql.query(sql);
    }
    async getOrdersByStatus(status:string){
        logger.info('DAO: Method getOrders Startting');
        let sql=`SELECT * FROM orders WHERE status='${status}'`;
        logger.debug('DAO: Method getOrders Ending');
        return await this.mysql.query(sql);
    }

    async orderById(orderId:number){
        logger.info('DAO: Method orderById Startting');
        let sql=`SELECT * FROM orders WHERE id=${orderId}`;
        logger.debug('DAO: Method orderById Ending');
        return await this.mysql.query(sql);
    }

    async getOrdersWareHouse(){
        logger.info('DAO: Method getOrdersWareHouse Startting');
        let sql=`SELECT * FROM orders WHERE isshowed = true`;
        logger.debug('DAO: Method getOrdersWareHouse Ending');
        return await this.mysql.query(sql);
    }
}