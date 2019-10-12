import { PingDao } from '../dao/pingDao';
import * as log4js from 'log4js';

const logger = log4js.getLogger("PingController")
logger.level = 'debug';

export default class PingController {
    // - Dependencies
    private pingDao: PingDao;

    constructor(pingDao: PingDao) {
        this.pingDao = pingDao;
    }

    // Override Methods
    async getPing(): Promise<any> {
        logger.info('getPing():- starting');
        // it should return and UUID from the database
        let response = await this.pingDao.getPing();
        logger.info('getPing():- ending');
        return response;
    }
}