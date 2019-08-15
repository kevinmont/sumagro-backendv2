import * as express from 'express';
import OrderController from '../controller/orderController';
import Mysql from '../utils/mysql';
import UserController from '../controller/userController';


export default class OrderRoute{
    public orderController: OrderController;
    public userController: UserController

    constructor(mysql: Mysql){
        this.orderController = new OrderController(mysql);
        this.userController = new UserController(mysql);
    }
    addRoutes(app: express.Application){

        app.route('/sumagro-app/order')
        .post(this.userController.firebase.authentication,(req: express.Request,res:express.Response)=>{
            this.orderController.postOrder(req,res);
        })
        .get((req: express.Request, res:express.Response)=>{
            this.orderController.getOrders(req,res);
        })

        app.route('/sumagro-app/order/:orderId')
        .delete((req: express.Request,res:express.Response)=>{
            this.orderController.deleteOrderByOrderId(req,res);
        })
        .patch(this.userController.firebase.authentication,(req:express.Request, res: express.Response)=>{
            this.orderController.getOrder(req,res);
        })
        .get(this.userController.firebase.authentication,(req:express.Request, res:express.Response)=>{
            this.orderController.getOrderById(req,res);
        })

        app.route('/sumagro-app/generate-pdf/:orderId')
            .get((req: express.Request,res: express.Response)=>{
                this.orderController.generatePdf(req,res);
        })

        app.route('/sumagro-app/generate-charge-pdf/chargeformat/:orderId')
            .get((req: express.Request, res: express.Response)=>{
                    this.orderController.getChargeData(req,res)
                }
        )

        app.route('/sumagro-app/order/status/:orderId')
            .get((req: express.Request, res: express.Response) =>{
                this.orderController.getStatusOrder( req, res )
        })
    }

}