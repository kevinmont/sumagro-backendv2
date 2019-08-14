import * as express from 'express';
import SackController from '../controller/sackController';
import UserController from '../controller/userController';

export default class SackRoute{
    public sackController: SackController;
    public userController: UserController;

    constructor(){
        this.sackController= new SackController();
        this.userController = new UserController();
    }

    addRoutes(app: express.Application){

        app.route('/sumagro-app/capturist/sacks')
            .post(this.userController.firebase.authentication,(req: express.Request, res: express.Response)=>{
                this.sackController.registerSacks(req,res);
        })
    }
}