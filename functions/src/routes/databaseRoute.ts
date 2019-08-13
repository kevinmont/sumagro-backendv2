import * as express from 'express';
import DatabaseController from '../controller/databaseController';

export default class DatabaseRoute{
    public databaseController: DatabaseController;

    constructor(){
        this.databaseController= new DatabaseController();
    }

    addRoutes(app:express.Application){

        app.route('/sumagro-app/database/:ingenioId')
        .post((req:express.Request, res:express.Response)=>{
            this.databaseController.uploadDatabaseIngenio(req,res);
        })

    }
}