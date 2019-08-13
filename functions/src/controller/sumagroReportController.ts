import Mysql from '../utils/mysql';
import * as express from 'express';
import SumagroReportDao from '../dao/sumagroReportDao';
export default class SumagroReportController{
    private sumagroReportDao: SumagroReportDao;
    constructor( mysql: Mysql){
        this.sumagroReportDao = new SumagroReportDao(mysql);
    }

    async generateReport(req:express.Request,res:express.Response){
        if(!req.body.from) {res.status(400).send('from parameter is missing');
        }else if(!req.body.to) {res.status(400).send('to parameter is missing');
        }else if(!req.body.type) {res.status(400).send('type parameter is missing');}
        let { from, to,type} = req.body;
        let dataToReport = await this.sumagroReportDao.getReportInfo(from,to,type);
        console.log(dataToReport);
        res.status(200).send();
    }
}