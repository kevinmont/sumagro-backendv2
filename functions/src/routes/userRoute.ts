import * as express from 'express';
import UserController from '../controller/userController';
import Mysql from '../utils/mysql';
import Firebase from '../utils/firebase';
import SackController from '../controller/sackController';
import OrderController from '../controller/orderController';
import IngenioController from '../controller/ingenioController';


export default class UserRoute{
    public userController: UserController;
    public firebase: Firebase;
    public sackController : SackController;
    public ingenioController: IngenioController;
    public orderController: OrderController;
    constructor(mysql: Mysql, firebase: Firebase){
        this.firebase = firebase;
        this.userController= new UserController(mysql,this.firebase);
        this.sackController = new SackController(mysql);
        this.orderController = new OrderController(mysql);
        this.ingenioController = new IngenioController(mysql);
    }

    addRoutes(app: express.Application){

        app.post('/sumagro-app/register',(req: express.Request ,res: express.Response)=>{
            this.userController.createUser(req,res);
        });

        app.route('/sumagro-app/user/:userId')
        .delete(this.firebase.authentication,(req: express.Request, res: express.Response)=>{
            this.userController.deleteUser(req, res);
        })
        .get(this.firebase.authentication,(req: express.Request,res: express.Response)=>{
            this.userController.getUserInfo(req,res);
        })

        app.post('/sumagro-app/notification',(req: express.Request ,res: express.Response)=>{
            this.userController.notificationPush(req,res);
        });

        app.route('/sumagro-app/token')
        .post(this.firebase.authentication,(req:express.Request,res:express.Response)=>{
            this.userController.saveToken(req,res);
        })
        .delete(this.firebase.authentication,(req:express.Request,res:express.Response)=>{
            this.userController.deleteToken(req,res);
        })

        app.route('/sumagro-app/users')
        .get((req: express.Request, res:express.Response)=>{
            this.userController.getUsers(req,res);
        })

        app.route('/sumagro-app/capturist/sacks')
            .post(this.firebase.authentication,(req: express.Request, res: express.Response)=>{
                this.sackController.registerSacks(req,res);
        })

        app.route('/sumagro-app/order')
        .post(this.firebase.authentication,(req: express.Request,res:express.Response)=>{
            this.orderController.postOrder(req,res);
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

        app.route('/sumagro-app/ingenio/:ingenioId')
        .delete((req: express.Request,res:express.Response)=>{
            this.userController.deleteIngenioById(req,res);
        })

        app.route('/sumagro-app/warehouse/oders')
            .get((this.firebase.authentication,(req: express.Request,res: express.Response)=>{
                this.orderController.warehouseOrders(req,res);
        }))
        
        app.route('/sumagro-app/ingenio/:ingenioId/order/:orderId')
            .patch(this.firebase.authentication,(req:express.Request, res: express.Response)=>{
                this.userController.updateOrderStatus(req,res);
            })
            .delete(this.firebase.authentication,(req: express.Request, res: express.Response)=>{
                this.userController.deleteOrder(req,res);    
            })

    }
}