import * as express from 'express';
import Mysql from '../utils/mysql';
import SumagroReportController from '../controller/sumagroReportController';
import Firebase from '../utils/firebase';
export default class SumagroReportRouter{
    private sumagroReportController: SumagroReportController;
    public firebase:Firebase;
    constructor(mysql: Mysql,firebase:Firebase){
        this.firebase=firebase;
        this.sumagroReportController = new SumagroReportController(mysql);
    }

    addRoutes(app: express.Application){
        app.route('/sumagro-app/ingenios-type/report')
            .post(this.firebase.authentication,(req: express.Request,res:express.Response)=>{
                this.sumagroReportController.generateReport(req,res);
            })

        app.route('/sumagro-app/ingenio-type/multiple-report')
            .post(this.firebase.authentication,(req:express.Request,res:express.Response)=>{
                this.sumagroReportController.generateReportAplicated(req,res);
            })

        app.route('/sumagro-app/almacen-type/report')
        .post(this.firebase.authentication,(req:express.Request, res: express.Response)=>{
                this.sumagroReportController.getReportByType(req,res);
        })

    }


}