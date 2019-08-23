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
        .get((req: express.Request, res: express.Response)=>{
            this.databaseController.getDatabase(req,res);
        })

        app.route('/sumagro-app/generateExcel/:ingenioId')
            .get((req: express.Request, res: express.Response)=>{
                this.databaseController.getExcel(req,res);
            });

        
    }
}