import {Request, Response} from 'express';
import IngenioDao from '../dao/ingenioDao';
import * as log4js from 'log4js';
const logger = log4js.getLogger();
logger.level = 'debug';

export default class IngenioController{
    public ingenioDao : IngenioDao;
    constructor(){
        this.ingenioDao = new IngenioDao();
    } 

    async deleteIngenioById(req:Request, res:Response){
        logger.info('CONTROLLER: method deleteIngenioById Starting');
        if(!req.params.ingenioId) throw res.status(400).send({msg: 'ingenioId is required'});
        let ingenioId:any = req.params.ingenioId;
        await this.ingenioDao.deleteIngeniosById(ingenioId);
        res.status(200).send({})
        logger.debug('CONTROLLER: method deleteIngenioById Ending');
    }

    
}