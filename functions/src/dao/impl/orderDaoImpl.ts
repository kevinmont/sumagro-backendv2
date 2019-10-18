import { AbstractDao } from "../abstractDao";
import Mysql from "../../utils/mysql";
import { OrderDao } from "../orderDao";
import * as log4js from "log4js";

const logger = log4js.getLogger("sumagro.dao.impl.OrderDaoImpl");

export class OrderDaoImpl extends AbstractDao implements OrderDao{

    constructor(db: Mysql){
        super(db);
    }

    async saveOrder(object: any) {
        logger.info('Dao: Method saveOrder Startting');
        let sql = `INSERT INTO orders(ingenioid,shippingdate,client,addressid,remissionnumber,status,isshowed) 
        VALUES(${object.ingenioId}, '${object.shippingDate}', '${object.client}', 
        ${object.addressid}, ${object.remissionNumber},'PENDING','0')`;
        let t:any= await this.db.query(sql);
        logger.info('Dao: Method saveOrder Ending');
        return t.insertId;
    }

    async getOrder(remissionnumber: number, ingenioid: number){
        logger.info('Dao: Method getOrder Startting');
        let sql = `SELECT id FROM orders WHERE remissionnumber=${remissionnumber} AND ingenioid=${ingenioid}`;
        logger.info('Dao: Method getOrder Ending');
        return await this.db.query(sql);
    }

    async deleteOrderById(orderId: string){
        logger.info('DAO: Method deleteOrderById Starting');
        let sql = `DELETE FROM orders WHERE id = ${orderId}`;
        logger.debug('DAO: Method deleteOrderById Ending');
        return await this.db.query(sql);
        
    }
    async getOrderById(orderId: any){
        logger.info('DAO: Method getOrderById Startting');
        let sql= `SELECT EXISTS(SELECT * FROM orders WHERE id=${orderId})`;
        let exisis: any= await this.db.query(sql);
        logger.debug('DAO: Method getOrderById Ending');
        return exisis[0][`EXISTS(SELECT * FROM orders WHERE id=${orderId})`];
    }
    
    async updateStatus(orderId: any, status: string){
        logger.info('DAO: Method updateStatus Startting');        
        let sql = `update orders set status='${status}' WHERE id=${orderId}`;
        logger.debug('DAO: Method updateStatus Ending');
        return await this.db.query(sql);
    }
    async getOrdersByStatus(params: string=''){
        logger.info('DAO: Method getOrders Startting');
        let sql=`SELECT * FROM orders ${params}`;
        logger.debug('DAO: Method getOrders Ending');
        return await this.db.query(sql);
    }

    async orderById(orderId: number){
        logger.info('DAO: Method orderById Startting');
        let sql=`SELECT * FROM orders WHERE id=${orderId}`;
        logger.debug('DAO: Method orderById Ending');
        return await this.db.query(sql);
    }

    async getOrdersWareHouse(){
        logger.info('DAO: Method getOrdersWareHouse Startting');
        let sql=`SELECT * FROM orders WHERE isshowed = '0'`;
        logger.debug('DAO: Method getOrdersWareHouse Ending');
        return await this.db.query(sql);
    }

    async getRemissionNumber(){
        logger.info('DAO: Method getRemissionNumber Startting');
        let sql=`SELECT * FROM remissions`;
        logger.debug('DAO: Method getRemissionNumber Ending');
        return await this.db.query(sql);
    }

    async updateOrderByOrderIdAndIngenioId(orderId: string, ingenioId: string, objectRequest: any){
        logger.info('DAO: Method updateOrderByOrderIdAndIngenioId Startting');
        let sql = `update orders set status='${objectRequest.status}' WHERE id=${orderId} AND ingenioid= ${ingenioId}`;
        logger.debug('DAO: Method updateOrderByOrderIdAndIngenioId Ending');
        return await this.db.query(sql);
    }

    async updateOrder(orderId: string, updateRequest: any){
        logger.info('DAO: Method updateOrder Startting');
        let sql = `update orders set operationunit='${updateRequest.operationUnit}',
        plates='${updateRequest.plates}',
        operator='${updateRequest.operator}',
        flet='${updateRequest.flet}',
        plates='${updateRequest.plates}',
        modelunit='${updateRequest.modelUnit}',
        mark='${updateRequest.mark}',
        dateoutput='${updateRequest.dateOutput}',
        dateentrance='${updateRequest.dateEntrance}' WHERE id=${orderId}`;
        logger.debug('DAO: Method updateOrder Ending');
        return await this.db.query(sql);
    }
    async updateRemission(remissionNumber: number){
        logger.info(`DAO: updateRemission Startting`);
        let sql=`update remissions set count=${remissionNumber +1} where count=${remissionNumber}`;
        logger.debug(`DAO: updateRemission ending`);
        return await this.db.query(sql);
    }

    async getOrdersByIngenio(ingenioId: any, status: any){
        logger.info(`DAO: getOrdersByIngenio Startting`);
        let sql=`SELECT * FROM orders WHERE ingenioid = ${ingenioId} AND status = '${status}'`;
        logger.debug(`DAO: getOrdersByIngenio ending`);
        return await this.db.query(sql);
    }

}