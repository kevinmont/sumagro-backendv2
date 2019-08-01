import {Request,Response} from 'express';
import PinDao from '../dao/pinDao';
import * as log4js from 'log4js';
const logger = log4js.getLogger();
logger.level = 'debug';

export default class PinController{
    public pinDao : PinDao;
    constructor(){
        this.pinDao = new PinDao();
    }
    async getPin(req: Request,res: Response){
        logger.info('CONTROLLER: method getPint Starting');
        let response = await this.pinDao.getPin();
        logger.debug('CONTROLLER: method getPint Ending');
        res.status(200).send(response);
    }    

    
}