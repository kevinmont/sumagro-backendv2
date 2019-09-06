import Mysql from '../utils/mysql';
import * as log4js from 'log4js';
const logger=log4js.getLogger();
logger.level= 'debug';

export default class SumagroOutputDao{
    public mysql:Mysql;

    constructor(mysql:Mysql){
        this.mysql=mysql;
    }

    async getAllDataOutputs(){
        logger.info('DAO: Method getAllDataOutputs Startting');
        let sql=`select * from sumagrooutputs`;
        logger.debug('DAO: Method getAllDataOutputs Ending');
        return await this.mysql.query(sql);
    }

    async saveOutputs(record:any,operatorName:any,productor:any){
        logger.info('DAO: Method saveOutputs Starting');
        let sql = `INSERT INTO outputs(id,description,operator,userid,ingenioid,productor,date) 
        VALUES(${record.id}, "${record.description}", "${operatorName}", 
        "${record.userId}", ${record.ingenioId},"${productor}","${record.date}")`;
        logger.debug('DAO: Method saveOutputs Ending');
        return await this.mysql.query(sql);
    }

    async getAllDataByDate(dateStart:any, dateEnd:any){
        logger.info('DAO: Method getAllDataByDate Startting');
        let sql=`SELECT * FROM outputs where date >= '${dateStart}T00:00:00.000Z' 
        and date <= '${dateEnd}T23:59:59.000Z'`;
        logger.info(`sql getAllDataByDate: ${sql}`);
        logger.debug('Dao: Method getAllDataByDate Ending');
        return await this.mysql.query(sql);
    }

    async getDataByIngenioAndDateForProducts(dateStart:any, dateEnd:any, ingenioId:any){
        logger.info('DAO: Method getDataByIngenioAndDateForProducts Startting');
        let sql=`select distinct(description), count(description) as quantity from sumagrooutputs
        where ingenioid=${ingenioId} and date between '${dateStart}T00:00:00.000Z' and '${dateEnd}T23:59:59.000Z'
        group by description`;
        logger.debug('DAO: Method getDataByIngenioAndDateForProducts Ending');
        return await this.mysql.query(sql);
    }

    async getDataByIngenioAndDateForOrders(dateStart:any, dateEnd:any, ingenioId:any){
        logger.info('DAO: Method getDataByIngenioAndDateForOrders Startting');
        let sql=`select distinct(description), orderid, count(description) as quantity from sumagrooutputs
        where ingenioid=${ingenioId} and date between '${dateStart}T00:00:00.000Z' and '${dateEnd}T23:59:59.000Z'
        group by orderid, description;`;
        let products:any = await this.mysql.query(sql);
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

        logger.debug('DAO: Method getDataByIngenioAndDateForOrders Ending');
        return resp;
    }
}