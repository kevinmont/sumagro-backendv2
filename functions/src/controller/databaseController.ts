import {Request, Response} from 'express';
import AddressDao from '../dao/addressDao';
import CoordenatesDao from '../dao/coordenatesDao';
import * as log4js from 'log4js';

import DatabaseDao from '../dao/databaseDao';
import Mysql from '../utils/mysql';

const logger= log4js.getLogger();
logger.level ='debug';
export default class DatabaseController{
    public databaseDao: DatabaseDao;
    public addressDao: AddressDao; 
    public coordenatesDao:CoordenatesDao;
    constructor (mysql: Mysql){
        this.coordenatesDao= new CoordenatesDao(mysql);
        this.addressDao= new AddressDao(mysql);
        this.databaseDao = new DatabaseDao();
    }

    async uploadDatabaseIngenio (req:Request, res:Response){
        logger.info('CONTROLLER: Method uploadDatabaseIngenio Startting');
        let ingenioId= req.params.ingenioId;
        let records= req.body.records;

        if(!ingenioId) throw res.status(400).send('{"msg":"ingenioId is required"}');
        if(!records) throw res.status(400).send('{"msg":"records is required"}');
        let error:any=[];
        records = records.reverse();
        records.pop();
        records = records.reverse();
        for(let record of records){
            let address= record[5];
            let addressId:any= await this.addressDao.createAddressByLocalidad(address);
            let coordenatesId:any= await this.coordenatesDao.registeringCoordenates(record[22],record[23]);
            logger.info("coordenatesId: " + typeof coordenatesId);
            logger.info("coordenatesId 2: " + coordenatesId);
            let err:any= await this.databaseDao.saveDatabase(record, addressId,coordenatesId,ingenioId)
            if(typeof err == "string"){
                error.push(err); 
            }
        }

        logger.debug('CONTROLLER: Method uploadDatabaseIngenio Ending');
        (!error.length)? res.status(200).send(`{}`):res.status(409).send(error);   
    }

    async getDatabase(req: Request,res: Response){
        let ingenioId = req.params.ingenioId;
        let response = await this.databaseDao.getRecordsByIngenioId(ingenioId);
        return response;
    }

    async getExcel(req:Request,res: any){
        let ingenioId = req.params.ingenioId;
        let response = await this.databaseDao.getRecordsByIngenioId(ingenioId);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
        res.xls('database.xlsx',response);
    }

    async getEjidoByIngenioId(req: Request, res: Response) {
        logger.info('CONTROLLER: Method getEjidoByIngenioId Starting');

        if (!req.params.ingenioId) throw res.status(400).send('{ "msg":"ingenioId is required"}');
        let ingenioId = req.params.ingenioId;
        let parseId:number = parseInt(ingenioId)
        let ejido:any = await this.databaseDao.getEjidoByIngenio(parseId);
        if(!ejido.length) res.status(200).send({})
        logger.info(ejido);
        let objectdata:any=[];
        for(let element of ejido){
            objectdata.push(element.ejidolocalidad);
        }
        res.status(200).send(objectdata);
        
        // let dataOrder:any = await this.orderDao.orderById(orderId);
        // if(!dataOrder[0]) throw res.status(400).send('{ "msg":"orderId not found"}');
        // let address: any = await this.addressDao.getAddressById(orderId);
        // let subOrder: any = await this.subOrdersDao.getsubOrdersById(orderId);
        // let order: any = {};
        // let sub: any = [];

        // subOrder.forEach((i: any) => {
        //     sub.push({
        //         id: `${i.id}`,
        //         captured: `${i.captured}`,
        //         description: `${i.description}`,
        //         quantity: `${i.quantity}`,
        //         received: `${i.received}`,
        //         status: `${i.status}`
        //     })
        // });

        // order = {
        //     id: `${dataOrder[0].id}`,
        //     client: `${dataOrder[0].client}`,
        //     ingenioId: `${dataOrder[0].ingenioid}`,
        //     shippingdate: `${dataOrder[0].shippingdate}`,
        //     dateentrance: `${dataOrder[0].dateentrance}`,
        //     clientAddress: `${address[0].localidad}`,
        //     operationUnit: `${dataOrder[0].operationunit}`,
        //     operator: `${dataOrder[0].operator}`,
        //     plates: `${dataOrder[0].plates}`,
        //     remissionNumber: `${dataOrder[0].remissionnumber}`,
        //     shippingDate: `${dataOrder[0].shippingdate}`,
        //     status: `${dataOrder[0].status}`,
        //     subOrders: sub
        // }
        logger.debug('CONTROLLER: Method getEjidoByIngenioId Ending');
    }

}