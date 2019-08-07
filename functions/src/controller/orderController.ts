import {Request, Response} from 'express';
import OrderDao from '../dao/orderDao';
import * as log4js from 'log4js';
const logger = log4js.getLogger();
logger.level = 'debug';

export default class OrderController{
    public orderDao : OrderDao;
    constructor(){
        this.orderDao = new OrderDao();
    } 

    async deleteOrderByOrderId(req:Request, res:Response){
        logger.info('CONTROLLER: method deleteOrderByOrderId Starting');
        if(!req.params.orderId) throw res.status(400).send({msg: 'orderId is required'});
        let orderId:any = req.params.orderId;
        await this.orderDao.deleteOrderById(orderId);
        res.status(200).send({})
        logger.debug('CONTROLLER: method deleteOrderByOrderId Ending');
    }

    
}