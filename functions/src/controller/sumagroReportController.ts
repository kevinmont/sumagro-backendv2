import Mysql from '../utils/mysql';
import * as express from 'express';
import * as pdfH from 'html-pdf';
import * as Log4js from 'log4js';
// import InventoryDao from '../dao/inventoryDao';
// import IntransitDao from '../dao/intransitDao';
// import OutputDao from '../dao/outputDao';
// import SumagroOutputDao from '../dao/sumagroOutputDao';
// import AplicatedDao from '../dao/aplicatedDao';
//import EntranceDao from '../dao/entranceDao';

import SumagroReportDao from '../dao/sumagroReportDao';
import ingenioDao from '../dao/ingenioDao';


const logger =  Log4js .getLogger('Sumagro Report Controller');
logger.level = 'info';
export default class SumagroReportController{
    // private inventoryDao: InventoryDao;
    // private intransitDao: IntransitDao;
    // private outputDao: OutputDao;
    // private sumagroOutputDao: SumagroOutputDao;
    // private aplicatedDao: AplicatedDao;
    //private entranceDao: EntranceDao;
    
    private sumagroReportDao: SumagroReportDao;
    private ingenioDao : ingenioDao;
    constructor( mysql: Mysql){
        // this.aplicatedDao = new AplicatedDao(mysql);
        // this.intransitDao= new IntransitDao(mysql);
        // this.inventoryDao = new InventoryDao(mysql);
        // //this.entranceDao = new EntranceDao(mysql);
        // this.outputDao = new OutputDao(mysql);
        // this.sumagroOutputDao= new SumagroOutputDao(mysql);
        this.ingenioDao = new ingenioDao(mysql);
        this.sumagroReportDao= new SumagroReportDao(mysql);
        
    }

    async generateReport(req:any,res:express.Response){
        logger.info("CONTROLLER: method generateReport Starting");
        if(!req.body.tableName) throw res.status(400).send("Missing tableName parameter");
        if(!req.body.productos) throw res.status(400).send("Missing productos parameter");
        if(!req.body.dateStart) throw res.status(400).send("Missing dateStart parameter");
        if(!req.body.dateEnd) throw res.status(400).send("Missing dateEnd parameter");
        if(!req.body.ingenioId) throw res.status(400).send("Missing ingenioId parameter");
        
        let {tableName,productos,dateStart,dateEnd,ingenioId} = req.body;
        
        let ingenioName:any = await this.ingenioDao.getIngenioDetails(+ingenioId);
        let dataToReport:any;
        let data:any;
        switch(tableName){
            case 'inventory':
            case 'outputs':
                try{ 
                    data=await this.sumagroReportDao.getDataByProduct(ingenioId,productos,tableName,dateStart,dateEnd);
                    dataToReport = await this.sumagroReportDao.getReportInfo(tableName,"producto",dateStart,dateEnd,data,ingenioName[0].name);
                }catch(err){
                    throw res.status(500).send("Error en conexion a MYSQL");    
                }
                break;
            default:
                break;
        }
        let options = {
            year: 'numeric', month: 'numeric', day: 'numeric',
            hour: 'numeric', minute: 'numeric', second: 'numeric',
            hour12: false,
            timeZone: 'America/Los_Angeles' 
          };
        pdfH.create(dataToReport,{
            format:"Letter",
            border:{
                top: "1cm"    ,      // default is 0, units: mm, cm, in, px
            right: "1cm",
            bottom: "1in",
            left: "1cm"
            },
            footer:{
                contents:`
                <table style="width: 100%;">
        <tr><td><span style="text-align: left">Usuario: jose</span></td><td><span style="text-align: center">Fecha y hora: ${new Intl.DateTimeFormat("es-MX",options).format(new Date())}</span></td><td><span style="text-align: right">Pág: {{page}}/{{pages}}</span></td></tr>
    </table>`
            }
        }).toStream((err:any,stream:any)=>{
            res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'responseType': 'blob',
                'Content-disposition': `attachment; filename=reportSumagro.pdf`
            });
            stream.pipe(res);
        })
    }

    async getReportByType(req: express.Request, res: express.Response) {

        logger.info('CONTROLLER: Method getDataForProductFilter Startting');
        if(!req.body.type) throw res.status(400).send("Missing type parameter");
        if(!req.body.tableName) throw res.status(400).send("Missing tableName parameter");
        if(!req.body.dateStart) throw res.status(400).send("Missing dateStart parameter");
        if(!req.body.dateEnd) throw res.status(400).send("Missing dateEnd parameter");
       
        if(!req.body.ordenes) throw res.status(400).send("Missing ordenes parameter");
        let { tableName,type,dateStart,dateEnd,productos,ordenes,clientes} = req.body;
        let ingenios = [];
        if(req.body.ingenios) {
           ingenios = req.body.ingenios;
        }
        let ingenioName:any =[{
            name: "ALMACEN"
        }];
        if(req.body.ingenioId) {
            ingenioName = await this.ingenioDao.getIngenioDetails(+req.body.ingenioId);
        }
        if(tableName!="sumagrooutputs" && tableName!="sumagrointransit" && tableName!="entrance" && tableName!="intransit") throw res.status(400).send("Report isn't available");
        let dataToReport:any;
        let data:any;
        switch(type){
            case 'cliente':
            case 'orden':
            case 'producto':
                    try{
                    data = await this.sumagroReportDao.getDataOfWarehouse(tableName,dateStart,dateEnd,ingenios,productos,ordenes,clientes);
                    dataToReport= await this.sumagroReportDao.getReportInfo(tableName,type,dateStart,dateEnd,data,ingenioName[0].name);
                    console.log("terminado",JSON.stringify(data));
                    }catch(err){
                       throw res.status(500).send(err); 
                    }
                break;
            default:
                dataToReport = `<html>NO EXISTE ESTE TIPO DE REPORTE</html>`;
                break;
        }
        let options = {
            year: 'numeric', month: 'numeric', day: 'numeric',
            hour: 'numeric', minute: 'numeric', second: 'numeric',
            hour12: false,
            timeZone: 'America/Los_Angeles' 
          };
        pdfH.create(dataToReport,{
            format:"Letter",
            border:{
                top: "1in"    ,      // default is 0, units: mm, cm, in, px
            right: "1cm",
            bottom: "1in",
            left: "1cm"
            },
            footer:{
                contents:`
                <table style="width: 100%;">
        <tr><td><span style="text-align: left">Usuario: jose</span></td><td><span style="text-align: center">Fecha y hora: ${new Intl.DateTimeFormat("es-MX",options).format(new Date())}</span></td><td><span style="text-align: right">Pág: {{page}}/{{pages}}</span></td></tr>
    </table>`
                
            }
        }).toStream((err:any,stream:any)=>{
            res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'responseType': 'blob',
                'Content-disposition': `attachment; filename=reportSumagro.pdf`
            });
            stream.pipe(res);
        })

    }

    async generateReportAplicated(req:express.Request,res:express.Response){
        
        if(!req.body.ingenioId) throw res.status(400).send("Missin ingenioId parameter");
        
        if(!req.body.zonas) throw res.status(400).send("Missin zonas parameter");
        if(!req.body.ejidos) throw res.status(400).send("Missin ejidos parameter");
        if(!req.body.productos) throw res.status(400).send("Missin productos parameter");
        if(!req.body.parcelas) throw res.status(400).send("Missin parcelas parameter");
        if(!req.body.type) throw res.status(400).send("Missin type parameter");
        if(!req.body.subType) throw res.status(400).send("Missin subType parameter");
        if(!req.body.dateStart) throw res.status(400).send("Missin dateStart parameter");
        if(!req.body.dateEnd) throw res.status(400).send("Missin dateEnd parameter");
        let { ingenioId,zonas,ejidos,productos,parcelas,type,dateStart,dateEnd,subType} = req.body;
        let ingenioName:any="";
        ingenioName=await this.ingenioDao.getIngenioDetails(ingenioId);
        let dataToReport:any;
        let data:any;
        
        switch(subType){
            case 'aplicated':
            case 'notaplicated':
                if(type=="producto" || type=="zona" || type=="ejido" || type=="parcela"){
                    try{
                    data= await this.sumagroReportDao.getAplicatedEntityInfo(ingenioId,zonas,ejidos,parcelas,productos,subType,dateStart,dateEnd,type);
                    
                    dataToReport =await this.sumagroReportDao.getReportInfo("aplicated",type,dateStart,dateEnd,data,ingenioName[0].name,subType); 
                }catch(err){
                    throw res.status(500).send("Error al conectar a la Base de Datos");    
                }
                }else if(type=='outofparcel'){
                    try{    
                        data = await this.sumagroReportDao.getAplicatedOutParcel(dateStart,dateEnd);
                        dataToReport =await this.sumagroReportDao.getReportInfo("aplicated",type,dateStart,dateEnd,data,ingenioName[0].name,subType); 
                    }catch(err){
                        throw res.status(500).send(err);    
                    }
                }else{
                    dataToReport = `<html><body>TIPO DE REPORTE INVALIDO</body></html>`;
                }
            break;
            default:
                dataToReport = `<html><body>TIPO DE REPORTE INVALIDO</body></html>`;
                break;
        }

        
        let options = {
            year: 'numeric', month: 'numeric', day: 'numeric',
            hour: 'numeric', minute: 'numeric', second: 'numeric',
            hour12: false,
            timeZone: 'America/Los_Angeles' 
          };
        pdfH.create(dataToReport,{
            format:"Letter",
            border:{
                top: "1cm"    ,      // default is 0, units: mm, cm, in, px
            right: "1cm",
            bottom: "1in",
            left: "1cm"
            },
            footer:{
                contents:`
                <table style="width: 100%;">
        <tr><td><span style="text-align: left">Usuario: jose</span></td><td><span style="text-align: center">Fecha y hora: ${new Intl.DateTimeFormat("es-MX",options).format(new Date())}</span></td><td><span style="text-align: right">Pág: {{page}}/{{pages}}</span></td></tr>
    </table>`
                
            }
        }).toStream((err:any,stream:any)=>{
            res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'responseType': 'blob',
                'Content-disposition': `attachment; filename=reportSumagro.pdf`
            });
            stream.pipe(res);
        })
    }

    
}