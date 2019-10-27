import * as log4js from 'log4js';
import Mysql from '../../utils/mysql';
import { AbstractDao } from '../abstractDao';
import { InventoryDao } from '../inventoryDao';

const logger = log4js.getLogger('sumagro.dao.impl.InventoryDaoImpl');

export class InventoryDaoImpl extends AbstractDao implements InventoryDao {

    constructor(db: Mysql) {
        super(db);
    }

    async getdatainventoryByDate(dateStart:string, dateEnd: string, ingenioId:any){
        logger.info('DAO: Method getdatainventory Startting');
        let sql=`select distinct(description), count(description) as quantity
        from inventory where ingenioid=${ingenioId} and date >= '${dateStart}T00:00:00.000Z'
        and date <= '${dateEnd}T00:00:00.000Z'
        group by description`;
        logger.info(`sql inventory: ${sql}`);
        logger.debug('Dao: Method getdatainventory Ending');
        return await this.db.query(sql);
    }
}