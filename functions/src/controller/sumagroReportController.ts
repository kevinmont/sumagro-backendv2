import Mysql from '../utils/mysql';
import * as express from 'express';

import {  arrTypesFilters, arrTypesFiltersCompare } from '../models/ingenio';
import * as pdfH from 'html-pdf';
import * as Log4js from 'log4js';
import InventoryDao from '../dao/inventoryDao';
import IntransitDao from '../dao/intransitDao';
import OutputDao from '../dao/outputDao';
import SumagroOutputDao from '../dao/sumagroOutputDao';
import AplicatedDao from '../dao/aplicatedDao';
//import EntranceDao from '../dao/entranceDao';
import ingenioDao from '../dao/ingenioDao';
import SumagroReportDao from '../dao/sumagroReportDao';
import AddressDao from '../dao/addressDao';
import UserDao from '../dao/userDao';

const logger =  Log4js .getLogger('Sumagro Report Controller');
logger.level = 'info';
export default class SumagroReportController{
    private inventoryDao: InventoryDao;
    private intransitDao: IntransitDao;
    private outputDao: OutputDao;
    private sumagroOutputDao: SumagroOutputDao;
    private aplicatedDao: AplicatedDao;
    //private entranceDao: EntranceDao;
    private ingenioDAO : ingenioDao;
    private sumagroReportDao: SumagroReportDao;
    private addressDao: AddressDao;
    private userDao: UserDao;
    constructor( mysql: Mysql){
        this.aplicatedDao = new AplicatedDao(mysql);
        this.intransitDao= new IntransitDao(mysql);
        this.inventoryDao = new InventoryDao(mysql);
        //this.entranceDao = new EntranceDao(mysql);
        this.outputDao = new OutputDao(mysql);
        this.sumagroOutputDao= new SumagroOutputDao(mysql);
        this.ingenioDAO= new ingenioDao(mysql);
        this.sumagroReportDao= new SumagroReportDao(mysql);
        this.addressDao= new AddressDao(mysql);
        this.userDao= new UserDao(mysql);
    }

    async generateReport(req:any,res:express.Response){
        logger.info('CONTROLLER: Method generateReport Startting');
        if (!req.query.dateStart) throw res.status(400).send(`dateStart is required`);
        if (!req.query.dateEnd) throw res.status(400).send(`dateEnd is required`);
        if (!req.query.table) throw res.status(400).send(`table is required`);
        if (!req.query.type) throw res.status(400).send(`type is required`);
        logger.info(`validación ${!(req.query.dateStart <= req.query.dateEnd)}`);
        if (!(req.query.dateStart <= req.query.dateEnd)) throw  res.status(400).send({ msg: 'dateStart is greater than dateEnd' });
        let dataToReport="";
        if(req.query.dateStart==req.query.dateEnd){
            req.query.dateStart = req.query.dateStart+"T00:00:00.000Z";
            req.query.dateEnd = req.query.dateEnd+"T23:59:59.000Z";
        }
        let userInfo:any = await this.userDao.getUserByEmail(req.headers.email);

        let {table,dateStart,dateEnd,ingenioId } = req.query;
        if(arrTypesFilters.includes(table)){
            let type = req.query.type;
            switch(table){
                case arrTypesFiltersCompare.entrance:
                    if(type=='producto' || type=="orden"){
                    let data = await this.sumagroReportDao.getDataReportEntityByProduct("1",table,ingenioId,dateStart,dateEnd);
                    let ingenioData:any =await  this.ingenioDAO.getIngenioDetails(ingenioId);
                    
                    let ingenioAddress = await this.addressDao.getAddressById(ingenioData[0].addressid);
                    dataToReport= await this.sumagroReportDao.getReportInfo("1",table,type,dateStart,dateEnd,data,ingenioData,ingenioAddress);
                    }else{
                        dataToReport = "<html><body><h1>NO EXISTE EL TIPO DE REPORTE</h1></body></html>";
                    }
                break;
                case arrTypesFiltersCompare.outputs:
                        if(type=='producto'){
                            let data = await this.sumagroReportDao.getDataReportEntityByProduct("2",table,ingenioId,dateStart,dateEnd);
                            let ingenioData:any =await  this.ingenioDAO.getIngenioDetails(ingenioId);
                            
                            let ingenioAddress = await this.addressDao.getAddressById(ingenioData[0].addressid);
                            dataToReport= await this.sumagroReportDao.getReportInfo("2",table,type,dateStart,dateEnd,data,ingenioData,ingenioAddress);
                            }else{
                                dataToReport = "<html><body><h1>NO EXISTE EL TIPO DE REPORTE</h1></body></html>";
                            }
                break;
                case arrTypesFiltersCompare.intransit:
                        if(type=='producto' || type=="orden"){
                            let data = await this.sumagroReportDao.getDataReportEntityByProduct("1",table,ingenioId,dateStart,dateEnd);
                            let ingenioData:any =await  this.ingenioDAO.getIngenioDetails(ingenioId);
                            
                            let ingenioAddress = await this.addressDao.getAddressById(ingenioData[0].addressid);
                            dataToReport= await this.sumagroReportDao.getReportInfo("1",table,type,dateStart,dateEnd,data,ingenioData,ingenioAddress);
                            }else{
                                dataToReport = "<html><body><h1>NO EXISTE EL TIPO DE REPORTE</h1></body></html>";
                            }
                break;
                case arrTypesFiltersCompare.inventory:
                        if(type=='producto'){
                            let data = await this.sumagroReportDao.getDataReportEntityByProduct("2",table,ingenioId,dateStart,dateEnd);
                            let ingenioData:any =await  this.ingenioDAO.getIngenioDetails(ingenioId);
                            let ingenioAddress = await this.addressDao.getAddressById(ingenioData[0].addressid);
                            dataToReport= await this.sumagroReportDao.getReportInfo("2",table,type,dateStart,dateEnd,data,ingenioData,ingenioAddress);
                            }else{
                                dataToReport = "<html><body><h1>NO EXISTE EL TIPO DE REPORTE</h1></body></html>";
                            }
                    break;
                case arrTypesFiltersCompare.aplicated:
                    let subtype = req.query.subtype;
                    if(subtype=="aplicated" || subtype=="notaplicated" || subtype=="outOfParcel"){
                        if(type=='producto' || type=='zona' || type=='ejido' || type=='parcela'){
                            let data:any;
                            if(subtype=="aplicated" && type=="producto" ){
                                data= await this.sumagroReportDao.getDataReportEntityByProduct("2",table,ingenioId,dateStart,dateEnd);
                            }else if(subtype=="aplicated"){
                                data = await this.sumagroReportDao.getDataToReportOfParcelas(ingenioId,dateStart,dateEnd);
                            }else if(subtype=="notaplicated" ){
                                data = await this.sumagroReportDao.getDataToReportOfParcelasNotAplicated(ingenioId,dateStart,dateEnd);
                            }else if(subtype=="outOfParcel"){
                                data = await this.sumagroReportDao.getDataToReportOutOfParcelasNotAplicated(ingenioId,dateStart,dateEnd);
                            }
                            let ingenioData:any =await  this.ingenioDAO.getIngenioDetails(ingenioId);
                            logger.info("GETTING DATA");
                            let ingenioAddress = await this.addressDao.getAddressById(ingenioData[0].addressid);
                            dataToReport= await this.sumagroReportDao.getReportInfo("3",table,type,dateStart,dateEnd,data,ingenioData,ingenioAddress,subtype);
                            }else{
                                dataToReport = "<html><body><h1>NO EXISTE EL TIPO DE REPORTE</h1></body></html>";
                            }        
                        }
                break;
                case arrTypesFiltersCompare.sumagrooutputs:
                        if(type=='producto' || type=="orden" || type=="cliente"){
                            let data = await this.sumagroReportDao.getDataOfEntranceIntransit(type,table,dateStart,dateEnd);
                            dataToReport= await this.sumagroReportDao.getReportInfo("1",table,type,dateStart,dateEnd,data,"","");
                            }else{
                                dataToReport = "<html><body><h1>NO EXISTE EL TIPO DE REPORTE</h1></body></html>";
                            }
                    break;
                case arrTypesFiltersCompare.sumagrointransit:
                        if(type=='producto' || type=="orden" || type=="cliente"){
                            let data = await this.sumagroReportDao.getDataOfEntranceIntransit(type,table,dateStart,dateEnd);
                            dataToReport= await this.sumagroReportDao.getReportInfo("1",table,type,dateStart,dateEnd,data,"","");
                            }else{
                                dataToReport = "<html><body><h1>NO EXISTE EL TIPO DE REPORTE</h1></body></html>";
                            }
                    break;
                default:
                        dataToReport = "<html><body>NO EXISTEN DATOS</body></html>";        
                    break;
            }
            
        }else{
            dataToReport = "<html><body>NO EXISTEN DATOS</body></html>";
        }


        
        pdfH.create(dataToReport,{
            border:{
                top: "1in"    ,      // default is 0, units: mm, cm, in, px
            right: "1cm",
            bottom: "1in",
            left: "1cm"
            },
            footer:{
                contents:`
                <table style="width: 100%;">
        <tr><td><span style="text-align: left">Usuario: ${userInfo.rol}</span></td><td><span style="text-align: center">Fecha y hora: ${new Date()}</span></td><td><span style="text-align: right">Pág: {{page}}/{{pages}}</span></td></tr>
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

    async getDataForProductFilter(req: express.Request, res: express.Response) {

        logger.info('CONTROLLER: Method getDataForProductFilter Startting');
        if (!req.query.dateStart) throw res.status(400).send(`dateStart is required`);
        if (!req.query.dateEnd) throw res.status(400).send(`dateEnd is required`);
        if (!req.query.table) throw res.status(400).send(`table is required`);
        if (!req.query.type) throw res.status(400).send(`type is required`);
        logger.info(`validación ${!(req.query.dateStart <= req.query.dateEnd)}`);
        if (!(req.query.dateStart <= req.query.dateEnd)) throw res.status(400).send({ msg: 'dateStart is greater than dateEnd' });

        logger.info(`typo: ${req.query.type} debe ser orden|producto`);
        logger.info(`table: ${req.query.table} 
        debe ser intransit|outputs|entrance|inventory|sumagrointransit|sumagrooutputs`);
        logger.info(`fechaInicio: ${req.query.dateStart}`);
        logger.info(`fechaFin: ${req.query.dateEnd}`);
        logger.info(`ingenioId: ${req.query.ingenioId}`);

        // let allDataCount: any = [];        
        if (arrTypesFilters.includes(req.query.table)) {

            let table: any = req.query.table;
            let ingenioId: any = req.query.ingenioId;
            let type: any = req.query.type;
            let dateStart: any = req.query.dateStart;
            let dateEnd: any = req.query.dateEnd;

            switch (table) {
                case arrTypesFiltersCompare.inventory:
                    logger.info(`entro al inventario`);
                    if (!ingenioId) throw res.status(400).send({ msg: 'ingenioId is required' });
                    if (type == 'producto') {
                        let dataInventory: any = await this.inventoryDao.getdatainventoryByDate(dateStart, dateEnd, ingenioId);
                        logger.info(`datos: ${dataInventory}`);
                        res.status(200).send(dataInventory);
                    } else {
                        res.status(400).send({ msg: `cannot be done by ${type}`});
                    }
                    break;
                // case arrTypesFiltersCompare.entrance:
                //     logger.info('entro a entradas');
                //     if (!ingenioId) throw res.status(400).send({ msg: 'ingenioId is required' });
                //     if (type == 'producto') {
                //         let dataEntrance: any = await this.entranceDao.getDataReportEntranceByProduct(ingenioId, dateStart, dateEnd);
                //         logger.info(`datos: ${dataEntrance}`);
                //         res.status(200).send(dataEntrance);
                //     } else {
                //         let dataEntrance: any = await this.entranceDao.getDataReportEntranceByOrder(ingenioId, dateStart,dateEnd);
                //         logger.info(`datos: ${dataEntrance}`);
                //         res.status(200).send(dataEntrance)
                //     }
                //     break;
                case arrTypesFiltersCompare.intransit:
                    logger.info(`entro a en transito`);
                    if (!ingenioId) throw res.status(400).send({ msg: 'ingenioId is required' });
                    if (type == 'producto') {
                        let resp: any = await this.intransitDao.getDataByDateAndIngenioOfproduct(dateStart, dateEnd, ingenioId, 'intransit');
                         res.status(200).send(resp);
                    } else if (type == 'orden') {
                        let resp: any = await this.intransitDao.getDataByDateAndIngenioOfOrder(dateStart, dateEnd, ingenioId, 'intransit');
                         res.status(200).send(resp);
                    }
                    break;
                case arrTypesFiltersCompare.sumagrointransit:
                    logger.info(`entro a sumagrointransit`);
                    if (!ingenioId) throw res.status(400).send({ msg: 'ingenioId is required' });
                    if (type == 'producto') {
                        let resp: any = await this.intransitDao.getDataByDateAndIngenioOfproduct(dateStart, dateEnd, ingenioId, 'sumagrointransit');
                         res.status(200).send(resp);
                    } else if (type == 'orden') {
                        let resp: any = await this.intransitDao.getDataByDateAndIngenioOfOrder(dateStart, dateEnd, ingenioId, 'sumagrointransit');
                         res.status(200).send(resp);
                    }
                    break;
                case arrTypesFiltersCompare.outputs:
                    logger.info('entro a outputs');
                    if (!ingenioId) throw res.status(400).send({ msg: 'ingenioId is required' });
                    if (type == 'producto') {
                        let resp: any = await this.outputDao.getDataByIngenioAndDateForProduct(dateStart, dateEnd, ingenioId);
                         res.status(200).send(resp);
                    } else {
                         res.status(400).send({ msg: `cannot be done by ${type}` });
                    }
                    break;
                case arrTypesFiltersCompare.sumagrooutputs:
                    logger.info('entro a sumagrooutputs');
                    if (!ingenioId) throw res.status(400).send({ msg: 'ingenioId is required' });
                    if (type == 'producto') {
                        let resp: any = await this.sumagroOutputDao.getDataByIngenioAndDateForProducts(dateStart, dateEnd, ingenioId);
                         res.status(200).send(resp);
                    } else if (type == 'orden') {
                        let resp: any = await this.sumagroOutputDao.getDataByIngenioAndDateForOrders(dateStart, dateEnd, ingenioId);
                         res.status(200).send(resp);
                    }
                    break;
                case arrTypesFiltersCompare.aplicated:
                    logger.info('entro a sumagrooutputs');
                    if (!ingenioId) throw res.status(400).send({ msg: 'ingenioId is required' });
                    if (type == 'producto') {
                        let resp: any = await this.aplicatedDao.getDataByIngenioAndDateForProducts(dateStart, dateEnd, ingenioId);
                         res.status(200).send(resp);
                    } else {
                         res.status(400).send({ msg: `cannot be done by ${type}` });
                    }
                    break;

                default: 
                 res.status(400).send({ msg: `something went wrong` });
                    break;
            }
        }else{
         res.status(400).send({ msg: `something went wrong` });
        }
    }

    
}