import * as express from 'express';
import SackController from '../controller/sackController';

export default class SackRoute{
    public sackController: SackController;

    constructor(){
        this.sackController= new SackController();
    }

    addRoutes(app: express.Application){

        app.route('/sumagro-app/capturist/sacks')
            .post((req: express.Request, res: express.Response)=>{
                this.sackController.registerSacks(req,res);
        })
    }
}