import * as express from 'express';
import UserController from '../controller/userController';

export default class UserRoute{
    public userController: UserController;

    constructor(){
        this.userController= new UserController();
    }

    addRoutes(app: express.Application){
        app.route('/sumagro-app/user/:userId')
        .delete((req: express.Request, res: express.Response)=>{
            this.userController.deleteUser(req, res);
        })
    }
}