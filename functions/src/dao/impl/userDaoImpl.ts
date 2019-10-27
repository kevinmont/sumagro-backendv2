import * as log4js from 'log4js';
import Mysql from "../../utils/mysql";
import { AbstractDao } from "../abstractDao";
import { UserDao } from "../userDao";

const logger = log4js.getLogger('sumagro.dao.impl.UserDaoImpl');

export class UserDaoImpl extends AbstractDao implements UserDao {

    constructor(db: Mysql) {
        super(db);
    }

    async createUser(user: any, uid: any) {
        logger.info('DAO: Method createUser Starting');
        let sql = `INSERT INTO users VALUES("${uid}","${user.email}","${user.ingenioId}","${user.rol}",${null})`;
        logger.debug('DAO: Method createUser Ending');
        return await this.db.query(sql);
    }

    async getUserById(email: string) {
        logger.info('DAO: Method getUserById Starting');
        let sql = `SELECT * FROM users where email = "${email}"`;
        logger.debug('DAO: Method getUserById Ending');
        try {
            return await this.db.query(sql);
        } catch (err) {
            logger.error("ERROR", err);
            return;
        }
    }

    async UserById(id: string) {
        logger.info('DAO: Method UserById Starting');
        let sql = `SELECT * FROM users where id = "${id}"`;
        logger.debug('DAO: Method UserById Ending');
        return await this.db.query(sql);
    }


    async getUser(userId: any) {
        logger.info(`Dao: Method getUser startting`);
        let sql = `SELECT * FROM users WHERE id='${userId}'`;
        return await this.db.query(sql);

    }

    async getUserByEmail(email: string) {
        logger.info(`Dao: Method getUserByEmail startting`);
        let sql: string = `SELECT * FROM users where email = "${email}"`;
        logger.debug('DAO: Method getUserByEmail Ending');
        return await this.db.query(sql);
    }


    async deleteUser(userId: any) {
        logger.info(`Dao: Method deleteUser Startting`);
        let sql = `DELETE FROM users WHERE id='${userId}'`;
        logger.debug(`Dao: Method deleteUsers Ending`);
        return await this.db.query(sql);
    }

    async saveToken(userId: any, token: any) {
        logger.info(`Dao: Method saveToken Startting`);
        let sql = `UPDATE users SET token = "${token}" where id = "${userId}"`;
        logger.debug(`Dao: Method saveToken Ending`);
        return await this.db.query(sql);
    }

    async deleteToken(userId: any) {
        logger.info(`Dao: Method saveToken Startting`);
        let sql = `UPDATE users SET token = "${null}" where id = "${userId}"`;
        logger.debug(`Dao: Method saveToken Ending`);
        return await this.db.query(sql);
    }

    async getUsers(discard: number, total_page: number, complements: any = '') {
        logger.info('DAO: Method getUsers Startting');
        let sql = `SELECT * FROM users ${complements} LIMIT ${total_page} OFFSET ${discard}`;
        logger.info(`sql: ${sql}`);
        logger.debug('DAO: Method getUsers Ending');
        return await this.db.query(sql);
    }

    async getUserByIngenioId(ingenioId: string) {
        logger.info(`Dao: Method getUserByEmail startting`);
        let sql: string = `SELECT * FROM users where ingenioid = "${ingenioId}"`;
        logger.debug('DAO: Method getUserByEmail Ending');
        return await this.db.query(sql);
    }

    async getUserByRol() {
        logger.info(`Dao: Method getUserByEmail startting`);
        let sql: string = `SELECT * FROM users where rol = "WAREHOUSE"`;
        logger.debug('DAO: Method getUserByEmail Ending');
        return await this.db.query(sql);
    }

    async getByRol(rol: string) {
        logger.info(`Dao: Method getUserByEmail startting`);
        let sql: string = `SELECT * FROM users where rol = "${rol}"`;
        logger.debug('DAO: Method getUserByEmail Ending');
        return await this.db.query(sql);
    }

    async getByRolandIngenioId(rol: string, ingenioId: number) {
        logger.info(`Dao: Method getByRolandIngenioId startting`);
        let sql: string = `SELECT * FROM users where rol = "${rol}" and ingenioid=${ingenioId}`;
        logger.debug('DAO: Method getByRolandIngenioId Ending');
        return await this.db.query(sql);
    }

}