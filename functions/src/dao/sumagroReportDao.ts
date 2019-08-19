import Mysql from '../utils/mysql';
import * as log4js from 'log4js';
const logger = log4js.getLogger('Sumagro Report Dao');
logger.level = 'debug';
import {ReportTemplate} from '../utils/reportTemplate';
export default class SumagroReportDao{
    private mysqlClient: Mysql;
    private reportTemplate : ReportTemplate;
    constructor(mysql: Mysql){
        this.mysqlClient = mysql;
        this.reportTemplate = new ReportTemplate(mysql);
    }

    async getReportInfo(from:string,to:string,type: string,typeFormat:string){
      
                try{
                    
                    let query = 'SELECT * FROM `sumagro-dev`.'+`${type} where date>='${from}' and date<='${to}'`;
                    logger.debug("QUERY TO EXECUTE",query);
                    let data = await this.mysqlClient.query(query);
                    logger.info("Data obtained",data);
                    let pdfBody = await this.reportTemplate.getReport(from,to,type,data,typeFormat);
                    return pdfBody;
                }catch(err){
                    logger.error('[ERROR] -> '+err);
                    return "";
                }
               
        
    }

}