import Mysql from '../utils/mysql';
import * as log4js from 'log4js';
import CoordenatesDao from './coordenatesDao';

const logger = log4js.getLogger()
logger.level= 'debug';

export default class AplicatedDao{
    public mysql: Mysql;
    public coordenatesDao: CoordenatesDao;
    constructor(mysql:Mysql){
        this.mysql= mysql;
        this.coordenatesDao = new CoordenatesDao(mysql);
    }

    async getCounterAplicated(codigo:string){
        logger.info('DAO: Method getCounterAplicated Startting');
        let sql= `SELECT *  FROM `+"`parcela-sacks`"+` WHERE parcela='${codigo}'`;
        logger.info('DAO: Method getCounterAplicated Ending');
        return await this.mysql.query(sql);
    }

    async getOutPlot(productor:string){
        logger.info('DAO: Method getCounterAplicated Startting');
        let sql= `SELECT *  FROM `+"`aplicated`"+` WHERE operator='${productor}' and inplot=0 and used=1`;
        logger.info('DAO: Method getCounterAplicated Ending');
        return await this.mysql.query(sql);
    }

    async getAplicatedByOperator(operator: string){
        logger.info('DAO: Method getAplicatedByOperator Startting');
        let sql= `SELECT * FROM aplicated WHERE operator='${operator}'`;
        logger.info('DAO: Method getAplicatedByOperator Ending');
        return await this.mysql.query(sql);
    }

    async getAplicatedById(id:number){
        logger.info('DAO: Method getAplicatedById Startting');
        let sql= `SELECT * FROM aplicated WHERE id=${id}`;
        logger.info('DAO: Method getAplicatedById Ending');
        return await this.mysql.query(sql);
    }

    async saveAplicated(record:any,operatorName:string){
        logger.info('DAO: Method saveAplicated Startting');
        let sql= `INSERT INTO aplicated(id,description,used,ingenioid,operator) values(${record.id},'${record.description}',false,${record.ingenioId},'${operatorName}')`;
        logger.info(sql);
        logger.info('DAO: Method saveAplicated Ending');
        return await this.mysql.query(sql);
    }

    async updatedAplicated(id:number,longitud:number,latitud:number,dateAplicated:string,inPLot: boolean){
        logger.info('DAO: Method updatedAplicated Startting');
        let coordenatesId = await  this.coordenatesDao.registeringCoordenates(latitud,longitud)
        logger.info(coordenatesId);
        let query = `update aplicated set coordenatesid=${coordenatesId}`+",`inplot`="+((inPLot==true)?1:0)+",`used`=1,`date`="+`'${dateAplicated}' where id=${id};`;
        logger.info('DAO: Method updatedAplicated Ending');
        return await this.mysql.query(query);
    }

    async saveParcelaSack(id:number,parcela:string){
        logger.info('DAO: Method saveParcelaSack Startting');
        let query = 'insert into `parcela-sacks`(id,parcela)'+ `values(${id},'${parcela}')`;
        logger.info('DAO: Method saveParcelaSack Ending');
        return await this.mysql.query(query);
    }

    async getdataaplicatedByDate(dateStart:string, dateEnding: string, ingenioId:any){
        logger.info('DAO: Method getdatainventory Startting');
        let sql=`SELECT * FROM aplicated where ingenioId=${ingenioId} and date >= '${dateStart} 00:00:00.000' 
        and date <= '${dateEnding} 23:59:59.000'`;
        logger.debug('Dao: Method getdatainventory Ending');
        return await this.mysql.query(sql);
    }
}