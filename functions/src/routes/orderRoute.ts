import * as express from 'express';
import OrderController from '../controller/orderController';

export default class OrderRoute{
    public orderController: OrderController;

    constructor(){
        this.orderController = new OrderController();
    }
    
    addRoutes(app: express.Application){

        app.route('/sumagro-app/order/:orderId')
        .delete((req: express.Request,res:express.Response)=>{
            this.orderController.deleteOrderByOrderId(req,res);
        })

    }
}