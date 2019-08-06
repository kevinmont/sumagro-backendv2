import {Request,Response} from 'express';
import IngenioDao from '../dao/ingenioDao';
import OrderDao from '../dao/orderDao';
import AddressDao from '../dao/addressDao';
import SubOrdersDao from '../dao/subOrdersDao';
import * as log4js from 'log4js';
import Order from '../models/Order';

const logger = log4js.getLogger();
logger.level = 'debug';

export default class OrderController{

    public ingenioDao : IngenioDao;
    public orderDao: OrderDao;
    public addressDao: AddressDao;
    public subOrdersDao: SubOrdersDao;
    public addressid:any;
    
    constructor(){
        this.ingenioDao = new IngenioDao();
        this.orderDao = new OrderDao();
        this.addressDao= new AddressDao();
        this.subOrdersDao= new SubOrdersDao();
    }

    async postOrder(req: Request,res:Response){
        logger.info('CONTROLLER: method postOrder Starting');
        let address= req.body.clientAddress;
        let lengthsub= req.body.subOrders.length;
        let ingenioid=req.body.ingenioId;
        if((address != undefined) && (lengthsub > 0) &&  (ingenioid != undefined)){ 
            this.addressid= await this.addressDao.getAddress(address);
        }else{
            res.status(400).send('Error in parameters 1');
        }
        
        let object:Order= {
            client:req.body.client,
            addressid:this.addressid[0].id,
            remissionNumber: req.body.remissionNumber,
            shippingDate: req.body.shippingDate,
            ingenioId: ingenioid
        }

        let resquery:any= await this.ingenioDao.getIngenio(object.ingenioId);
        if(resquery < 1) res.status(400).send(`Error in parameters 2`);
        let orderidquery:number;
        orderidquery = await this.orderDao.saveOrder(object);
        console.log(`resquery: ${orderidquery}`);
        
        if(orderidquery != undefined){
            console.log("entro");
            console.log("contador: " + lengthsub);
            let subOrders:any={};
            for(let count1 =0; count1 < lengthsub; count1++){
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
        }else{
            res.status(400).send(`error in query`);
        }

        logger.debug('CONTROLLER: method postOrder Ending');   
    }
}