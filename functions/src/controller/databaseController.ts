import {Request, Response} from 'express';
import AddressDao from '../dao/addressDao';
import CoordenatesDao from '../dao/coordenatesDao';
import * as log4js from 'log4js';
import * as pdf from 'html-pdf';
import DatabaseDao from '../dao/databaseDao';
import Mysql from '../utils/mysql';
import AplicatedDao from '../dao/aplicatedDao';
import PdfHelper from '../utils/Pdf-Helper';
import { PropertiesUpdatables } from '../models/database';
const logger= log4js.getLogger();
logger.level ='debug';
export default class DatabaseController{
    public databaseDao: DatabaseDao;
    public addressDao: AddressDao; 
    public coordenatesDao:CoordenatesDao;
    public aplicatedDao:AplicatedDao;
    public pdfHelper: PdfHelper;
    public mysql: Mysql;
    constructor (mysql: Mysql){
        this.coordenatesDao= new CoordenatesDao(mysql);
        this.addressDao= new AddressDao(mysql);
        this.databaseDao = new DatabaseDao();
        this.aplicatedDao = new AplicatedDao(mysql);
        this.pdfHelper = new PdfHelper();
        this.mysql=mysql;
    }

    async uploadDatabaseIngenio (req:Request, res:Response){
        logger.info('CONTROLLER: Method uploadDatabaseIngenio Startting');
        let ingenioId= req.params.ingenioId;
        let records= req.body.records;

        if(!ingenioId) throw res.status(400).send('{"msg":"ingenioId is required"}');
        if(!records) throw res.status(400).send('{"msg":"records is required"}');
        let error:any=[];
        records = records.reverse();
        records.pop();
        records = records.reverse();
        logger.debug(JSON.stringify(records));
        for(let record of records){
            logger.info("RECORD",record[23],record[24]);
            let address= record[5];
            let addressId:any= await this.addressDao.createAddressByLocalidad(address);
            let coordenatesId:any= await this.coordenatesDao.registeringCoordenates(record[23],record[24]);
            logger.info("coordenatesId: " + typeof coordenatesId);
            logger.info("coordenatesId 2: " + coordenatesId);
            let err:any= await this.databaseDao.saveDatabase(record, addressId,coordenatesId,ingenioId)
             await this.parcelaDetails(record,ingenioId);
            if(typeof err == "string"){
                error.push(err); 
            }
        }

        logger.debug('CONTROLLER: Method uploadDatabaseIngenio Ending');
        (!error.length)? res.status(200).send(`{}`):res.status(409).send(error);   
    }

    async parcelaDetails(recods:any,ingenioId:number){
        logger.info("SAVIN IN ENTITY PARCELAS");
        let query = "INSERT INTO `sumagro-dev`.parcelas(codigo,bultos,productor,aplicated,zona,ejido,ingenioid)"+` values('${recods[1]}','${recods[28]}','${recods[2]}',0,'${recods[0]}','${recods[10]}',${ingenioId});`;
        logger.info("SAVED IN ENTITY PARCELA");
        return this.mysql.query(query);
    }

    async getDatabase(req: Request,res: Response){
        let ingenioId = req.params.ingenioId;
        let response:any = await this.databaseDao.getRecordsByIngenioId(ingenioId);
        for(let record of response){
            let coordenateAplicated:any = await this.coordenatesDao.getCoordenatesById(record.coordenatesid);

                record.latitud=coordenateAplicated[0].latitud,
                record.longitud=coordenateAplicated[0].longitud
                delete record.coordenatesid;
                delete record.ingenioid;
        }
        res.status(200).send(response);
    }

    async getExcel(req:Request,res: any){
        let ingenioId = req.params.ingenioId;
        let response = await this.databaseDao.getRecordsByIngenioId(ingenioId);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
        res.xls('database.xlsx',response);
    }

    async getEjidoByIngenioId(req: Request, res: Response) {
        logger.info('CONTROLLER: Method getEjidoByIngenioId Starting');

        if (!req.params.ingenioId) throw res.status(400).send('{ "msg":"ingenioId is required"}');
        let ingenioId = req.params.ingenioId;
        let parseId:number = parseInt(ingenioId)
        let ejido:any = await this.databaseDao.getEjidoByIngenio(parseId);
        if(!ejido.length) res.status(200).send({})
        logger.info(ejido);
        let objectdata:any=[];
        for(let element of ejido){
            objectdata.push(element.ejidolocalidad);
        }
        res.status(200).send(objectdata);
        logger.debug('CONTROLLER: Method getEjidoByIngenioId Ending');
    }

    async getParcelaByEjido(req: Request, res: Response) {
        logger.info('CONTROLLER: Method getParcelaByEjido Starting');

        if (!req.params.ejido) throw res.status(400).send('{ "msg":"ejido is required"}');
        let ejido:string = req.params.ejido;
        let database:any = await this.databaseDao.getRecordsByEjido(ejido);
        let parcelas: any = [];
        for (let parcela of database) {
            let coordenate:any = await this.coordenatesDao.getCoordenatesById(parcela.coordenatesid)
            let parcelasSacks:any = await this.aplicatedDao.getCounterAplicated(parcela.codigo);
            let outPlotSacks:any = await this.aplicatedDao.getOutPlot(parcela.productor);
            for(let item of outPlotSacks){
                let tempCoord:any = await this.coordenatesDao.getCoordenatesById(item.coordenatesid);
                item.coordenates = {
                 longitud:   tempCoord[0].longitud,
                 latitud: tempCoord[0].latitud
                }
            }
            parcelas.push({
                clave: `${parcela.codigo}`,
                productor: parcela.productor,
                formula: parcela.formula,
                ingenioId: `${parcela.ingenioid}`,
                latitud:`${coordenate[0].latitud}`,
                longitud: `${coordenate[0].longitud}`,
                bultos: +parcela.bultos,
                outPlotSacks,
                sacks: parcelasSacks,
                completed: (parcelasSacks.length>=+parcela.bultos),
            })
        }
        res.status(200).send(parcelas);
        logger.debug('CONTROLLER: Method getParcelaByEjido Ending');
    }

    async generateVale(req:Request,res:Response){
        console.log("SERVICIO DE RETORNO DE VALES");
        let ingenioId:number = parseInt(req.query.ingenioId);
        let rangoIni:number = parseInt(req.query.ranIni);
        let rangoFin:number = parseInt(req.query.ranFin);
        let records = await this.databaseDao.getRecordsByRango(ingenioId,rangoIni,rangoFin);
        let report =await this.pdfHelper.generateVale(records);
        console.log("SIN PROBLEMAS");
        pdf.create(report,{ format: 'Letter',border: {
            top: "1in"    ,      // default is 0, units: mm, cm, in, px
           right: "1cm",
           bottom: "1in",
           left: "1cm"
         } }).toStream((function(err,stream){
           res.writeHead(200, {
             'Content-Type': 'application/pdf',
             'responseType': 'blob',
             'Content-disposition': `attachment; filename=vales.pdf`
         });
         stream.pipe(res);
 }))
    }

   async updateProperty(req: Request,res: Response){
        if(!req.params.parcela) throw res.status(400).send('parcela missing parameter');
        if(!req.params.type) throw res.status(400).send('type missing type');
        if(!req.body.value) throw res.status(400).send('value missing value');
        let codigo = req.params.parcela;
        let type= req.params.type;
        let value = req.body.value;
        if(!PropertiesUpdatables.includes(type.toLowerCase())) throw res.status(409).send("Type parameter is invalid");

        let responseQuery = await this.databaseDao.updateProperty(codigo,type,value);
        if(type=="bultos"){
        await this.databaseDao.updatedParcelas(codigo,type,value);
        }

        logger.info("Updated Property",responseQuery);
        res.status(200).send({msg:"updated"});

    }
}