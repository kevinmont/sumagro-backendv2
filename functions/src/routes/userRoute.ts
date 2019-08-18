import * as express from 'express';
import UserController from '../controller/userController';
import Mysql from '../utils/mysql';
import Firebase from '../utils/firebase';


export default class UserRoute{
    public userController: UserController;
    public firebase: Firebase;
    constructor(mysql: Mysql, firebase: Firebase){
        this.firebase = firebase;
        this.userController= new UserController(mysql,this.firebase);
        
    }

    addRoutes(app: express.Application){

        app.post('/sumagro-app/register',(req: express.Request ,res: express.Response)=>{
            this.userController.createUser(req,res);
        });

        app.route('/sumagro-app/user/:userId')
        .delete(this.firebase.authentication,(req: express.Request, res: express.Response)=>{
            this.userController.deleteUser(req, res);
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
    }
}