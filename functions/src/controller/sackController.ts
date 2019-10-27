import { Request, Response } from 'express';
import * as log4js from 'log4js';
import { AplicatedDao } from '../dao/aplicatedDao';
import { CoordenatesDao } from '../dao/coordenatesDao';
import { DatabaseDao } from '../dao/databaseDao';
import { AplicatedDaoImpl } from '../dao/impl/aplicatedDaoImpl';
import { CoordenatesDaoImpl } from '../dao/impl/coordenatesDaoImpl';
import { DatabaseDaoImpl } from '../dao/impl/databaseDaoImpl';
import { IngenioDaoImpl } from '../dao/impl/ingenioDaoImpl';
import { OrderDaoImpl } from '../dao/impl/orderDaoImpl';
import { QrdataDaoImpl } from '../dao/impl/qrdataDaoImpl';
import { SackDaoImpl } from '../dao/impl/sackDaoImpl';
import { SubOrdersDaoImpl } from '../dao/impl/subOrdersDaoImpl';
import { SumagroOutputDaoImpl } from '../dao/impl/sumagroOutputDaoImpl';
import { UserDaoImpl } from '../dao/impl/userDaoImpl';
import { IngenioDao } from '../dao/ingenioDao';
import { OrderDao } from '../dao/orderDao';
import { QrdataDao } from '../dao/qrdataDao';
import { SackDao } from '../dao/sackDao';
import { SubOrdersDao } from '../dao/subOrdersDao';
import { SumagroOutputDao } from '../dao/sumagroOutputDao';
import { UserDao } from '../dao/userDao';
import { SackType } from '../models/sackType';
import GeolocationDistance from '../utils/GeolocationDistance';
import Mysql from '../utils/mysql';

const logger = log4js.getLogger('sumagro.controller.SackController');

export default class SackController{
    public sackDao: SackDao;
    public ingenioDao: IngenioDao;
    public orderDao: OrderDao;
    public userDao: UserDao;
    public subOrderDao: SubOrdersDao;
    public coordenateDao : CoordenatesDao;
    public qrdataDao: QrdataDao
    public outputDao: SumagroOutputDao
    public aplicatedDao: AplicatedDao;
    public databaseDao: DatabaseDao;
    public geolocationDistance: GeolocationDistance;
    constructor(mysql: Mysql){
        this.sackDao = new SackDaoImpl(mysql);
        this.orderDao = new OrderDaoImpl(mysql);
        this.ingenioDao = new IngenioDaoImpl(mysql);
        this.userDao = new UserDaoImpl(mysql);
        this.subOrderDao= new SubOrdersDaoImpl(mysql);
        this.coordenateDao = new CoordenatesDaoImpl(mysql);
        this.qrdataDao = new QrdataDaoImpl(mysql);
        this.outputDao = new SumagroOutputDaoImpl(mysql);
        this.aplicatedDao = new AplicatedDaoImpl(mysql, this.coordenateDao);
        this.databaseDao = new DatabaseDaoImpl(mysql);
        this.geolocationDistance = new GeolocationDistance();
    }

    async registerSacks(req: Request,res: Response){
        logger.info('CONTROLLER: Method registerSacks Starting');
        let  { id,description,orderId,operationUnit,plates,operator,index,date } = req.body;
        let operatorName:any = req.headers.email;
        let alldata:any = await this.orderDao.orderById(orderId);
        let ingenioId= alldata[0].ingenioid;
        logger.info(`ingenioid: ${ingenioId}`);
        let parseid = parseInt(id);
        let record = { SackId:id,ingenioId,description,orderId, operationUnit,plates,operator,date };
        await this.sackDao.saveSack(record);
        let ingenio:any = await this.ingenioDao.getIngenioById(ingenioId);
        if(!ingenio.length) throw res.status(404).send({msg:"ingenio not found"});
        let order:any = await this.orderDao.orderById(orderId);
        if(!order.length) throw res.status(404).send({msg:"order not found"});
        await this.sackDao.saveSackIntrasit(record,operatorName,parseid);
        await this.sackDao.saveSackOutputs(record,operatorName,parseid)
        await this.subOrderDao.updatestatus(index);
        await this.subOrderDao.updateCaptured(index);
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
            orderId: orderId,
            date: req.body.date
        };
        let inventory = {
            id: parseInt(req.body.sack),
            ingenioId: ingenioId,
            description: req.body.description,
            operador: req.body.operator,
            date: req.body.date
        }
        await this.sackDao.saveSackEntrance(entrance);
        await this.sackDao.saveSackInventory(inventory);
        await this.subOrderDao.updateRecived(subOrderId);
        await this.sackDao.delIntransit(+req.body.sack);
        logger.info('CONTROLLER: Method receptSacks Ending');
        res.status(200).send({msg:"Costal recibido"});
    }

    async updateInventory(req: any, res: Response){
        logger.info('CONTROLLER: Method updateInventory Starting');
        let {id, ingenioId, description, userId,ingenioName,productor,date} = req.body;
        let record = {id, ingenioId, description, userId,ingenioName,date};
        let operatorName:any = req.headers.email;
        if(!record.id) throw res.status(400).send('id is missing');
        if(!record.ingenioId) throw res.status(400).send('ingenioId is missing');
        if(!record.ingenioName) throw res.status(400).send('ingenioName is missing');
        if(!record.description) throw res.status(400).send('description is missing');
        if(!record.userId) throw res.status(400).send('userId is missing');
        await this.outputDao.saveOutputs(record,operatorName,productor);
        let response2 = await this.aplicatedDao.saveAplicated(record,productor);
        logger.info("RESPONSE UPDATE INVENTORY",response2);
        let inventoryId = parseInt(record.id);
        await this.sackDao.deleteInventory(inventoryId);
        
        logger.info('CONTROLLER: Method updateInventory Ending');
        res.send({msg:'salida registrada'});
    }

    async registerSackUsed(req: Request,res: Response){
        logger.info("RegisterSackUsed is starting...");
        let {id,longitud,latitud,dateAplicated} = req.body;
        let metadata:any = await this.aplicatedDao.getAplicatedById(id);
        logger.info("METADATA",metadata);
        let coordenatesIds:any = await this.databaseDao.getCoordenatesIdsByProductor(metadata[0].operator);
        logger.info("COORDENATESIDS",coordenatesIds);
        let coordenates = [];
        for(let id of coordenatesIds){
            let coord:any = await this.coordenateDao.getCoordenatesById(id.coordenatesid);
            logger.info("COORD",coord);
            coordenates.push({
                codigo: id.codigo,
                latitud: coord[0].latitud,
                longitud: coord[0].longitud
            });
        }
        let parcelaMatch = "unknow";
        let bool = false;
        for(let coord of coordenates){
            let response = await this.geolocationDistance.getDistanceFromLatLonInKm(coord.latitud,coord.longitud,latitud,longitud);
            if(response){
                bool = true;
                logger.info("MATCH COORDENATES",bool,coord.codigo);
                parcelaMatch = coord.codigo;
            }
        }
        
        await this.aplicatedDao.updatedAplicated(id,longitud,latitud,dateAplicated,bool);
        await this.aplicatedDao.saveParcelaSack(id,parcelaMatch,dateAplicated);
        let parcela:any = await this.databaseDao.getParcelaRest(parcelaMatch);
        let count = +parcela[0].aplicated+1;
        await this.databaseDao.updatedParcelasRest(count,parcelaMatch,dateAplicated);
        logger.info("RegisterSackUsed is ended");
        res.status(200).send({msg: "Updated" });
    }

    getListOfTypeSacks(req:Request,res:Response){
        let response = SackType;
        res.status(200).send(response)
    }

    async getSacksIds(req:Request,res:Response){
        let ingenioId:any="-1";
        if(req.query.ingenioId){
         ingenioId= req.query.ingenioId;
        }
        let table = req.query.table;
        let producto = req.query.producto;
        let page = +req.query.page;
        let peer_page = +req.query.peer_page;
        
        page=page*peer_page;
        let response =await this.sackDao.getIds(+ingenioId,table,producto,page,peer_page);
        res.status(200).send(response);
    }

}
