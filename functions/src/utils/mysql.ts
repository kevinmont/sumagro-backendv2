import * as mysql from 'mysql';
import * as log4js from 'log4js';
const logger = log4js.getLogger();

export default class Mysql{
    public connection:mysql.Pool;

    constructor(){
        this.connection = mysql.createPool({
            host: 'sumagro-dev.c3xbluk1m0qi.us-east-1.rds.amazonaws.com',
            user: 'sumagroMaster',
            connectTimeout  : 60 * 60 * 1000,
            acquireTimeout  : 60 * 60 * 1000,
            timeout         : 60 * 60 * 1000,
            connectionLimit:1000,
            password: 'Dist2019',
            database: 'sumagro-dev',
            });
        
    }

    async query(query:any){
        logger.info("Calling query method");
        return new Promise((resolve:any,reject:any)=>{
            this.connection.getConnection((err:any,c:any)=>{
                if(err){
                logger.error("Error al conectar",err);
                reject(err);
                }else{
                c.query(query, (err:any, result:any)=>{
                if(err) {
                    logger.error("Error in query",err);
                    reject(err);
                }else{
                    logger.info(typeof c);
                c.release();
                logger.info("Cerrando cliente",typeof c);
                resolve(result);
                }
                
            })
                }
        });
        })
    }
   
}