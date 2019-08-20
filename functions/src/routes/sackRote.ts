import * as express from 'express';
import SackController from '../controller/sackController';
import Mysql from '../utils/mysql';
import Firebase from '../utils/firebase';

export default class SackRoute{
    public sackController: SackController;
    public firebase: Firebase;

    constructor(mysql:Mysql,firebase: Firebase){
        this.firebase = firebase;
        this.sackController= new SackController(mysql);
    }

    addRoutes(app: express.Application){

        app.route('/sumagro-app/capturist/sacks')
            .post(this.firebase.authentication,(req: express.Request, res: express.Response)=>{
                this.sackController.registerSacks(req,res);
        })

        app.route('/sumagro-app/recept/sacks')
        .patch(this.firebase.authentication,(req: express.Request, res: express.Response)=>{
                this.sackController.receptSacks(req,res)
            }
        )
    }
}