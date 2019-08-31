//import Dao's
import AddressDao from '../dao/addressDao';
import OrderDao from '../dao/orderDao';
import InventoryDao from '../dao/inventoryDao';
import AplicatedDao from '../dao/aplicatedDao';
import SubOrdersDao from '../dao/subOrdersDao';
import IngenioDao from '../dao/ingenioDao';
import SumagroIntransit from '../dao/intransitDao';

import sumagroOutputDao from '../dao/sumagroOutputDao';
import OutputDao from '../dao/outputDao';
import EntranceDao from '../dao/entranceDao';
import IntransitDao from '../dao/intransitDao';


//import models
import {arrtypes, types} from '../models/ingenio';
import {TYPEINGENIO} from '../models/Order';

//import helpers
import PdfHelper from '../utils/Pdf-Helper';
import * as pdf from 'html-pdf';

// import dependencies
import { Request, Response } from 'express';
import Mysql from '../utils/mysql';
import * as log4js from 'log4js';



const logger = log4js.getLogger();
logger.level = 'debug';

export default class OrderController {
    public intransitDao: IntransitDao;
    public outputDao: OutputDao; 
    public aplicatedDao: AplicatedDao;
    public orderDao: OrderDao;
    public ingenioDao: IngenioDao;
    public pdfHelper: PdfHelper;
    public addressDao: AddressDao;
    public inventoryDao: InventoryDao;
    public subOrdersDao: SubOrdersDao;
    public sumagroIntransit: SumagroIntransit;
    public sumagroOutputDao: sumagroOutputDao;
    public entranceDao:EntranceDao;
    constructor(mysql: Mysql) {
        this.intransitDao= new IntransitDao(mysql);
        this.outputDao= new OutputDao(mysql);
        this.entranceDao= new EntranceDao(mysql);
        this.aplicatedDao= new AplicatedDao(mysql);
        this.sumagroOutputDao=new sumagroOutputDao(mysql);
        this.sumagroIntransit= new SumagroIntransit(mysql);
        this.orderDao = new OrderDao(mysql);
        this.ingenioDao = new IngenioDao(mysql);
        this.addressDao = new AddressDao(mysql);
        this.subOrdersDao = new SubOrdersDao(mysql);
        this.inventoryDao= new InventoryDao(mysql);
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
        let type:any;
        let dateStart:any;
        let dateEnd:any;
        let ingenioId:any = req.query.ingenioId;
        let resquery:any;
        logger.info(`typo: ${req.query.type}`);
        logger.info(`fechaInicio: ${req.query.dateStart}`);
        logger.info(`fechaFin: ${req.query.dateEnd}`);

        if(arrtypes.includes(req.query.type)){
            if(!req.query.dateStart) return res.status(400).send(`DateStart is required`);
            if(!req.query.dateEnd) return res.status(400).send(`DateEnd is required`);
           
            if(!(req.query.dateStart <= req.query.dateEnd)) return res.status(400).send(`dateStart is greater than dateEnd`); 
            dateStart = req.query.dateStart;
            dateEnd = req.query.dateEnd;
            type = req.query.type;
            
            if(type == types.inventory){
                if (!ingenioId) throw res.status(400).send({ msg: 'ingenioId is required' });
                logger.info(`entro al inventario`);
                let dataInventory = await this.inventoryDao.getdatainventoryByDate(dateStart, dateEnd, ingenioId);
                logger.info(`datos: ${dataInventory}`);
                return res.status(200).send(dataInventory);
            }else if(type == types.aplicated){
                if (!ingenioId) throw res.status(400).send({ msg: 'ingenioId is required' });
                logger.info(`entro a aplicados`);
                let dataAplicates = await this.aplicatedDao.getdataaplicatedByDate(dateStart, dateEnd, ingenioId);
                logger.info(`datos: ${dataAplicates}`);
                return res.status(200).send(dataAplicates);
            }else if(type == types.entrance){
                if (!ingenioId) throw res.status(400).send({ msg: 'ingenioId is required' });
                logger.info(`entro a entrance`);
                let orders:any= await this.entranceDao.getAllDataByDate(ingenioId, dateStart, dateEnd);
                let incrementable:any=[];
                for(let element of orders){
                    let im:any = await this.orderDao.orderById(+ element.orderid)
                    logger.info(im[0]);
                    incrementable.push(im[0]);
                }
                resquery=incrementable;
            }else if(type == types.outputs){
                if(!ingenioId){
                    logger.info(`entro a salidas sin ingenio`);
                    let outputs:any= await this.sumagroOutputDao.getAllDataByDate(dateStart, dateEnd);
                    return res.status(200).send(outputs);
                }else{
                    logger.info(`entro a salidas con ingenio`);
                    let outputs:any= await this.outputDao.getAllDataByDateByIngenio(dateStart, dateEnd, ingenioId);
                    return res.status(200).send(outputs);
                }
            } else if(type == types.intransit){
                if(!ingenioId){
                    logger.info(`entro a en transito sin ingenioId`);
                    let intransit= await this.intransitDao.getAllDataByDateSumagro(dateStart, dateEnd);
                    return res.status(200).send(intransit);
                }else {
                    logger.info(`entro a en transito`);
                    let intransit= await this.intransitDao.getAllDataByDate(dateStart, dateEnd, ingenioId);
                    return res.status(200).send(intransit);
                }
            }else{  
                return res.status(200).send([]);
            }
        }else{
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
        return res.status(200).send(orders);
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
            dateoutput: dataOrder[0].dateoutput,
            clientAddress: `${address[0].localidad}`,
            flet: dataOrder[0].flet,
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

    async outputs(req:Request, res:Response){
        logger.info('CONTROLLER: Method outputs Startting');
        let data:any=await this.sumagroOutputDao.getAllDataOutputs();
        let response:any=[];
        for(let element of data){
            let ingenio:any = await this.ingenioDao.getIngenioById(element.ingenioid)
            response.push({
                id:`${element.id}`,
                date: `${element.date}`,
                ingenioName:`${ingenio[0].name}`,
                description:`${element.description}`,
                operator:`${element.operator}`,
                orderId:`${element.orderid}`,
            });
        }
        logger.debug('CONTROLLER: Method outputs Ending');
        res.status(200).send(response);
    }

    async intransit(req:Request,res:Response){
        logger.info('CONTROLLER: Method intransit Startting');
        let data:any = await this.sumagroIntransit.getalldataIntransit();
        let response:any=[];
        for(let element of data){
            let ingenio:any = await this.ingenioDao.getIngenioById(element.ingenioid)
            response.push({
                id:`${element.id}`,
                description: `${element.description}`,
                ingenioName:`${ingenio[0].name}`,
                operationUnit:`${element.operationunit}`,
                plates:`${element.plates}`,
                orderId:`${element.orderid}`,
                operator:`${element.operator}`
            });
        }
        logger.debug('CONTROLLER: Method intransit Ending');
        res.status(200).send(response);
    }

    async countFormule(req:Request,res:Response){
        logger.info('CONTROLLER: Method countFormule Startting');
        if(!req.params.type) res.status(400).send(`Type is requiered`);
        let type:any =req.params.type;
        let objectdata:any=[];
        if(TYPEINGENIO.intransit == type){
            let data:any = await this.sumagroIntransit.getcountFormuleIntransit('sumagrointransit ');
            if(!data.length) throw res.status(404).send([]);
            for(let element of data){
                objectdata.push({
                    name:`${element.description}`,
                    quantity:`${element.count}`,
                });
            }
            res.status(200).send(objectdata);
        }else if(TYPEINGENIO.outputs == type){
            let data:any = await this.sumagroIntransit.getcountFormuleIntransit('sumagrooutputs ');
            if(!data.length) throw res.status(404).send([]);
            for(let element of data){
                objectdata.push({
                    name:`${element.description}`,
                    quantity:`${element.count}`,
                });
            }
            res.status(200).send(objectdata);
        }

        logger.debug('CONTROLLER: Method countFormule Ending');
    }

}