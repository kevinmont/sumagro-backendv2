import * as express from 'express';
import UserController from '../controller/userController';
import Mysql from '../utils/mysql';
import SackController from '../controller/sackController';
import OrderController from '../controller/orderController';
import IngenioController from '../controller/ingenioController';

export default class UserRoute{
    public userController: UserController;
    public sackController: SackController;
    public orderController: OrderController;
    public ingenioController: IngenioController;

    constructor(mysql: Mysql){
        this.sackController= new SackController(mysql);
        this.userController= new UserController(mysql);
        this.orderController = new OrderController(mysql);
        this.ingenioController = new IngenioController(mysql);
    }

    addRoutes(app: express.Application){

        app.post('/sumagro-app/register',(req: express.Request ,res: express.Response)=>{
            this.userController.createUser(req,res);
        });

        app.route('/sumagro-app/user/:userId')
        .delete(this.userController.firebase.authentication,(req: express.Request, res: express.Response)=>{
            this.userController.deleteUser(req, res);
        })
        .get(this.userController.firebase.authentication,(req: express.Request,res: express.Response)=>{
            this.userController.getUserInfo(req,res);
        })

        app.post('/sumagro-app/notification',(req: express.Request ,res: express.Response)=>{
            this.userController.notificationPush(req,res);
        });

        app.route('/sumagro-app/token')
        .post(this.userController.firebase.authentication,(req:express.Request,res:express.Response)=>{
            this.userController.saveToken(req,res);
        })
        .delete(this.userController.firebase.authentication,(req:express.Request,res:express.Response)=>{
            this.userController.deleteToken(req,res);
        })

        app.route('/sumagro-app/users')
        .get((req: express.Request, res:express.Response)=>{
            this.userController.getUsers(req,res);
        })

        app.route('/sumagro-app/capturist/sacks')
            .post(this.userController.firebase.authentication,(req: express.Request, res: express.Response)=>{
                this.sackController.registerSacks(req,res);
        })

        app.route('/sumagro-app/order')
        .post(this.userController.firebase.authentication,(req: express.Request,res:express.Response)=>{
            this.orderController.postOrder(req,res);
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

        app.route('/sumagro-app/send-pdf/:orderId')
            .post(this.userController.firebase.authentication,(req:express.Request, res: express.Response)=>{
                this.ingenioController.sendEmail(req,res);
            })
        
        
        app.route('/sumagro-app/ingenio/:ingenioId')
        .delete((req: express.Request,res:express.Response)=>{
            this.userController.deleteIngenioById(req,res);
        })

        app.route('/sumagro-app/warehouse/oders')
            .get((this.userController.firebase.authentication,(req: express.Request,res: express.Response)=>{
                this.orderController.warehouseOrders(req,res);
        })) 
    }
}