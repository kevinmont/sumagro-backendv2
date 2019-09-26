import * as express from 'express';
import OrderController from '../controller/orderController';
import Mysql from '../utils/mysql';

import Firebase from '../utils/firebase';


export default class OrderRoute{
    public orderController: OrderController;
    public firebase: Firebase

    constructor(mysql: Mysql,firebase: Firebase){
        this.orderController = new OrderController(mysql,firebase);
        this.firebase = firebase;
    }
    addRoutes(app: express.Application){

        app.route('/sumagro-app/order')
        .post(this.firebase.authentication,(req: express.Request,res:express.Response)=>{
            this.orderController.postOrder(req,res);
        })
        .get((req: express.Request, res:express.Response)=>{
            this.orderController.getOrders(req,res);
        })

        app.route('/sumagro-app/order/:orderId')
        .delete((req: express.Request,res:express.Response)=>{
            this.orderController.deleteOrderByOrderId(req,res);
        })
        .patch(this.firebase.authentication,(req:express.Request, res: express.Response)=>{
            this.orderController.getOrder(req,res);
        })
        .get(this.firebase.authentication,(req:express.Request, res:express.Response)=>{
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

        app.route('/sumagro-app/remission/number')
            .get((req: express.Request,res: express.Response)=>{
                this.orderController.getRemissionNumber(req,res);
        })

        app.route('/sumagro-app/ordersByIngenio/:ingenioId/status/:status')
        .get(this.firebase.authentication,(req: express.Request, res: express.Response) =>{
            this.orderController.getOrdersByIngenio(req,res);
        })

        app.route('/sumagro-app/sumagro-almacen/intransit')
        .get((req:express.Request, res:express.Response)=>{
            this.orderController.intransit(req,res);
        })

        app.route('/sumagro-app/sumagro-almacen/outputs')
        .get((req:express.Request, res:express.Response)=>{
            this.orderController.outputs(req,res);
        })

        app.route('/sumagro-app/almacen/formula/:type')
        .get((req:express.Request, res:express.Response)=>{
            this.orderController.countFormule(req,res);
        })

        
    }

}