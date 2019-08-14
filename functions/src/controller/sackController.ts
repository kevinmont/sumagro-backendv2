import {Request, Response} from 'express';
import SackDao from '../dao/sackDao';
import OrderDao from '../dao/orderDao';
import IngenioDao from '../dao/ingenioDao';
import UserDao from '../dao/userDao';
import * as log4js from 'log4js';
const logger = log4js.getLogger();
logger.level = 'debug';

export default class SackController{
    public sackDao: SackDao;
    public ingenioDao: IngenioDao;
    public orderDao: OrderDao;
    public userDao: UserDao;

    constructor(){
        this.sackDao = new SackDao();
        this.orderDao = new OrderDao();
        this.ingenioDao = new IngenioDao();
        this.userDao = new UserDao();
    }

    async registerSacks(req: Request,res: Response){
        logger.info('CONTROLLER: Method registerSacks Starting');
        let  { id,ingenioId,description,orderId,operationUnit,plates,operator } = req.body;
        let operatorName:any = req.headers.email;
        let record = { SackId:id,ingenioId,description,orderId, operationUnit,plates,operator };
        let sack:any = await this.sackDao.getSackById(id);
        if(!sack.length) throw res.status(404).send({msg:"sack not found"});
        let ingenio:any = await this.ingenioDao.getIngenioById(ingenioId);
        if(!ingenio.length) throw res.status(404).send({msg:"ingenio not found"});
        let order:any = await this.orderDao.orderById(orderId);
        if(!order.length) throw res.status(404).send({msg:"order not found"});
        let user:any = await this.userDao.UserById(operator)
        if(!user.length) throw res.status(404).send({msg:"user not found"});
        await this.sackDao.saveSackIntrasit(record);
        await this.sackDao.saveSackOutputs(record,operatorName)
        res.send({msg:"Costal registrado"});
        logger.info('CONTROLLER: Method registerSacks Ending');
    }
}
