import * as log4js from 'log4js';
import Mysql from "../../utils/mysql";
import { AbstractDao } from "../abstractDao";
import { EntranceDao } from "../entranceDao";

const logger = log4js.getLogger('sumagro.dao.impl.EntranceDaoImpl');

export class EntranceDaoImpl extends AbstractDao implements EntranceDao{
    constructor(db: Mysql){
        super(db);
    }

    async getAllDataByDate(ingenioId:any,dateStart:any,dateEnd:any){
        logger.info('DAO: Method getAllDataByDate Startting');
        let sql=`SELECT distinct(orderid) FROM entrance where ingenioid=${ingenioId} and date >= '${dateStart}T00:00:00.000Z' 
        and date <= '${dateEnd}T23:59:59.000Z'`;
        logger.info(`sql getAllDataByDate: ${sql}`);
        logger.debug('Dao: Method getAllDataByDate Ending');
        return await this.db.query(sql);
    }

    async getDataReportEntranceByOrder(ingenioId:number,dateStart:string,dateEnd:string){
        logger.info('DAO: Method getDataReportEntranceByOrder');
        let query = `select distinct(orderid),description,count(description) as count from ` +"`sumagro-dev`.entrance"+ ` where ingenioid=${ingenioId} and 
        date between '${dateStart}' and '${dateEnd}' group by orderid,description;`
        logger.info('Getting data',query);
        return await this.db.query(query);
    }

    
}