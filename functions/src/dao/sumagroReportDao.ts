import Mysql from '../utils/mysql';
import * as log4js from 'log4js';
const logger = log4js.getLogger('Sumagro Report Dao');
logger.level = 'debug';
import {ReportTemplate} from '../utils/reportTemplate';
export default class SumagroReportDao{
     private mysql: Mysql;
    private reportTemplate : ReportTemplate;
    constructor(mysql: Mysql){
        this.mysql = mysql;
        this.reportTemplate = new ReportTemplate(mysql);
    }

    async getReportInfo(clase:string,table:string,type:string,dateStart:string,dateEnd:string,data:any,ingenioData:any,ingenioAddress:any,subtype?:string){
        return this.reportTemplate.getReport(clase,table,type,dateStart,dateEnd,data,ingenioData,ingenioAddress,subtype);
    }


    async getDataReportEntityByProduct(type:string,table:string,ingenioId:number,dateStart:string,dateEnd:string){
        logger.info('DAO: Starting Method getDataReportEntranceByProduct');
        let query="";
        if(type=="1"){
        query = "select distinct(description),count(description) as count,date,orderid  from `sumagro-dev`."+`${table}`+
        ` where ingenioid = ${ingenioId} and date between '${dateStart}' and '${dateEnd}' group by description,orderid,date;`;
        }else{
            query = "select distinct(description),count(description) as count,date  from `sumagro-dev`."+`${table}`+
        ` where ingenioid = ${ingenioId} and date between '${dateStart}' and '${dateEnd}' group by description,date;`;
        }
        logger.info('DAO: Method getDataReportEntranceByProduct Ended',query);
        return this.mysql.query(query);
    };


    async getDataToReportOfParcelas(ingenioId:number,dateStart:string,dateEnd:string){
        logger.info("DAO: sumagroReportDAO Starting Method getDataToReportOfParcelas Starting");
        let query = "select a.bultos,a.productor,a.formula,a.codigo,a.ejidolocalidad,a.zona,t.date from `sumagro-dev`.database as a, `sumagro-dev`.parcelas as t where a.codigo = t.codigo and a.codigo IN (select codigo from `sumagro-dev`.parcelas where bultos=aplicated and ingenioid="+`${ingenioId} and date between '${dateStart}' and '${dateEnd}');`;
        logger.info("DAO: sumagroReportDAO Starting Method getDataToReportOfParcelas Ended");
        return this.mysql.query(query);
    }

    async getDataToReportOfParcelasNotAplicated(ingenioId:number,dateStart:string,dateEnd:string){
        logger.info("DAO: sumagroReportDAO Starting Method getDataToReportOfParcelasNotAplicated Starting");
        let query = "select t.codigo,t.bultos,t.productor,t.aplicated,t.zona,t.ejido,t.date,a.formula from `sumagro-dev`.parcelas as t, `sumagro-dev`.database as a where t.codigo=a.codigo and t.codigo IN(select codigo from `sumagro-dev`"+`.parcelas where aplicated<bultos and date between '${dateStart}' and '${dateEnd}' and ingenioid=${ingenioId});`;
        logger.info("DAO: sumagroReportDAO Starting Method getDataToReportOfParcelasNotAplicated Ended");
        return this.mysql.query(query);
    }

    async getDataToReportOutOfParcelasNotAplicated(ingenioId:number,dateStart:string,dateEnd:string){
        logger.info("DAO: sumagroReportDAO Starting Method getDataToReportOfParcelasNotAplicated Starting");
        let query = "select count(description) as count,description,operator,date from `sumagro-dev`.aplicated where inplot = '0'"+` and date between '${dateStart}' and '${dateEnd}' and ingenioid=${ingenioId} group by description,date;`;
        logger.info("DAO: sumagroReportDAO Starting Method getDataToReportOfParcelasNotAplicated Ended");
        return this.mysql.query(query);
    }
}