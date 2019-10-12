import Mysql from "../utils/mysql";

export default abstract class AbstractDao {
    constructor(protected db: Mysql) { }
};