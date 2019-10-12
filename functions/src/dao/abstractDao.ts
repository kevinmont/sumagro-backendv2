import Mysql from "../utils/mysql";

export abstract class AbstractDao {
    constructor(protected db: Mysql) { }
};