import {Request, Response} from 'express';
import SackDao from '../dao/sackDao';
import OrderDao from '../dao/orderDao';
import IngenioDao from '../dao/ingenioDao';
import UserDao from '../dao/userDao';
import SubOrderDao from '../dao/subOrdersDao';
import CoordenatesDao from '../dao/coordenatesDao';

import * as log4js from 'log4js';
import Mysql from '../utils/mysql';
import QrdataDao from '../dao/qrdataDao';
import Output from '../dao/outputDao';
import AplicatedDao from '../dao/aplicatedDao';
const logger = log4js.getLogger();
logger.level = 'debug';

export default class SackController{
    public sackDao: SackDao;
    public ingenioDao: IngenioDao;
    public orderDao: OrderDao;
    public userDao: UserDao;
    public subOrderDao: SubOrderDao;
    public coordenateDao : CoordenatesDao;
    public qrdataDao: QrdataDao
    public outputDao: Output
    public aplicatedDao: AplicatedDao;

    constructor(mysql: Mysql){
        this.sackDao = new SackDao(mysql);
        this.orderDao = new OrderDao(mysql);
        this.ingenioDao = new IngenioDao(mysql);
        this.userDao = new UserDao(mysql);
        this.subOrderDao= new SubOrderDao(mysql);
        this.coordenateDao = new CoordenatesDao(mysql);
        this.qrdataDao = new QrdataDao(mysql);
        this.outputDao = new Output(mysql);
        this.aplicatedDao = new AplicatedDao(mysql);
    }

    async registerSacks(req: Request,res: Response){
        logger.info('CONTROLLER: Method registerSacks Starting');
        let  { id,description,orderId,operationUnit,plates,operator,index } = req.body;
        let operatorName:any = req.headers.email;
        let alldata:any = await this.orderDao.orderById(orderId);
        let ingenioId= alldata[0].ingenioid;
        logger.info(`ingenioid: ${ingenioId}`);
        let parseid = parseInt(id);
        let record = { SackId:id,ingenioId,description,orderId, operationUnit,plates,operator };
        await this.sackDao.saveSack(record);
        let ingenio:any = await this.ingenioDao.getIngenioById(ingenioId);
        if(!ingenio.length) throw res.status(404).send({msg:"ingenio not found"});
        let order:any = await this.orderDao.orderById(orderId);
        if(!order.length) throw res.status(404).send({msg:"order not found"});
        await this.sackDao.saveSackIntrasit(record,parseid);
        await this.sackDao.saveSackOutputs(record,operatorName,parseid)
        await this.subOrderDao.updatestatus(index);
        await this.subOrderDao.updateCaptured(index);
        await this.orderDao.updateStatus(record.orderId,'TRANSIT');
        res.send({msg:"Costal registrado"});
        logger.info('CONTROLLER: Method registerSacks Ending');
    }

    async receptSacks(req: Request, res:Response){
        logger.info('CONTROLLER: Method receptSacks Starting');
        if(!req.body.orderId) throw res.status(400).send('orderId is required');
        if(!req.body.description) throw res.status(400).send('description is required');
        if(!req.body.operator) throw res.status(400).send('operator is required');
        if(!req.body.sack) throw res.status(400).send('sack is required');
        let operatorName:any = req.headers.email;
        let subOrderId = parseInt(req.body.index)
        let orderId = parseInt(req.body.orderId);
        let alldata:any = await this.orderDao.orderById(orderId);
        let ingenio= alldata[0].ingenioid;
        logger.info(`ingenioid: ${ingenio}`);
        let ingenioId = parseInt(ingenio);
        let entrance = {
            id: parseInt(req.body.sack),
            description: req.body.description,
            ingenioId: ingenioId,
            operatorid: operatorName,
            orderId: orderId

        };
        let inventory = {
            id: parseInt(req.body.sack),
            ingenioId: ingenioId,
            description: req.body.description,
            operador: req.body.operator,
        }
        await this.sackDao.saveSackEntrance(entrance);
        await this.sackDao.saveSackInventory(inventory);
        await this.subOrderDao.updateRecived(subOrderId);
        logger.info('CONTROLLER: Method receptSacks Ending');
        res.status(200).send({msg:"Costal recibido"});
    }

    async updateInventory(req: any, res: Response){
        logger.info('CONTROLLER: Method updateInventory Starting');
        let {id, ingenioId, description, userId, qrData,ingenioName, operador} = req.body;
        let record = {id, ingenioId, description, userId, qrData,ingenioName, operador};
        if(!record.id) res.status(400).send('id is missing');
        if(!record.ingenioId) res.status(400).send('ingenioId is missing');
        if(!record.ingenioName) res.status(400).send('ingenioName is missing');
        if(!record.description) res.status(400).send('description is missing');
        if(!record.userId) res.status(400).send('userId is missing');
        if(!record.qrData) res.status(400).send('qrData is missing');
        await this.coordenateDao.saveCordenate(record);
        let coordenate:any = await this.coordenateDao.getCordenate(record)
        let coordenateId:number = parseInt(coordenate[0].id);
        await this.qrdataDao.registeringQrData(record, coordenateId);
        let qrDatas:any = await this.qrdataDao.getQrDataCoordenateId(coordenateId);
        let qrDataId = parseInt(qrDatas[0].id);
        await this.outputDao.saveOutputs(record,qrDataId);
        await this.aplicatedDao.saveAplicated(record, coordenateId);
        let inventoryId = parseInt(record.id);
        await this.sackDao.deleteInventory(inventoryId);
        logger.info('CONTROLLER: Method updateInventory Ending');
        res.send({msg:'salida registrada'});
    }

}
