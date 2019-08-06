import {Request, Response} from 'express';
import UserDao from '../dao/userDao';
import {User} from '../models/user';
import { Nodemailers } from '../utils/Nodemailer-helper';
import config from '../models/config';
import * as log4js from 'log4js';
const logger = log4js.getLogger();
logger.level = 'debug';

export default class UserController{
    public userDao: UserDao;
    public nodemailers: Nodemailers;
    public config:any;

    constructor(){
        this.config= config;
        this.userDao = new UserDao(this.config);
        this.nodemailers = new Nodemailers(this.config);
    }

    async createUser(req: Request, res:Response){
        logger.info("Controller: Methos createUser Starting");
        let { email,uid,rol,ingenioId} = req.body;
        let password = await this.makeid(8);
        let user:User =  {
            email,
            password,
            uid,
            rol,
            ingenioId
        }

        if(user.phoneNumber==undefined){
            delete user.phoneNumber;
        }
        if(user.displayName==undefined){
            delete user.displayName;
        }
       
        if(user.ingenioId == undefined && (user.rol=="CAPTURIST" || user.rol=="WAREHOUSE")){
            delete user.ingenioId;
        }

        
        try{
            let emailUser:any = await this.userDao.getUserById(email);
            console.log(emailUser)
            if(emailUser.length) {throw res.status(400).send({msg:"Email is register"});}
        }catch(err){
            
        }
        
    
        try {
        await this.userDao.createUser(user);
        let response = await this.userDao.createUserFirebase(user);
        await this.nodemailers.sendMailNewAccount(email,{email: user.email,password});
        logger.info(response);
        res.status(200).send({msg:"Usuario registrado"});
        }catch(err){
            res.status(200).send({msg:"Usuarios actualizados"});
        }
        logger.debug("Controller: Method createUser Ending");
    }

    makeid(length:number) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
      }
    
    async deleteUser( req: Request , res:Response ){
        logger.info(`Controller: Method deleteUser startting`);
        let userid: any= req.params.userId;
        let value = this.userDao.getUser(userid);

        if(value){
            await this.userDao.deleteUser(userid);
            res.status(200).send(`{}`);  
        }else{
            res.status(400).send(`{"msg": "Error in parameters"}`);
        }
        logger.debug(`Controller: Method deleteUser Ending`);
    }
}
