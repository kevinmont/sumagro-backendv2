import * as log4js from 'log4js';
import {Request, Response} from 'express';
import UserDao from '../dao/userDao';

const logger = log4js.getLogger();
logger.level= 'debug';

export default class UserController{

    public userDao: UserDao;

    constructor(){
        this.userDao= new UserDao();
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
