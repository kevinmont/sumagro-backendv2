import * as admin from 'firebase-admin';
import credentials from '../models/trackingpopodevaca';
import Mysql from '../utils/mysql';
import * as log4js from 'log4js';
const logger = log4js.getLogger();
logger.level = 'debug';

export default class NoticationDao{
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

    async notification(tokens:any,notify:any){
        logger.info("DAO: Methos notification Starting");
        const registrationTokens = tokens;
          
          admin.messaging().sendToDevice(tokens,{notification:notify})
            .then((response:any) => {
              if (response.failureCount > 0) {
                const failedTokens:any = [];
                response.responses.forEach((resp:any, idx:any) => {
                  if (!resp.success) {
                    failedTokens.push(registrationTokens[idx]);
                  }
                });
                logger.info('List of tokens that caused failures: ' + failedTokens);
              }
              logger.debug("DAO: Methos notification Ending");
            });  
    }

}
