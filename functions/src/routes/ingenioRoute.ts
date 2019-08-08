import * as express from 'express';
import IngenioController from '../controller/ingenioController';

export default class OrderRoute{
    public ingenioController: IngenioController;

    constructor(){
        this.ingenioController = new IngenioController();
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


    }
}