import {Request, Response} from 'express';
import IngenioDao from '../dao/ingenioDao';
import AddressDao from '../dao/addressDao';
import {Ingenio} from '../models/ingenio';
import {Address} from '../models/address';
import * as log4js from 'log4js';
const logger = log4js.getLogger();
logger.level = 'debug';

export default class IngenioController{
    public ingenioDao : IngenioDao;
    public addressDao: AddressDao
    constructor(){
        this.ingenioDao = new IngenioDao();
        this.addressDao = new AddressDao();
    } 

    async createeIngenio(req:Request, res:Response){
        logger.info('CONTROLLER: method createeIngenio Starting');
        if(!req.body.email) throw res.status(400).send("email is required")
        if(!req.body.address) throw res.status(400).send("address is required")
        if(!req.body.name) throw res.status(400).send("name is required")
        if(!req.body.address.street) throw res.status(400).send("Street is required")
        if(!req.body.address.number) throw res.status(400).send("number is required")
        if(!req.body.address.city) throw res.status(400).send("city is required")
        if(!req.body.address.location) throw res.status(400).send("location is required")
        if(!req.body.address.municipality) throw res.status(400).send("municipality is required")
        let { email, name } = req.body
        let { street, number, city, location, municipality } = req.body.address
        let address:Address = {
            street,
            number,
            city,
            location,
            municipality
        }
        let response:any = await this.ingenioDao.getIngenioByEmail(email);
        if(response.length) {throw res.status(400).send({msg:"Email is register"});}

        await this.addressDao.CreateAddress(address);
        let response1:any = await this.addressDao.getAddresByAttributes(address)
        let addressid:number = parseInt(response1[0].id);
        logger.info(addressid)
        let ingenio:Ingenio = {
            addressid,
            email,
            name
        }
        await this.ingenioDao.createIngenio(ingenio);
        res.status(200).send({})
        logger.debug('CONTROLLER: method createeIngenio Ending');
    }

    async deleteIngenioById(req:Request, res:Response){
        logger.info('CONTROLLER: method createeIngenio Starting');
        if(!req.params.ingenioId) throw res.status(400).send({msg: 'ingenioId is required'});
        let ingenioId:any = req.params.ingenioId;
        await this.ingenioDao.deleteIngeniosById(ingenioId);
        res.status(200).send({})
        logger.debug('CONTROLLER: method createeIngenio Ending');
    }

    
}