import * as express from 'express';
import IngenioController from '../controller/ingenioController';
import Mysql from '../utils/mysql';
import Firebase from '../utils/firebase';

export default class OrderRoute{
    public ingenioController: IngenioController;
    public firebase: Firebase;

    constructor(mysql: Mysql, firebase: Firebase){
        this.ingenioController = new IngenioController(mysql);
        this.firebase = firebase;
    }
    
    addRoutes(app: express.Application){

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

        app.route('/sumagro-app/ingenio/:ingenioId')
        .get((req: express.Request,res: express.Response)=>{
            this.ingenioController.getIngenioDetails(req,res);
        })

        app.route('/sumagro-app/ingenio/formula/:type/:ingenioId')
        .get((req:express.Request, res:express.Response)=>{
            this.ingenioController.getFormulaByingenio(req,res);
        })

        app.route('/sumagro-app/ingenio/:type/:ingenioId')
        .get((req:express.Request,res:express.Response)=>{
            this.ingenioController.getDataentranceByIngenio(req,res);
        })

        app.route('/sumagro-app/getlist/ingenios')
            .get((req: express.Request,res:express.Response)=>{
                this.ingenioController.getIngeniosList(req,res);
            })

        app.route("/sumagro-app/orders/options")
        .get((req: express.Request,res:express.Response)=>{
            this.ingenioController.getOrderByIngenioOptions(req,res);
        })

        app.route("/sumagro-app/orders/optionsalmacen")
        .get((req: express.Request,res:express.Response)=>{
            this.ingenioController.getOrderByIngenioOptions(req,res);
        })
        app.route("/sumagro-app/databasetypes/list")
        .get((req: express.Request,res:express.Response)=>{
            this.ingenioController.getZonasOfIngenio(req,res);
        })

        app.route("/sumagro-app/clientes/list")
            .get((req:express.Request,res:express.Response)=>{
                this.ingenioController.getClientsList(req,res);
            })        

        
    }
}