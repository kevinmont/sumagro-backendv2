import * as admin from 'firebase-admin';
import credentials from '../models/trackingpopodevaca';
import Mysql from '../utils/mysql';
import * as log4js from 'log4js';
const logger = log4js.getLogger();
logger.level = 'debug';

export default class OrderDao{
    public mysql: Mysql;
    public config: any;
    public db: any;
    public tables : any;

    constructor(config:any){
        this.mysql = new Mysql();
        this.config = config.firebase;
        let credents:any = credentials;
        this.tables = this.config.env.TABLES;
        admin.initializeApp({
            credential: admin.credential.cert(credents),
            databaseURL: config.firebase.databaseURL
        });
        this.db = admin.database();
    }

    async deleteOrderById(orderId:string){
        logger.info('DAO: Method deleteOrderById Starting');
        let sql = `DELETE FROM orders WHERE id = ${orderId}`;
        logger.debug('DAO: Method deleteOrderById Ending');
        return await this.mysql.query(sql);
        
    }

    
}