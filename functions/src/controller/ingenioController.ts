import { Request, Response } from 'express';
import IngenioDao from '../dao/ingenioDao';
import AddressDao from '../dao/addressDao';
import OrderDao from '../dao/orderDao';
import SubOrdersDao from '../dao/subOrdersDao';
import { Ingenio } from '../models/ingenio';
import { Address } from '../models/address';
import PdfHelper from '../utils/Pdf-Helper';
import { Nodemailers } from '../utils/Nodemailer-helper';
import Config from '../models/config';
import * as pdf from 'html-pdf';
import * as log4js from 'log4js';
import Mysql from '../utils/mysql';
import UserDao from '../dao/userDao';
const logger = log4js.getLogger();
logger.level = 'debug';

export default class IngenioController {
    public ingenioDao: IngenioDao;
    public addressDao: AddressDao;
    public orderDao: OrderDao;
    public subOrdersDao: SubOrdersDao;
    public pdfHelper: PdfHelper;
    public nodemailerHelper: Nodemailers;
    public userDao: UserDao; 
    public config:any;
    constructor(mysql: Mysql){
        this.config = Config;
        this.ingenioDao = new IngenioDao(mysql);
        this.addressDao = new AddressDao(mysql);
        this.orderDao = new OrderDao(mysql);
        this.subOrdersDao = new SubOrdersDao(mysql);
        this.userDao = new UserDao(mysql);
        this.pdfHelper = new PdfHelper();
        this.nodemailerHelper = new Nodemailers(this.config);
    }

    async createeIngenio(req: Request, res: Response) {
        logger.info('CONTROLLER: method createeIngenio Starting');
        if (!req.body.email) throw res.status(400).send("email is required")
        if (!req.body.address) throw res.status(400).send("address is required")
        if (!req.body.name) throw res.status(400).send("name is required")
        if (!req.body.address.street) throw res.status(400).send("Street is required")
        if (!req.body.address.number) throw res.status(400).send("number is required")
        if (!req.body.address.city) throw res.status(400).send("city is required")
        if (!req.body.address.location) throw res.status(400).send("location is required")
        if (!req.body.address.municipality) throw res.status(400).send("municipality is required")
        let { email, name } = req.body
        let { street, number, city, location, municipality } = req.body.address
        let address: Address = {
            street,
            number,
            city,
            location,
            municipality
        }
        let response: any = await this.ingenioDao.getIngenioByEmail(email);
        if (response.length) { throw res.status(400).send({ msg: "Email is register" }); }

        await this.addressDao.CreateAddress(address);
        let response1: any = await this.addressDao.getAddresByAttributes(address)
        let addressid: number = parseInt(response1[0].id);
        logger.info(addressid)
        let ingenio: Ingenio = {
            addressid,
            email,
            name
        }
        await this.ingenioDao.createIngenio(ingenio);
        res.status(200).send({})
        logger.debug('CONTROLLER: method createeIngenio Ending');
    }

    async deleteIngenioById(req: Request, res: Response) {
        logger.info('CONTROLLER: method createeIngenio Starting');
        if (!req.params.ingenioId) throw res.status(400).send({ msg: 'ingenioId is required' });
        let ingenioId: any = req.params.ingenioId;
        let ingenio:any = await this.ingenioDao.getIngenioById(ingenioId);
        if (!ingenio.length) throw res.status(404).send({ msg: 'ingenio not fund' });
        let users: any = await this.userDao.getUserByIngenioId(ingenioId);
        for(let i = 0; i< users.length; i++){
            await this.userDao.deleteUser(users[i].id);
        }
        await this.addressDao.deleteAddresById(ingenio[0].addressid);
        await this.ingenioDao.deleteIngeniosById(ingenioId);
        res.status(200).send({})
        logger.debug('CONTROLLER: method createeIngenio Ending');
    }

    async sendEmail(req: any, res: Response) {
        logger.info('CONTROLLER: method sendEmail Starting');
        if (!req.params.orderId) throw res.status(400).send("orderId is required");
        if (!req.body.ingenioId) throw res.status(400).send("ingenioId is required");
        let orderId = req.params.orderId;
        let ingenioId = req.body.ingenioId;
        let dataOrder: any = await this.orderDao.orderById(orderId);
        if (!dataOrder[0]) throw res.status(400).send('{ "msg":"orderId not found"}');
        let response = parseInt(dataOrder[0].addressid)
        logger.info(response)
        let address: any = await this.addressDao.getAddressById(response);
        let subOrder: any = await this.subOrdersDao.getsubOrdersById(orderId);
        let order: any = {};
        let sub: any = [];

        subOrder.forEach((i: any) => {
            sub.push({
                id: `${i.id}`,
                captured: `${i.captured}`,
                description: `${i.description}`,
                quantity: `${i.quantity}`,
                received: `${i.received}`,
                status: `${i.status}`
            })
        });

        order = {
            id: `${dataOrder[0].id}`,
            client: `${dataOrder[0].client}`,
            shippingdate: `${dataOrder[0].shippingdate}`,
            dateentrance: `${dataOrder[0].dateentrance}`,
            clientAddress: `${address[0].localidad}`,
            operationUnit: `${dataOrder[0].operationunit}`,
            operator: `${dataOrder[0].operator}`,
            plates: `${dataOrder[0].plates}`,
            remissionNumber: `${dataOrder[0].remissionnumber}`,
            shippingDate: `${dataOrder[0].shippingdate}`,
            status: `${dataOrder[0].status}`,
            subOrders: sub
        }
        if (order.status != "PENDING") {
            let ingenio: any = await this.ingenioDao.getIngenioById(ingenioId);
            let email = ingenio[0].email;
            logger.info(order)
            let report = await this.pdfHelper.getRemissionDocument(order);
            pdf.create(report, {
                format: 'Letter', border: {
                    top: "1in",            // default is 0, units: mm, cm, in, px
                    right: "0in",
                    bottom: "2in",
                    left: "2cm"
                }
            }).toStream(async (err, stream) => {
                logger.info("Email:", email);
                await this.nodemailerHelper.sendMail({ content: stream, filename: `${orderId}.pdf` }, email);
                res.send({ msg: 'OK' });
            })
        } else {
            res.send({ msg: "La carga aun no se ha completado" });
        }
        logger.debug('CONTROLLER: method sendEmail Ending');
    }

    async getIngenios(req: Request, res: Response) {
        logger.info('CONTROLLER: Method getIngenios Stratting');
        let peer_page: number = req.query.peer_page;
        let page: number = req.query.page;
        let discard:number;
        let ingenios:any;
        if(peer_page!= undefined && page != undefined){

            if (!peer_page) throw res.status(400).send(`peer_page is required`);
            if (!page) throw res.status(400).send(`page is required`);
            if(page == 0 || page <0 ){
                page=1;
            }
            logger.info(`discard: ${(page-1) * peer_page}`);
            discard = (page-1) * peer_page;
    
            ingenios = await this.ingenioDao.getAllIngenios(`LIMIT ${peer_page} OFFSET ${discard}`);
        }else{
            ingenios = await this.ingenioDao.getAllIngenios();

        }
        let structureIngenios: any = [];

        for (let ingenio of ingenios) {
            logger.info(`structureIngenios: ${structureIngenios.length}`);
            let addressid: any = ingenio.addressid;
            let dataAddress: any = await this.addressDao.getAddressById(addressid);
            let structureaddress: any = {};
            structureaddress = {
                calle: `${dataAddress[0].calle}`,
                numero: `${dataAddress[0].numero}`,
                ciudad: `${dataAddress[0].ciudad}`,
                localidad: `${dataAddress[0].localidad}`,
                municipio: `${dataAddress[0].municipio}`
            }
            structureIngenios.push({
                id: `${ingenio.id}`,
                email: `${ingenio.email}`,
                name: `${ingenio.name}`,
                address: structureaddress
            })
        }
        logger.debug('CONTROLLER: Method getIngenios Ending');
        res.status(200).send(structureIngenios);
    }

}