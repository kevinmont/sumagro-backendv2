import * as log4js from 'log4js';
import AbstractDao from '../abstractDao';
import Mysql from '../../utils/mysql';
import { PingDao } from '../pingDao';

const logger = log4js.getLogger("PingDaoImpl");
logger.level = 'debug';

export default class PingDaoImpl extends AbstractDao implements PingDao {
    constructor(protected db: Mysql) {
        super(db)
    }

    async getPing(): Promise<any> {
        logger.info('getPing(): starting');
        let sql = `SELECT * from ingenios`;
        logger.debug('getPing(): ending');
        return await this.db.query(sql);
    }


}