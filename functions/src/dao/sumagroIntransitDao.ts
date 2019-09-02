import Mysql from '../utils/mysql';
import * as log4js from 'log4js';

const logger = log4js.getLogger();
logger.level='debug';

export default class SumagroIntransitDao{

    public mysql:Mysql;

    constructor(mysql:Mysql){
        this.mysql= mysql;
    }

    
}