import { Request, Response } from 'express';
import IngenioDao from '../dao/ingenioDao';
import OrderDao from '../dao/orderDao';
import AddressDao from '../dao/addressDao';
import SubOrdersDao from '../dao/subOrdersDao';
import * as log4js from 'log4js';
import Order from '../models/Order';

const logger = log4js.getLogger();
logger.level = 'debug';

export default class OrderController {

    public ingenioDao: IngenioDao;
    public orderDao: OrderDao;
    public addressDao: AddressDao;
    public subOrdersDao: SubOrdersDao;
    public addressid: any;

    constructor() {
        this.ingenioDao = new IngenioDao();
        this.orderDao = new OrderDao();
        this.addressDao = new AddressDao();
        this.subOrdersDao = new SubOrdersDao();
    }

    async postOrder(req: Request, res: Response) {
        logger.info('CONTROLLER: method postOrder Starting');
        let address = req.body.clientAddress;
        let lengthsub = req.body.subOrders.length;
        let ingenioid = req.body.ingenioId;

        if (!address) throw res.status(400).send({ msg: 'clientAddress is required' });
        if (!lengthsub) throw res.status(400).send({ msg: 'subOrders is required' });
        if (!ingenioid) throw res.status(400).send({ msg: 'ingenioId is required' });


        this.addressid = await this.addressDao.getAddress(address);
        if (!this.addressid) res.status(400).send('Error in parameters');

        let object: Order = {
            client: req.body.client,
            addressid: this.addressid[0].id,
            remissionNumber: req.body.remissionNumber,
            shippingDate: req.body.shippingDate,
            ingenioId: ingenioid
        }

        if (!object.client) throw res.status(400).send({ msg: 'client is required' });
        if (!object.remissionNumber) throw res.status(400).send({ msg: 'ingenioId is required' });
        if (!object.shippingDate) throw res.status(400).send({ msg: 'ingenioId is required' });


        let resquery: any = await this.ingenioDao.getIngenio(object.ingenioId);
        if (resquery < 1) res.status(400).send(`Error in parameters`);

        let orderidquery: any = await this.orderDao.saveOrder(object);
        console.log(`resquery: ${orderidquery}`);

        if (orderidquery) {
            let subOrders: any = {};
            for (let count1 = 0; count1 < lengthsub; count1++) {
                subOrders = {
                    description: req.body.subOrders[count1].description,
                    quantity: req.body.subOrders[count1].quantity,
                    captured: req.body.subOrders[count1].captured,
                    received: req.body.subOrders[count1].received,
                    status: req.body.subOrders[count1].status,
                    orderid: orderidquery
                }
                await this.subOrdersDao.saveSubOrders(subOrders);
            }
            res.status(201).send();
        } else {
            res.status(404).send(`Order not found`);
        }

        logger.debug('CONTROLLER: method postOrder Ending');
    }
}