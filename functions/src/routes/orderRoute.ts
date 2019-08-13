import * as express from 'express';
import OrderController from '../controller/orderController';
import Mysql from '../utils/mysql';


export default class OrderRoute{
    public orderController: OrderController;

    constructor(mysql: Mysql){
        this.orderController = new OrderController(mysql);
    }
    addRoutes(app: express.Application){

        app.route('/sumagro-app/order')
        .post((req: express.Request,res:express.Response)=>{
            this.orderController.postOrder(req,res);
        })
        .get((req: express.Request, res:express.Response)=>{
            this.orderController.getOrders(req,res);
        })

        app.route('/sumagro-app/order/:orderId')
        .delete((req: express.Request,res:express.Response)=>{
            this.orderController.deleteOrderByOrderId(req,res);
        })
        .patch((req:express.Request, res: express.Response)=>{
            this.orderController.getOrder(req,res);
        })
        .get((req:express.Request, res:express.Response)=>{
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