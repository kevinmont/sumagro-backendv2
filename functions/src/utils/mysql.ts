import * as mysql from 'mysql';
import * as log4js from 'log4js';
const logger = log4js.getLogger();

export default class Mysql{
    public connection:mysql.Pool;

    constructor(){
        this.connection = mysql.createPool({
            host: 'sumagro-dev.csdxmz0vjytf.us-east-1.rds.amazonaws.com',
            user: 'superUsuario',
            password: 'Dist2019',
            database: 'sumagro-dev'
            });
        this.connection.getConnection((err:any,c:any) => {
            if(c) logger.info('Client MYSQL Conected!!');
            if(err) logger.error('Error conection');
        })
    }

    async query(query:any){
        return new Promise((resolve:any,reject:any)=>{
            this.connection.query(query, (err:any, result:any)=>{
                if(err) logger.error("");
                resolve(result);
            })
        })
    }
   
}