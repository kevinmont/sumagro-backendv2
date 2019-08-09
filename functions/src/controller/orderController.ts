import { Request, Response } from 'express';
import OrderDao from '../dao/orderDao';
import * as log4js from 'log4js';
import IngenioDao from '../dao/ingenioDao';
import AddressDao from '../dao/addressDao';
import SubOrdersDao from '../dao/subOrdersDao';
import Order from '../models/Order';

const logger = log4js.getLogger();
logger.level = 'debug';

export default class OrderController {
    public orderDao: OrderDao;
    public ingenioDao: IngenioDao;

    public addressDao: AddressDao;
    public subOrdersDao: SubOrdersDao;
    constructor() {
        this.orderDao = new OrderDao();
        this.ingenioDao = new IngenioDao();
        this.addressDao = new AddressDao();
        this.subOrdersDao = new SubOrdersDao();
    }

    async deleteOrderByOrderId(req: Request, res: Response) {
        logger.info('CONTROLLER: method deleteOrderByOrderId Starting');
        if (!req.params.orderId) throw res.status(400).send({ msg: 'orderId is required' });
        let orderId: any = req.params.orderId;
        await this.orderDao.deleteOrderById(orderId);
        res.status(200).send({})
        logger.debug('CONTROLLER: method deleteOrderByOrderId Ending');
    }

    async postOrder(req: Request, res: Response) {
        logger.info('CONTROLLER: method postOrder Starting');
        let address = req.body.clientAddress;
        let ingenioid = req.body.ingenioId;
        let subOrders = req.body.subOrders;
        if (!address) throw res.status(400).send({ msg: 'clientAddress is required' });
        if (!subOrders || !subOrders.length) throw res.status(400).send({ msg: 'subOrders is required' });
        if (!ingenioid) throw res.status(400).send({ msg: 'ingenioId is required' });


        let addressid: any = await this.addressDao.getAddress(address);
        if (!addressid) res.status(400).send('Error in parameters');

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
        if (!resquery) res.status(400).send(`Error in parameters`);

        let orderidquery: any = await this.orderDao.saveOrder(object);
        if (orderidquery) {
            await this.subOrdersDao.saveSubOrders(subOrders, orderidquery);
            res.status(201).send();
        } else {
            res.status(404).send(`Order not found`);
        }
        logger.debug('CONTROLLER: method postOrder Ending');
    }

    async getOrder(req: Request, res: Response) {
        logger.info('CONTROLLER: Method getOrder Startting');
        if (!req.params.orderId) throw res.status(400).send('{"msg":"orderId is required"}');
        if (!req.query.status) throw res.status(400).send('{"msg":"status is required"}');
        let status = req.query.status;
        let orderId = req.params.orderId;
        let exists = await this.orderDao.getOrderById(orderId);
        if (!exists) throw res.status(404).send('{"msg":"order not found"}');
        await this.orderDao.updateStatus(orderId, status);
        logger.debug('CONTROLLER: Method getOrder Ending');
        res.status(200).send(`{}`);
    }

    async getOrders(req: Request, res: Response) {
        logger.info('CONTROLLER: Method getOrders Startting');
        let status = req.query.status;
        if (!status) throw res.status(400).send('status is required');
        let resquery: any = await this.orderDao.getOrdersByStatus(status);
        let orders: any = [];
        
        for(let order of resquery){
           let address:any = await this.addressDao.getAddressById(order.addressid);
            let subOrder:any = await this.subOrdersDao.getsubOrdersById(order.id);
            let sub: any =[];
           
            subOrder.forEach((i:any) => {
                sub.push({
                    id: `${i.id}`,
                    captured: `${i.captured}`,
                    description: `${i.description}`,
                    quantity: `${i.quantity}`,
                    received: `${i.received}`,
                    status: `${i.status}`
                    });    
               });

            orders.push({
                id: `${order.id}`,
                client: `${order.client}`,
                shippingdate: `${order.shippingdate}`,
                dateentrance: `${order.dateentrance}`,
                clientAddress: `${address[0].localidad}`,
                operationUnit: `${order.operationunit}`,
                operator: `${order.operator}`,
                plates: `${order.plates}`,
                remissionNumber: `${order.remissionnumber}`,
                shippingDate: `${order.shippingdate}`,
                status: `${order.status}`,
                subOrders: sub
            })
        }
        logger.debug('CONTROLLER: Method getOrders Ending');
        res.status(200).send(orders);
    }
}