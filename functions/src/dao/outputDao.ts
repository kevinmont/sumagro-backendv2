import Mysql from '../utils/mysql';
import * as log4js from 'log4js';

const logger = log4js.getLogger();
logger.level ='debug';

export default class OutputDao{
    public mysql:Mysql;

    constructor(mysql:Mysql){
        this.mysql= mysql;
    }
    
    async getAllDataByDate(dateStart:any, dateEnd:any){
        logger.info('DAO: Method getAllDataByDate Startting');
        let sql=`SELECT * FROM outputs where date >= '${dateStart}T00:00:00.000Z' 
        and date <= '${dateEnd}T23:59:59.000Z'`;
        logger.info(`sql getAllDataByDate: ${sql}`);
        logger.debug('Dao: Method getAllDataByDate Ending');
        return await this.mysql.query(sql);
    }

    async getDataByIngenioAndDateForProduct(dateStart:any, dateEnd:any, ingenioId:any){
        logger.info('DAO: Method getDataByIngenioAndDateForProduct Startting');
        let sql= `select distinct(description), count(description) as quantity, productor from outputs 
        where ingenioid=${ingenioId} and date >= '${dateStart}T00:00:00.000Z' and date <= '${dateEnd}T00:00:00.000Z'
        group by productor, description`;
        let products:any= await this.mysql.query(sql);
        let resp:any=[];
        let obj:any={};
        for(let item of products){
            if(obj[item.description]){
                obj[item.description].orders.push({productor:`${item.productor}`,quantity:`${item.quantity}`})
            }else{
                obj[item.description]={};
                obj[item.description].orders=[{
                    productor:`${item.productor}`,quantity:`${item.quantity}`
                }]
            }
        }

        let arr= Object.keys(obj);

        for(let item of arr){
            resp.push({
                producto:`${item}`,
                productores:obj[item].orders
            })
        }

        logger.debug('DAO: Method getDataByIngenioAndDateForProduct Ending');
        return resp;
    }

    // async getAllDataByDateByIngenio(dateStart:any, dateEnd:any, ingenioId:any){
    //     logger.info('DAO: Method getAllDataByDate Startting');
    //     let sql=`SELECT * FROM outputs where ingenioid=${ingenioId} and date >= '${dateStart}T00:00:00.000Z' 
    //     and date <= '${dateEnd}T23:59:59.000Z'`;
    //     logger.info(`sql getAllDataByDate: ${sql}`);
    //     logger.debug('Dao: Method getAllDataByDate Ending');
    //     return await this.mysql.query(sql);
    // }
}
