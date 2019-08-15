import * as express from 'express';
import SackController from '../controller/sackController';
import Firebase from '../utils/firebase';

export default class SackRoute{
    public sackController: SackController;
    public firebase: Firebase;

    constructor(firebase: Firebase){
        this.sackController= new SackController();
        this.firebase = firebase;
    }

    addRoutes(app: express.Application){

        app.route('/sumagro-app/capturist/sacks')
            .post(this.firebase.authentication,(req: express.Request, res: express.Response)=>{
                this.sackController.registerSacks(req,res);
        })
    }
}