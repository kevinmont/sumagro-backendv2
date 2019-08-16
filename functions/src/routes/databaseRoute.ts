import * as express from 'express';
import DatabaseController from '../controller/databaseController';
import Mysql from '../utils/mysql';

export default class DatabaseRoute{
    public databaseController: DatabaseController;

    constructor(mysql: Mysql){
        this.databaseController= new DatabaseController(mysql);
    }

    addRoutes(app:express.Application){

        app.route('/sumagro-app/database/:ingenioId')
        .post((req:express.Request, res:express.Response)=>{
            this.databaseController.uploadDatabaseIngenio(req,res);
        })

    }
}