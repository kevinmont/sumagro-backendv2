import Mysql from '../utils/mysql';
import * as log4js from 'log4js';

const logger = log4js.getLogger();
logger.level = 'debug';

export default class IntransitDao {
    public mysql : Mysql;

    constructor(mysql : Mysql) {
        this.mysql = mysql;
    }

    async getcountFormuleIntransit(params:any = ''){
       logger.info(`DAO: Method getcountFormuleIntransit Startting`); 
        let sql=`select description, count(description) AS count from ${params} group by description`;
       logger.debug(`Dao: Method getcountFormuleIntransit Ending`);
       return await this.mysql.query(sql);
    }

    async getalldataIntransit(){
        logger.info('DAO: Method getalldataIntransit Startting');
        let sql=`Select * from sumagrointransit`;
        logger.debug('DAO Method getalldataIntransit Ending');
        return await this.mysql.query(sql);
    }

    async getDataByDateAndIngenioOfproduct(dateStart:any, dateEnd:any, ingenioId:any, table:any){
        logger.info('DAO: Method getDataByDateAndIngenioOfproduct Startting');
        let sql=`select distinct(description), count(description) as quantity
        from ${table} where ingenioid=${ingenioId} and date >= '${dateStart}T00:00:00.000Z'
        and date <= '${dateEnd}T00:00:00.000Z' group by description`;
        logger.info(`consulta getDataByDateAndIngenioOfproduct: ${sql}`);
        logger.debug('DAO: Method getDataByDateAndIngenioOfproduct Ending');
        return await this.mysql.query(sql);
    }

    async getDataByDateAndIngenioOfOrder(dateStart:any, dateEnd:any, ingenioId:any,table:any){
        logger.info('DAO: Method getDataByDateAndIngenioOfOrder Startting');
        let sql=`select distinct(description), orderid, count(description) as quantity from ${table}
        where ingenioid=${ingenioId} and date between '${dateStart}T00:00:00.000Z' and '${dateEnd}T23:59:59.000Z'
        group by orderid, description`;
        logger.info(`consulta getDataByDateAndIngenioOfOrder: ${sql}`);
        let products:any= await this.mysql.query(sql);
        logger.info(`resultado getDataByDateAndIngenioOfOrder: ${products}`);

        let resp:any=[];
        let obj:any={};
        for(let item of products){
            if(obj[item.description]){
                obj[item.description].orders.push({orderId:`${item.orderid}`,quantity:`${item.quantity}`})
            }else{
                obj[item.description]={};
                obj[item.description].orders=[{
                    orderId:`${item.orderid}`,quantity:`${item.quantity}`
                }]
            }
        }

        let arr= Object.keys(obj);

        for(let item of arr){
            resp.push({
                producto:`${item}`,
                orders:obj[item].orders
            })
        }
        logger.debug('DAO: Method getDataByDateAndIngenioOfOrder Ending');
        return resp;
    }

    // async getAllDataByDate(dateStart:any, dateEnd:any, ingenioId:any){
    //     logger.info('DAO: Method getAllDataByDate Startting');
    //     let sql=`SELECT * FROM intransit where ingenioId=${ingenioId} and date >= '${dateStart}T00:00:00.000Z' 
    //     and date <= '${dateEnd}T23:59:59.000Z'`;
    //     logger.info(`sql getAllDataByDate: ${sql}`);
    //     logger.debug('Dao: Method getAllDataByDate Ending');
    //     return await this.mysql.query(sql);
    // }

    // async getAllDataByDateSumagro(dateStart:any, dateEnd:any){
    //     logger.info('DAO: Method getAllDataByDate Startting');
    //     let sql=`SELECT * FROM sumagrointransit where date >= '${dateStart}T00:00:00.000Z' 
    //     and date <= '${dateEnd}T23:59:59.000Z'`;
    //     logger.info(`sql getAllDataByDate: ${sql}`);
    //     logger.debug('Dao: Method getAllDataByDate Ending');
    //     return await this.mysql.query(sql);
    // }
}
