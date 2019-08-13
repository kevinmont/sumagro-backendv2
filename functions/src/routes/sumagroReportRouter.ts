import * as express from 'express';
import Mysql from '../utils/mysql';
import SumagroReportController from '../controller/sumagroReportController';
export default class SumagroReportRouter{
    private sumagroReportController: SumagroReportController;
    constructor(mysql: Mysql){
        this.sumagroReportController = new SumagroReportController(mysql);
    }

    addRoutes(app: express.Application){
        app.route('/sumagro-app/almacen-sumagro/report-sumagro')
            .post((req: express.Request,res:express.Response)=>{
                this.sumagroReportController.generateReport(req,res);
            })
    }

}