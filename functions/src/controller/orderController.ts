import {Request, Response} from 'express';
import OrderDao from '../dao/orderDao';
import * as log4js from 'log4js';
import IngenioDao from '../dao/ingenioDao';
import AddressDao from '../dao/addressDao';
import SubOrdersDao from '../dao/subOrdersDao';
import Order from '../models/Order';

const logger = log4js.getLogger();
logger.level = 'debug';

export default class OrderController{
    public orderDao : OrderDao;
    public ingenioDao: IngenioDao;
   
    public addressDao: AddressDao;
    public subOrdersDao: SubOrdersDao;
    constructor(){
        this.orderDao = new OrderDao();
        this.ingenioDao = new IngenioDao();
        this.addressDao = new AddressDao();
        this.subOrdersDao = new SubOrdersDao();
    } 

    async deleteOrderByOrderId(req:Request, res:Response){
        logger.info('CONTROLLER: method deleteOrderByOrderId Starting');
        if(!req.params.orderId) throw res.status(400).send({msg: 'orderId is required'});
        let orderId:any = req.params.orderId;
        await this.orderDao.deleteOrderById(orderId);
        res.status(200).send({})
        logger.debug('CONTROLLER: method deleteOrderByOrderId Ending');
    }

    async postOrder(req: Request, res: Response) {
        logger.info('CONTROLLER: method postOrder Starting');
        let address = req.body.clientAddress;
        let ingenioid = req.body.ingenioId;
        let subOrders= req.body.subOrders;
        if (!address) throw res.status(400).send({ msg: 'clientAddress is required' });
        if (!subOrders || !subOrders.length) throw res.status(400).send({ msg: 'subOrders is required' });
        if (!ingenioid) throw res.status(400).send({ msg: 'ingenioId is required' });


        let addressid:any = await this.addressDao.getAddress(address);
        logger.info(`address controller: ${addressid[0].id}`);
        if (!addressid[0].id) res.status(404).send('Address not found');

        let object: Order = {
            client: req.body.client,
            addressid: addressid[0].id,
            remissionNumber: req.body.remissionNumber,
            shippingDate: req.body.shippingDate,
            ingenioId: ingenioid
        }

        if (!object.client) throw res.status(400).send({ msg: 'client is required' });
        if (!object.remissionNumber) throw res.status(400).send({ msg: 'remissionNumber is required' });
        if (!object.shippingDate) throw res.status(400).send({ msg: 'shippingDate is required' });


        let resquery: any = await this.ingenioDao.getIngenio(object.ingenioId);
        logger.info(`resquery: ${resquery}`);
        if (!resquery) res.status(404).send(`Ingenio not found`);

        let orderidquery: any = await this.orderDao.saveOrder(object);
        if (orderidquery) {
            await this.subOrdersDao.saveSubOrders(subOrders, orderidquery);
            res.status(201).send();
        } else {
            res.status(404).send(`Order not found`);
        }
        logger.debug('CONTROLLER: method postOrder Ending');
    }

    async getOrder(req:Request, res: Response){
        logger.info('CONTROLLER: Method getOrder Startting');
        if(!req.params.orderId) throw res.status(400).send('{"msg":"orderId is required"}');
        if(!req.query.status) throw res.status(400).send('{"msg":"status is required"}');
        let status= req.query.status;
        let orderId= req.params.orderId;
        let exists = await this.orderDao.getOrderById(orderId);
        if(!exists) throw res.status(404).send('{"msg":"order not found"}');
        await this.orderDao.updateStatus(orderId, status);
        logger.debug('CONTROLLER: Method getOrder Ending');
        res.status(200).send(`{}`);
    }
    
}