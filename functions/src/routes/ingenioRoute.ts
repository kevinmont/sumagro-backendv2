import * as express from 'express';
import IngenioController from '../controller/ingenioController';
import Firebase from '../utils/firebase';

export default class OrderRoute{
    public ingenioController: IngenioController;
    public firebase: Firebase;

    constructor(firebase: Firebase){
        this.ingenioController = new IngenioController();
        this.firebase = firebase; 
    }
    
    addRoutes(app: express.Application){

        app.route('/sumagro-app/ingenio/:ingenioId')
        .delete((req: express.Request,res:express.Response)=>{
            this.ingenioController.deleteIngenioById(req,res);
        })

        app.route('/sumagro-app/ingenio/register')
        .post((req: express.Request,res:express.Response)=>{
            this.ingenioController.createeIngenio(req,res);
        })

        app.route('/sumagro-app/send-pdf/:orderId')
            .post(this.firebase.authentication,(req:express.Request, res: express.Response)=>{
                this.ingenioController.sendEmail(req,res);
            })

        app.route('/sumagro-app/ingenios')
        .get((req:express.Request, res: express.Response)=>{
            this.ingenioController.getIngenios(req,res);
        })

    }
}