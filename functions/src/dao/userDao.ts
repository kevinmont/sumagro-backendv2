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
        console.log(this.config);
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
}