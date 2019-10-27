import * as log4js from 'log4js';
import Mysql from "../../utils/mysql";
import { AbstractDao } from "../abstractDao";
import { AplicatedDao } from '../aplicatedDao';
import { CoordenatesDao } from "../coordenatesDao";

const logger = log4js.getLogger('sumagro.dao.impl.ApplicatedDao')

export class AplicatedDaoImpl extends AbstractDao implements AplicatedDao{
    constructor(db: Mysql, 
        private coordenatesDao: CoordenatesDao) {
        super(db);
    }

    async getCounterAplicated(codigo: string){
        logger.info('DAO: Method getCounterAplicated Startting');
        let sql= `SELECT *  FROM `+"`parcela-sacks`"+` WHERE parcela='${codigo}'`;
        logger.info('DAO: Method getCounterAplicated Ending');
        return await this.db.query(sql);
    }

    async getOutPlot(productor: string){
        logger.info('DAO: Method getCounterAplicated Startting');
        let sql= `SELECT *  FROM `+"`aplicated`"+` WHERE operator='${productor}' and inplot=0 and used=1`;
        logger.info('DAO: Method getCounterAplicated Ending');
        return await this.db.query(sql);
    }

    async getAplicatedByOperator(operator: string){
        logger.info('DAO: Method getAplicatedByOperator Startting');
        let sql= `SELECT * FROM aplicated WHERE operator='${operator}'`;
        logger.info('DAO: Method getAplicatedByOperator Ending');
        return await this.db.query(sql);
    }

    async getAplicatedById(id: number){
        logger.info('DAO: Method getAplicatedById Startting');
        let sql= `SELECT * FROM aplicated WHERE id=${id}`;
        logger.info('DAO: Method getAplicatedById Ending');
        return await this.db.query(sql);
    }

    async saveAplicated(record: any, operatorName: string){
        logger.info('DAO: Method saveAplicated Startting');
        let sql= `INSERT INTO aplicated(id,description,used,ingenioid,operator) values(${record.id},'${record.description}',false,${record.ingenioId},'${operatorName}')`;
        logger.info(sql);
        logger.info('DAO: Method saveAplicated Ending');
        return await this.db.query(sql);
    }

    async updatedAplicated(id: number, longitud: number, latitud: number, dateAplicated: string, inPLot: boolean){
        logger.info('DAO: Method updatedAplicated Startting');
        let coordenatesId = await  this.coordenatesDao.registeringCoordenates(latitud,longitud)
        logger.info(coordenatesId);
        let query = `update aplicated set coordenatesid=${coordenatesId}`+",`inplot`="+((inPLot==true)?1:0)+",`used`=1,`date`="+`'${dateAplicated}' where id=${id};`;
        logger.info('DAO: Method updatedAplicated Ending');
        return await this.db.query(query);
    }

    async saveParcelaSack(id: number, parcela: string, date: string){
        logger.info('DAO: Method saveParcelaSack Startting');
        let query = 'insert into `parcela-sacks`(id,parcela,date)'+ ` values(${id},'${parcela}','${date}')`;
        logger.info('DAO: Method saveParcelaSack Ending');
        return await this.db.query(query);
    }

    // async getdataaplicatedByDate(dateStart:string, dateEnd: string, ingenioId:any){
    //     logger.info('DAO: Method getdataaplicatedByDate Startting');
    //     let sql=`SELECT * FROM aplicated where ingenioId=${ingenioId} and date >= '${dateStart}T00:00:00.000Z' 
    //     and date <= '${dateEnd}T23:59:59.000Z'`;
    //     logger.debug('Dao: Method getdataaplicatedByDate Ending');
    //     return await this.db.query(sql);
    // }

    async getDataByIngenioAndDateForProducts(dateStart: any, dateEnd: any, ingenioId: any){
        logger.info('DAO: Method getDataByIngenioAndDateForProducts Startting');
        let sql=`select distinct(description), count(description) as quantity from aplicated
        where ingenioid=${ingenioId} and date between '${dateStart}T00:00:00.000Z' and '${dateEnd}T23:59:59.000Z'
        group by description`;
        logger.debug('DAO: Method getDataByIngenioAndDateForProducts Ending');
        return await this.db.query(sql);
    }

}