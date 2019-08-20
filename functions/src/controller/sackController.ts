import {Request, Response} from 'express';
import SackDao from '../dao/sackDao';
import OrderDao from '../dao/orderDao';
import IngenioDao from '../dao/ingenioDao';
import UserDao from '../dao/userDao';
import SubOrderDao from '../dao/subOrdersDao';
import * as log4js from 'log4js';
import Mysql from '../utils/mysql';
const logger = log4js.getLogger();
logger.level = 'debug';

export default class SackController{
    public sackDao: SackDao;
    public ingenioDao: IngenioDao;
    public orderDao: OrderDao;
    public userDao: UserDao;
    public subOrderDao: SubOrderDao;

    constructor(mysql: Mysql){
        this.sackDao = new SackDao(mysql);
        this.orderDao = new OrderDao(mysql);
        this.ingenioDao = new IngenioDao(mysql);
        this.userDao = new UserDao(mysql);
        this.subOrderDao= new SubOrderDao(mysql);
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
        await this.orderDao.updateStatus(record.orderId,'TRANSIT');
        res.send({msg:"Costal registrado"});
        logger.info('CONTROLLER: Method registerSacks Ending');
    }
}
