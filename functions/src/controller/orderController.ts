import { Request, Response } from 'express';
import AddressDao from '../dao/addressDao';
import OrderDao from '../dao/orderDao';
import SubOrdersDao from '../dao/subOrdersDao';
import * as log4js from 'log4js';
import IngenioDao from '../dao/ingenioDao';
import PdfHelper from '../utils/Pdf-Helper';
import * as pdf from 'html-pdf';
import Mysql from '../utils/mysql';

const logger = log4js.getLogger();
logger.level = 'debug';

export default class OrderController {
    public orderDao: OrderDao;
    public ingenioDao: IngenioDao;
    public pdfHelper: PdfHelper;
    public addressDao: AddressDao;
    public subOrdersDao: SubOrdersDao;
    constructor(mysql: Mysql) {
        this.orderDao = new OrderDao(mysql);
        this.ingenioDao = new IngenioDao(mysql);
        this.addressDao = new AddressDao(mysql);
        this.subOrdersDao = new SubOrdersDao(mysql);
        this.pdfHelper = new PdfHelper();
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


        let addressid: any = await this.addressDao.getIdAddresByAttributes(address);
        logger.info(`id address: ${addressid[0].id}`);
        if (!addressid) res.status(400).send('Error in parameters');

        let object: any = {
            client: req.body.client,
            addressid: addressid[0].id,
            remissionNumber: req.body.remissionNumber,
            shippingDate: req.body.shippingDate,
            ingenioId: ingenioid
        }

        if (!object.client) throw res.status(400).send({ msg: 'client is required' });
        if (!object.remissionNumber) throw res.status(400).send({ msg: 'remissionNumber is required' });
        if (!object.shippingDate) throw res.status(400).send({ msg: 'shippingDate is required' });

        logger.info(`ingenioid: ${object.ingenioId}`);
        let resquery: any = await this.ingenioDao.getIngenio(object.ingenioId);
        logger.info(`resquery: ${resquery}`);
        if (!resquery) res.status(400).send(`Error in parameters`);

        let orderidquery: any = await this.orderDao.saveOrder(object);
        logger.info(`orderidquery: ${orderidquery}`);
        if (orderidquery) {
            await this.subOrdersDao.saveSubOrders(subOrders, orderidquery);
            await this.orderDao.updateRemission(object.remissionNumber); 
            res.status(201).send();
        } else {
            res.status(404).send(`Order not found`);
        }
        logger.debug('CONTROLLER: method postOrder Ending');
    }

    async getOrder(req: Request, res: Response) {
        logger.info('CONTROLLER: Method getOrder Startting');
        if (!req.params.orderId) throw res.status(400).send('{"msg":"orderId is required"}');
        let updateRequest = req.body;
        let orderId = req.params.orderId;
        let exists = await this.orderDao.getOrderById(orderId);
        if (!exists) throw res.status(404).send('{"msg":"order not found"}');
        await this.orderDao.updateOrder(orderId, updateRequest);
        logger.debug('CONTROLLER: Method getOrder Ending');
        res.status(200).send(`{}`);
    }

    async getOrders(req: Request, res: Response) {
        logger.info('CONTROLLER: Method getOrders Startting');
        let status = req.query.status;
        let ingenioId:any = req.query.ingenioId;
        let resquery:any;

        if(!ingenioId){
            if(!status)
            resquery = await this.orderDao.getOrdersByStatus();
            else
            resquery = await this.orderDao.getOrdersByStatus(`WHERE status='${status}'`);
        }else{
            if(!status)
            resquery = await this.orderDao.getOrdersByStatus(`where ingenioid=${ingenioId}`);
            else
            resquery = await this.orderDao.getOrdersByStatus(`WHERE status='${status}' AND ingenioid=${ingenioId}`);
        }
         

        let orders: any = [];

        for (let order of resquery) {
            let address: any = await this.addressDao.getAddressById(order.addressid);
            let subOrder: any = await this.subOrdersDao.getsubOrdersById(order.id);
            let sub: any = [];

            subOrder.forEach((i: any) => {
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
                ingenioId:`${order.ingenioid}`,
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

    async getOrderById(req: Request, res: Response) {
        logger.info('CONTROLLER: Method getOrderById Startting');
        let orderId = req.params.orderId;
        if (!orderId) throw res.status(400).send('{ "msg":"orderId is required"}');
        let dataOrder:any = await this.orderDao.orderById(orderId);
        if(!dataOrder[0]) throw res.status(400).send('{ "msg":"orderId not found"}');
        let address: any = await this.addressDao.getAddressById(orderId);
        let subOrder: any = await this.subOrdersDao.getsubOrdersById(orderId);
        let order: any = {};
        let sub: any = [];

        subOrder.forEach((i: any) => {
            sub.push({
                id: `${i.id}`,
                captured: `${i.captured}`,
                description: `${i.description}`,
                quantity: `${i.quantity}`,
                received: `${i.received}`,
                status: `${i.status}`
            })
        });

        order = {
            id: `${dataOrder[0].id}`,
            client: `${dataOrder[0].client}`,
            ingenioId: `${dataOrder[0].ingenioid}`,
            shippingdate: `${dataOrder[0].shippingdate}`,
            dateentrance: `${dataOrder[0].dateentrance}`,
            clientAddress: `${address[0].localidad}`,
            operationUnit: `${dataOrder[0].operationunit}`,
            operator: `${dataOrder[0].operator}`,
            plates: `${dataOrder[0].plates}`,
            remissionNumber: `${dataOrder[0].remissionnumber}`,
            shippingDate: `${dataOrder[0].shippingdate}`,
            status: `${dataOrder[0].status}`,
            subOrders: sub
        }
        logger.debug('CONTROLLER: Method getOrderById Ending');
        res.status(200).send(order);
    }

    async generatePdf(req:any,res:Response){
        logger.info('CONTROLLER: method generatePdf Starting');
        if(!req.params.orderId) throw res.status(400).send("orderId is required");
        let orderId = req.params.orderId;
        let dataOrder:any = await this.orderDao.orderById(orderId);
        if(!dataOrder[0]) throw res.status(400).send('{ "msg":"orderId not found"}');
        let response = parseInt(dataOrder[0].addressid)
        logger.info(response)
        let address: any = await this.addressDao.getAddressById(response);
        let subOrder: any = await this.subOrdersDao.getsubOrdersById(orderId);
        let order: any = {};
        let sub: any = [];

        subOrder.forEach((i: any) => {
            sub.push({
                id: `${i.id}`,
                captured: `${i.captured}`,
                description: `${i.description}`,
                quantity: `${i.quantity}`,
                received: `${i.received}`,
                status: `${i.status}`
            })
        });

        order = {
            id: `${dataOrder[0].id}`,
            client: `${dataOrder[0].client}`,
            shippingdate: `${dataOrder[0].shippingdate}`,
            dateentrance: `${dataOrder[0].dateentrance}`,
            clientAddress: `${address[0].localidad}`,
            operationUnit: `${dataOrder[0].operationunit}`,
            operator: `${dataOrder[0].operator}`,
            plates: `${dataOrder[0].plates}`,
            remissionNumber: `${dataOrder[0].remissionnumber}`,
            shippingDate: `${dataOrder[0].shippingdate}`,
            status: `${dataOrder[0].status}`,
            subOrders: sub
        }
        let report =await this.pdfHelper.getRemissionDocument(order);
        logger.info(report);
        pdf.create(report).toStream((function(err,stream){
                res.writeHead(200, {
                  'Content-Type': 'application/pdf',
                  'responseType': 'blob',
                  'Content-disposition': `attachment; filename=${orderId}.pdf`
              });
              stream.pipe(res);
      }))
    logger.debug('CONTROLLER: method generatePdf Ending');
    }

    async getChargeData(req: any,res: Response){
        logger.info('CONTROLLER: method getChargeData Starting');
        if(!req.params.orderId) throw res.status(400).send("orderId is required");
        let orderId = req.params.orderId;
        let dataOrder:any = await this.orderDao.orderById(orderId);
        if(!dataOrder[0]) throw res.status(400).send('{ "msg":"orderId not found"}');
        let response = parseInt(dataOrder[0].addressid)
        logger.info(response)
        let address: any = await this.addressDao.getAddressById(response);
        let subOrder: any = await this.subOrdersDao.getsubOrdersById(orderId);
        let order: any = {};
        let sub: any = [];

        subOrder.forEach((i: any) => {
            sub.push({
                id: `${i.id}`,
                captured: `${i.captured}`,
                description: `${i.description}`,
                quantity: `${i.quantity}`,
                received: `${i.received}`,
                status: `${i.status}`
            })
        });

        order = {
            id: `${dataOrder[0].id}`,
            client: `${dataOrder[0].client}`,
            shippingdate: `${dataOrder[0].shippingdate}`,
            dateentrance: `${dataOrder[0].dateentrance}`,
            clientAddress: `${address[0].localidad}`,
            operationUnit: `${dataOrder[0].operationunit}`,
            operator: `${dataOrder[0].operator}`,
            plates: `${dataOrder[0].plates}`,
            remissionNumber: `${dataOrder[0].remissionnumber}`,
            shippingDate: `${dataOrder[0].shippingdate}`,
            status: `${dataOrder[0].status}`,
            modelunit : `${dataOrder[0].modelunit}`,
            mark : `${dataOrder[0].mark}`,
            subOrders: sub
        }
        let chargeData =await this.pdfHelper.getChargeFormat(order);
        logger.info(chargeData);
        pdf.create(chargeData,{ format: 'Letter',border: {
            top: "1in",            // default is 0, units: mm, cm, in, px
            right: "0in",
            bottom: "1in",
            left: "0in"
          } }).toStream((function(err,stream){
            res.writeHead(200, {
              'Content-Type': 'application/pdf',
              'Content-disposition': `attachment; filename=SUMAGRO.pdf`
          });
          stream.pipe(res);
        }))
        logger.debug('CONTROLLER: method getChargeData Ending');
    }

    async getStatusOrder(req: Request,res: Response){
        logger.info('CONTROLLER: method getStatusOrder Starting');
        let orderId = req.params.orderId;
        if(!orderId) throw res.status(400).send('orderId is required');
        let data:any = await this.orderDao.orderById(orderId);
        if(!data.length) { throw res.status(404).send('order not found'); }
        let status = {
            status: data[0].status
        };
        res.status(200).send(status);
        logger.debug('CONTROLLER: method getStatusOrder Ending');
    }

    async warehouseOrders(req:Request,res:Response){
        logger.info('CONTROLLER: method warehouseOrders Starting');
        let resquery:any = await this.orderDao.getOrdersWareHouse();
        let orders: any = [];

        for (let order of resquery) {
            let address: any = await this.addressDao.getAddressById(order.addressid);
            let subOrder: any = await this.subOrdersDao.getsubOrdersById(order.id);
            let sub: any = [];

            subOrder.forEach((i: any) => {
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
                client: `${order.client}`,
                clientAddress: `${address[0].localidad}`,
                dateEntrance: `${order.dateentrance}`,
                dateOutput: `${order.dateoutput}`,
                shippingdate: `${order.shippingdate}`,
                flet: `${order.flet}`,
                id: `${order.id}`,
                ingenioId: `${order.ingenioid}`,
                isShowed: `${order.isshowed}`,
                mark: `${order.mark}`,
                modelUnit: `${order.modelunit}`,
                operationUnit: `${order.operationunit}`,
                operator: `${order.operator}`,
                plates: `${order.plates}`,
                remissionNumber: `${order.remissionnumber}`,
                shippingDate: `${order.shippingdate}`,
                status: `${order.status}`,
                subOrders: sub
            })
        }
        logger.debug('CONTROLLER: method warehouseOrders Ending');
        res.status(200).send(orders);
    }

    async getRemissionNumber(req: Request,res: Response){
        logger.info('CONTROLLER: method getRemissionNumber Starting');
        let response:any = await this.orderDao.getRemissionNumber();
        logger.debug('CONTROLLER: method getRemissionNumber Ending');
        res.status(200).send({currentRemissionNumber: response[0].count});
    }

    async getOrdersByIngenio(req:Request,res:Response){
        let ingenioId = req.params.ingenioId;
        let status = req.params.status;
        let data = await this.orderDao.getOrdersByIngenio(ingenioId,status);

        res.status(200).send(data);
    }

}