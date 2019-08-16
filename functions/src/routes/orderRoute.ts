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
        .get((req: express.Request, res:express.Response)=>{
            this.orderController.getOrders(req,res);
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