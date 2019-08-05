import * as express from 'express';
import UserController from '../controller/userController';
import * as cors from 'cors';

export default class UserRoute{
    public userController: UserController;

    constructor(){
        this.userController = new UserController();
    }

    addRoutes(app: express.Application){
        app.post('/sumagro-app/register',cors(),(req: express.Request ,res: express.Response)=>{
            this.userController.createUser(req,res);
        });
    }
}