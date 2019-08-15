import Mysql from '../utils/mysql';
import * as express from 'express';
import SumagroReportDao from '../dao/sumagroReportDao';
import { ingenioSection } from '../models/ingenio';
import * as pdfH from 'html-pdf';
import * as Log4js from 'log4js';
const logger =  Log4js .getLogger('Sumagro Report Controller');
logger.level = 'info';
export default class SumagroReportController{
    private sumagroReportDao: SumagroReportDao;
    constructor( mysql: Mysql){
        this.sumagroReportDao = new SumagroReportDao(mysql);
    }

    async generateReport(req:express.Request,res:express.Response){
        if(!req.body.from) throw res.status(400).send('from parameter is missing');
        if(!req.body.to) throw res.status(400).send('to parameter is missing');
        if(!req.body.type) throw res.status(400).send('type parameter is missing');
        if((typeof req.body.type!="string") || !ingenioSection.includes(req.body.type.toLowerCase()) ) throw res.status(400).send("type parameter invalid")
        let { from, to,type} = req.body;
        let dataToReport:any = await this.sumagroReportDao.getReportInfo(from,to,type.toLowerCase());
        pdfH.create(dataToReport).toStream((err:any,stream:any)=>{
            res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'responseType': 'blob',
                'Content-disposition': `attachment; filename=reportSumagro.pdf`
            });
            stream.pipe(res);
        })
        
    }
}