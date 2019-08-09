import * as express from 'express';
import UserController from '../controller/userController';

export default class UserRoute{
    public userController: UserController;

    constructor(){
        this.userController= new UserController();
    }

    addRoutes(app: express.Application){

        app.post('/sumagro-app/register',(req: express.Request ,res: express.Response)=>{
            this.userController.createUser(req,res);
        });

        app.route('/sumagro-app/user/:userId')
        .delete((req: express.Request, res: express.Response)=>{
            this.userController.deleteUser(req, res);
        })

        app.post('/sumagro-app/notification',(req: express.Request ,res: express.Response)=>{
            this.userController.notificationPush(req,res);
        });

        app.route('/sumagro-app/token')
        .post((req:express.Request,res:express.Response)=>{
            this.userController.saveToken(req,res);
        })
        .delete((req:express.Request,res:express.Response)=>{
            this.userController.deleteToken(req,res);
        })
    }
}