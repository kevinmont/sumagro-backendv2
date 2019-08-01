import * as admin from 'firebase-admin';
import credentials from '../models/trackingpopodevaca';

export default class Firebase{
    public db: any;
    public config: any;
    public tables : any;
    constructor(config:any){
        this.config = config.firebase;
        let credents:any = credentials;
        this.tables = this.config.env.TABLES;
        admin.initializeApp({
            credential: admin.credential.cert(credents),
            databaseURL: config.firebase.databaseURL
        });
        this.db = admin.database();
    }
}