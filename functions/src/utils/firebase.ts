import * as admin from 'firebase-admin';
import credentials from '../models/trackingpopodevaca';
import * as log4js from 'log4js';
const logger = log4js.getLogger();
logger.level = 'debug';

export default class Firebase{
    public config: any;
    public db: any;
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

    async deleteUserFirebase(userId: string){
        logger.info(`Dao: Method deleteUserFirebase startting`);
        await this.db.ref(`/sumagro/users`).child(userId).remove()
        .then(function() {
            logger.debug(`Dao: Method deleteUserFirebase Ending`);
          return "USUARIO ELIMINADO CON EXITO";
        })
        .catch(function(err:any) {
         return `ERROR AL ELIMINAR USUARIO CON UID:${userId}, msg: ` + err.message;
        });
    }

    async getUserFirebase(userId:string){
        logger.info(`Dao: Method getUserFirebase startting`);
        let ref= this.db.ref(`/sumagro/users/${userId}`);
        return new Promise((resolve,reject)=>{ ref.once("value",(snapshot:any)=>{
            console.log(snapshot.val());
            if(snapshot.val()==null) {resolve({});}
           else{ 
            logger.info(`Dao: Method getUserFirebase Ending`);
            resolve(snapshot.val());
           }
        })
        });
    }

    async createUserFirebase(user:any){
      return new Promise(async(resolve,reject)=>{
       await admin.auth().createUser({email: user.email, password: user.password})
          .then(async (userRecord)=> {
            // See the UserRecord reference doc for the contents of userRecord.
            console.log("Successfully created new user:", userRecord.uid);
            let key = userRecord.uid;
            delete user.password;
            user.uid = key;
            await this.db.ref(`/sumagro/users`).child(key).set(user,(err:any)=>{
              if(err) {
                  console.log(err); reject("Usuario ya existente");
              }else{
                   resolve(userRecord);
              }
              
          }
          );

          })
          .catch(function(error) {
            resolve("Error creating new user:"+error);
          });
          
          
      })
  }

    async saveToken(uid:string,token: string){

      await this.db.ref(`/sumagro/users`).child(uid).update({token},(err:any)=>{
          if(err) {
              logger.error(err); return "Token Registrado";
          }else{
               return "ERROR al registrar token";
          }
          
      }
      );
    }

    async deleteToken(uid:string){
      await this.db.ref(`/sumagro/users`).child(uid).update({token:null},(err:any)=>{
          if(err) {
              console.log(err); return "Token Registrado";
          }else{
               return "ERROR al registrar token";
          }
          
      }
      );
    }

    async authentication(req: any,res: any,next:any){
      let idToken:any = req.headers.authorization;
      console.log("TOKEN: "+JSON.stringify(idToken));
      try {
          // Use firebase-admin auth to verify the token passed in from the client header.
          // This is token is generated from the firebase client
          // Decoding this token returns the userpayload and all the other token claims you added while creating the custom token
          const userPayload = await admin.auth().verifyIdToken(idToken );
          
          req.headers.uid = userPayload.uid;
          req.headers.email = userPayload.email;
          req.headers.name = userPayload.name;
          console.log("MAIL OF CURRENT USER",req.headers.email );
          next();
          return ;
        } catch (error) {
            console.log(error);
          return res.status(500).json({
            error
          });
        }
      
  }

}
