import * as express from 'express';
import OrdersController from '../controller/ordersController';

export default class OrderRoute{
    public ordersController: OrdersController;

    constructor(){
        this.ordersController = new OrdersController();
    }
    addRoutes(app: express.Application){

        app.route('/sumagro-app/postorder')
        .post((req: express.Request,res:express.Response)=>{
            this.ordersController.postOrder(req,res);
        })

    }
}