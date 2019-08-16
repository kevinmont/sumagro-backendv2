import * as express from 'express';
import IngenioController from '../controller/ingenioController';
import Mysql from '../utils/mysql';

export default class OrderRoute{
    public ingenioController: IngenioController;

    constructor(mysql: Mysql){
        this.ingenioController = new IngenioController(mysql);
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

        

        app.route('/sumagro-app/ingenios')
        .get((req:express.Request, res: express.Response)=>{
            this.ingenioController.getIngenios(req,res);
        })

    }
}