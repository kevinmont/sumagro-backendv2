import * as admin from 'firebase-admin';
import credentials from '../models/trackingpopodevaca';
import Mysql from '../utils/mysql';
import * as log4js from 'log4js';
const logger = log4js.getLogger();
logger.level = 'debug';

export default class UserDao{
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

    async createUserFirebase(user:any){
        logger.info('DAO: Method createUserFirebase Starting')
        return new Promise(async(resolve,reject)=>{
            await admin.auth().createUser({email: user.email, password: user.password})
               .then(async (userRecord:any)=> {
                 // See the UserRecord reference doc for the contents of userRecord.
                 logger.info('Successfully created new user:', userRecord.uid);
                 let key = userRecord.uid;
                 delete user.password;
                 user.uid = key;
                 await this.db.ref(`/sumagro/users`).child(key).set(user,(err:any)=>{
                   if(err) {
                       logger.info(err); reject("Usuario ya existente");
                   }else{
                        resolve("Usuario registrado");
                   }
                   
               }
               );
   
               })
               .catch(function(error:any) {
                 resolve("Error creating new user:"+error);
               });
               
               logger.debug('DAO: Method createUserFirebase Ending')
           })
    }

    async createUser(user:any){
        logger.info('DAO: Method createUser Starting');
        let sql = `INSERT INTO users VALUES("${user.uid}","${user.email}","${user.ingenioId}","${user.rol}",${null})`;
        logger.debug('DAO: Method createUser Ending');
        return await this.mysql.query(sql);
    }

    async getUserById(email:string){
        logger.info('DAO: Method getUserById Starting');
        let sql = `SELECT * FROM users where email = "${email}"`;
        logger.debug('DAO: Method getUserById Ending');
        return await this.mysql.query(sql);
    }

    async getUser(userId:any){
        logger.info(`Dao: Method getUser startting`);
        let sql= `SELECT EXISTS(SELECT * FROM users WHERE id='${userId}')`;
        let execution: any= await this.mysql.query(sql);

         let count= execution[0][`EXISTS(SELECT id FROM ingenios WHERE id=${userId})`];
         logger.debug(`Dao: Method getUser Ending`);
        (count < 1)?  false : true; 
    }

    async deleteUser(userId: any){
        logger.info(`Dao: Method deleteUser Startting`);
        let sql= `DELETE FROM users WHERE id='${userId}'`;
        logger.debug(`Dao: Method deleteUsers Ending`);
        return await this.mysql.query(sql);
    }

}
