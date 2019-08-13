import Mysql from '../utils/mysql';
import * as log4js from 'log4js';
import { ingenioSection } from '../models/ingenio';
const logger = log4js.getLogger('Sumagro Report Dao');
logger.level = 'debug';

export default class SumagroReportDao{
    private mysqlClient: Mysql;
    
    constructor(mysql: Mysql){
        this.mysqlClient = mysql;
       
    }

    async getReportInfo(from:string,to:string,type: string){
        
        switch(type){
            case ingenioSection.INVENTORY:
                try{
                    
                    let query = 'SELECT * FROM `sumagro-dev`.'+`${ingenioSection.INVENTORY} where date>='${from}' and date<='${to}'`;
                    logger.debug("QUERY TO EXECUTE",query);
                    let data = await this.mysqlClient.query(query);
                    logger.info("DATA OBTAINED",data);
                   
                }catch(err){
                    logger.error('[ERROR] -> '+err);
                }
                break;
            case ingenioSection.APLICATED:
                   
                break;
            case ingenioSection.ENTRANCE:
                
                break;
            case ingenioSection.INTRANSIT:
                    
                break;
            case ingenioSection.OUTPUTS:
                    
                break;
            default:
                   
                break;
        }
        return {};
        
    }

}