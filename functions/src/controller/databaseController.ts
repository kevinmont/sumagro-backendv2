import {Request, Response} from 'express';
import AddressDao from '../dao/addressDao';
import CoordenatesDao from '../dao/coordenatesDao';
import * as log4js from 'log4js';

import DatabaseDao from '../dao/databaseDao';

const logger= log4js.getLogger();
logger.level ='debug';
export default class DatabaseController{
    public databaseDao: DatabaseDao;
    public addressDao: AddressDao; 
    public coordenatesDao:CoordenatesDao;
    constructor (){
        this.coordenatesDao= new CoordenatesDao();
        this.addressDao= new AddressDao();
        this.databaseDao = new DatabaseDao();
    }

    async uploadDatabaseIngenio (req:Request, res:Response){
        logger.info('CONTROLLER: Method uploadDatabaseIngenio Startting');
        let ingenioId= req.params.ingenioId;
        let records= req.body.records;

        if(!ingenioId) throw res.status(400).send('{"msg":"ingenioId is required"}');
        if(!records) throw res.status(400).send('{"msg":"records is required"}');
        let error:any=[];
        for(let record of records){
            let address= record[5];
            let addressId:any= await this.addressDao.createAddressByLocalidad(address);
            let coordenatesId:any= await this.coordenatesDao.registeringCoordenates(record[22],record[23]);
            logger.info("coordenatesId: " + typeof coordenatesId);
            logger.info("coordenatesId 2: " + coordenatesId);
            let err:any= await this.databaseDao.saveDatabase(record, addressId,coordenatesId,ingenioId)
            if(typeof err == "string"){
                error.push(err); 
            }
        }

        logger.debug('CONTROLLER: Method uploadDatabaseIngenio Ending');
        (!error.length)? res.status(200).send(`{}`):res.status(409).send(error);   
    }

}