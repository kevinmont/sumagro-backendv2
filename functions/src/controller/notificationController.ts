import {Request, Response} from 'express';
import NoticationDao from '../dao/NotificationDao';
import config from '../models/config';
import * as log4js from 'log4js';
const logger = log4js.getLogger();
logger.level = 'debug';

export default class NotificationController{
    public noticationDao: NoticationDao;
    public config:any;

    constructor(){
        this.config= config;
        this.noticationDao = new NoticationDao(this.config);
    }

    async notificationPush(req: Request,res: Response){
        logger.info("Controller: Methos notificationPush Starting");
        let tokens = req.body.tokens;
        let notify = req.body.notify;
        if(!tokens) throw res.status(400).send('request is required');
        let response = await this.noticationDao.notification(tokens,notify);
        logger.info(response);
        logger.debug("Controller: Methos notificationPush Ending");
        res.send(response);
    }
}
