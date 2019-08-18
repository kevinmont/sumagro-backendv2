import * as express from 'express';
import SackController from '../controller/sackController';
import Mysql from '../utils/mysql';
import UserController from '../controller/userController';

export default class SackRoute{
    public sackController: SackController;
    public userController: UserController;

    constructor(mysql:Mysql){
        this.userController = new UserController(mysql);
        this.sackController= new SackController(mysql);
    }

    addRoutes(app: express.Application){

        app.route('/sumagro-app/capturist/sacks')
            .post(this.userController.firebase.authentication,(req: express.Request, res: express.Response)=>{
                this.sackController.registerSacks(req,res);
        })
    }
}