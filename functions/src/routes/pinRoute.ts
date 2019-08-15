import * as express from 'express';
import PinController from '../controller/pinController';


export default class PinRoute{
    public pinController: PinController;

    constructor(){
        this.pinController = new PinController();
    }
    
    addRoutes(app: express.Application){

        app.route('/sumagro-app/getpin')
        .get((req: express.Request,res:express.Response)=>{
            this.pinController.getPin(req,res);
        })

    }
}