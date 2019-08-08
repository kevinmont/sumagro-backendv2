import * as express from 'express';
import OrderController from '../controller/orderController';

export default class OrderRoute{
    public orderController: OrderController;

    constructor(){
        this.orderController = new OrderController();
    }
    addRoutes(app: express.Application){

        app.route('/sumagro-app/order')
        .post((req: express.Request,res:express.Response)=>{
            this.orderController.postOrder(req,res);
        })

        app.route('/sumagro-app/order/:orderId')
        .delete((req: express.Request,res:express.Response)=>{
            this.orderController.deleteOrderByOrderId(req,res);
        })
        .patch((req:express.Request, res: express.Response)=>{
            this.orderController.getOrder(req,res);
        })
    }

}