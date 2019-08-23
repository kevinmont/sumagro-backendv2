import {Request, Response} from 'express';
import IngenioDao from '../dao/ingenioDao';
import AddressDao from '../dao/addressDao';
import OrderDao from '../dao/orderDao';
import SubOrdersDao from '../dao/subOrdersDao';
import {Ingenio, types, arrtypes} from '../models/ingenio';
import {Address} from '../models/address';
import CoordenatesDao from '../dao/coordenatesDao';
import PdfHelper from '../utils/Pdf-Helper';
import {Nodemailers} from '../utils/Nodemailer-helper';
import Config from '../models/config';
import * as pdf from 'html-pdf';
import * as log4js from 'log4js';
import Mysql from '../utils/mysql';
const logger = log4js.getLogger();
logger.level = 'debug';

export default class IngenioController {
    public coordenatesDao : CoordenatesDao;
    public ingenioDao : IngenioDao;
    public addressDao : AddressDao;
    public orderDao : OrderDao;
    public subOrdersDao : SubOrdersDao;
    public pdfHelper : PdfHelper;
    public nodemailers : Nodemailers;
    public config : any;
    constructor(mysql : Mysql) {
        this.config = Config;
        this.ingenioDao = new IngenioDao(mysql);
        this.addressDao = new AddressDao(mysql);
        this.coordenatesDao = new CoordenatesDao(mysql);
        this.orderDao = new OrderDao(mysql);
        this.subOrdersDao = new SubOrdersDao(mysql);
        this.pdfHelper = new PdfHelper();
        this.nodemailers = new Nodemailers(this.config);
    }

    async createeIngenio(req : Request, res : Response) {
        logger.info('CONTROLLER: method createeIngenio Starting');
        if (!req.body.email) 
            throw res.status(400).send("email is required")


        


        if (!req.body.address) 
            throw res.status(400).send("address is required")


        


        if (!req.body.name) 
            throw res.status(400).send("name is required")


        


        if (!req.body.address.street) 
            throw res.status(400).send("Street is required")


        


        if (!req.body.address.number) 
            throw res.status(400).send("number is required")


        


        if (!req.body.address.city) 
            throw res.status(400).send("city is required")


        


        if (!req.body.address.location) 
            throw res.status(400).send("location is required")


        


        if (!req.body.address.municipality) 
            throw res.status(400).send("municipality is required")


        


        let {email, name} = req.body
        let {street, number, city, location, municipality} = req.body.address
        let address: Address = {
            street,
            number,
            city,
            location,
            municipality
        }
        let response: any = await this.ingenioDao.getIngenioByEmail(email);
        if (response.length) {
            throw res.status(400).send({msg: "Email is register"});
        }
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

    async sendEmail(req : any, res : Response) {
        logger.info('CONTROLLER: method sendEmail Starting');
        if (!req.params.orderId) 
            throw res.status(400).send("orderId is required");
        


        let orderId = req.params.orderId;
        let dataOrder: any = await this.orderDao.orderById(orderId);
        if (! dataOrder.length) 
            throw res.status(404).send('{ "msg":"order not found"}');
        


        let response = parseInt(dataOrder[0].addressid)
        logger.info(response)
        let address: any = await this.addressDao.getAddressById(response);
        let subOrder: any = await this.subOrdersDao.getsubOrdersById(orderId);
        let order: any = {};
        let sub: any = [];

        subOrder.forEach((i : any) => {
            sub.push({
                id: `${
                    i.id
                }`,
                captured: `${
                    i.captured
                }`,
                description: `${
                    i.description
                }`,
                quantity: `${
                    i.quantity
                }`,
                received: `${
                    i.received
                }`,
                status: `${
                    i.status
                }`
            })
        });

        order = {
            id: `${
                dataOrder[0].id
            }`,
            client: `${
                dataOrder[0].client
            }`,
            shippingdate: `${
                dataOrder[0].shippingdate
            }`,
            dateentrance: `${
                dataOrder[0].dateentrance
            }`,
            clientAddress: `${
                address[0].localidad
            }`,
            operationUnit: `${
                dataOrder[0].operationunit
            }`,
            modelUnit: `${
                dataOrder[0].modelunit
            }`,
            operator: `${
                dataOrder[0].operator
            }`,
            plates: `${
                dataOrder[0].plates
            }`,
            remissionNumber: `${
                dataOrder[0].remissionnumber
            }`,
            shippingDate: `${
                dataOrder[0].shippingdate
            }`,
            status: `${
                dataOrder[0].status
            }`,
            subOrders: sub
        }
        if (order.status != "PENDING") {
            let ingenioid: number = parseInt(dataOrder[0].ingenioid);
            let ingenio: any = await this.ingenioDao.getIngenioById(ingenioid)
            let email = ingenio[0].email;
            logger.info(order)
            logger.info(email)
            let report = await this.pdfHelper.getRemissionDocument(order);
            logger.info(report);
            pdf.create(report, {
                format: 'Letter',
                border: {
                    top: "1in", // default is 0, units: mm, cm, in, px
                    right: "0in",
                    bottom: "2in",
                    left: "2cm"
                }
            }).toStream(async (err, stream) => {
                logger.info("Email:", email);
                await this.nodemailers.sendMail({
                    content: stream,
                    filename: `${orderId}.pdf`
                }, email);
                res.send({msg: 'OK'});
            })
        } else {
            res.send({msg: "La carga aun no se ha completado"});
        }
        logger.debug('CONTROLLER: method sendEmail Ending');
    }

    async getIngenios(req : Request, res : Response) {
        logger.info('CONTROLLER: Method getIngenios Stratting');
        let peer_page: number = req.query.peer_page;
        let page: number = req.query.page;
        let discard: number;
        let ingenios: any;
        if (peer_page != undefined && page != undefined) {

            if (! peer_page) 
                throw res.status(400).send(`peer_page is required`);
            


            if (! page) 
                throw res.status(400).send(`page is required`);
            


            if (page == 0 || page < 0) {
                page = 1;
            }
            logger.info(`discard: ${
                (page - 1) * peer_page
            }`);
            discard = (page - 1) * peer_page;

            ingenios = await this.ingenioDao.getAllIngenios(`LIMIT ${peer_page} OFFSET ${discard}`);
        } else {
            ingenios = await this.ingenioDao.getAllIngenios();

        }
        let structureIngenios: any = [];

        for (let ingenio of ingenios) {
            logger.info(`structureIngenios: ${
                structureIngenios.length
            }`);
            let addressid: any = ingenio.addressid;
            let dataAddress: any = await this.addressDao.getAddressById(addressid);
            let structureaddress: any = {};
            structureaddress = {
                calle: `${
                    dataAddress[0].calle
                }`,
                numero: `${
                    dataAddress[0].numero
                }`,
                ciudad: `${
                    dataAddress[0].ciudad
                }`,
                localidad: `${
                    dataAddress[0].localidad
                }`,
                municipio: `${
                    dataAddress[0].municipio
                }`
            }
            structureIngenios.push({id: `${
                    ingenio.id
                }`, email: `${
                    ingenio.email
                }`, name: `${
                    ingenio.name
                }`, address: structureaddress})
        }
        logger.debug('CONTROLLER: Method getIngenios Ending');
        res.status(200).send(structureIngenios);
    }

    async getIngenioDetails(req : Request, res : Response) {
        return;
    }

    async getFormulaByingenio(req : Request, res : Response) {
        logger.info('CONTROLLER: Method getFormulaByingenio Startting');
        if (!req.params.type) 
            throw res.status(400).send('Type is required');
        
        if (!arrtypes.includes(req.params.type)) 
            throw res.status(400).send('Type not exists');
        
        if (!req.params.ingenioId) 
            throw res.status(400).send('ingenioId is required');
        
        let type: any = req.params.type;
        let ingenioId: any = req.params.ingenioId
        logger.info(`tabla: ${type}`);
        logger.info(`ingenio: ${ingenioId}`);
        let data: any;
        let discard: any;
        let response: any = [];
        logger.info(`datps 2: ${typeof req.query.peer_page}`);
        logger.info(`datps: ${!(Number.isInteger(+req.query.peer_page))}`);
        logger.info(`datos: ${req.query.peer_page}`);
        if (!(Number.isInteger(+req.query.peer_page)))
            throw res.status(400).send('peer_page not is number');
        
        if (!(Number.isInteger(+req.query.page))) 
            throw res.status(400).send('page not is number');
        

        if (req.query.peer_page && req.query.page) {
            let peer_page: any = req.query.peer_page;
            let page: any = req.query.page;

            if (page == 0 || page < 0) {
                page = 1;
            }
            discard = (page - 1) * peer_page;
            data = await this.ingenioDao.getCountFormule(type, ingenioId, `LIMIT ${peer_page} OFFSET ${discard}`);
        } else {
            data = await this.ingenioDao.getCountFormule(type, ingenioId);
        }

        for (let element of data) {
            response.push({name: `${
                    element.description
                }`, quantity: `${
                    element.count
                }`})
        }
        logger.debug('CONTROLLER: Method getFormulaByingenio Ending');
        res.status(200).send(response);
    }

    async getDataentranceByIngenio(req : Request, res : Response) {
        logger.info('CONTROLLER: Method getDataentranceByIngenio Stratting');
        if (!req.params.type) 
            throw res.status(400).send('Type is required');
        

        if (!req.params.ingenioId) 
            throw res.status(400).send('ingenioId is required');
        

        let type: any = req.params.type;
        logger.info(`tabla: ${type}`);
        let ingenioId: any = req.params.ingenioId;
        logger.info(`ingenio: ${ingenioId}`);
        let data: any;
        let discard: any;
        let response: any = [];
        let coordenate: any = {};
        if (!(arrtypes.includes(type))) 
            throw res.status(400).send('Type not exists');
        
        if (req.query.peer_page && req.query.page) {
            let page: any = req.query.page;
            let peer_page: any = req.query.peer_page;

            if (page == 0 || page < 0) {
                page = 1;
            }
            discard = (page - 1) * peer_page;
            data = await this.ingenioDao.getDatatable(type, ingenioId, `LIMIT ${peer_page} OFFSET ${discard}`);
        } else {
            data = await this.ingenioDao.getDatatable(type, ingenioId);
        }

        if (type == types.aplicated) {
            for (let element of data) {
                let coordenates: any = await this.coordenatesDao.getCoordenatesById(element.coordenatesid);
                Object.assign(coordenate, {
                    latitud: coordenates[0].latitud,
                    longitud: coordenates[0].longitud
                })
                response.push({
                    id: `${
                        element.id
                    }`,
                    description: `${
                        element.description
                    }`,
                    inplot: `${
                        element.inplot
                    }`,
                    used: `${
                        element.used
                    }`,
                    dateaplicated: `${
                        element.dateaplicated
                    }`,
                    ingenioid: `${
                        element.ingenioid
                    }`,
                    operator: `${
                        element.operator
                    }`,
                    coordenates: coordenate
                })
            }
        } else if (type == types.entrance) {
            for (let element of data) {
                response.push({
                    id: `${
                        element.id
                    }`,
                    date: `${
                        element.date
                    }`,
                    description: `${
                        element.description
                    }`,
                    ingenioId: `${
                        element.ingenioid
                    }`,
                    operatorId: `${
                        element.operatorid
                    }`,
                    orderId: `${
                        element.orderid
                    }`
                })
            }
        } else if (type == types.intransit) {
            for (let element of data) {
                response.push({
                    id: `${
                        element.id
                    }`,
                    description: `${
                        element.description
                    }`,
                    ingenioId: `${
                        element.ingenioid
                    }`,
                    operator: `${
                        element.operator
                    }`,
                    operationunit: `${
                        element.operationunit
                    }`,
                    plates: `${
                        element.plates
                    }`,
                    orderId: `${
                        element.orderid
                    }`
                })
            }
        } else if (type == types.inventory) {
            for (let element of data) {
                response.push({id: `${
                        element.id
                    }`, ingenioId: `${
                        element.ingenioid
                    }`, description: `${
                        element.description
                    }`, operator: `${
                        element.operator
                    }`, date: `${
                        element.date
                    }`})
            }
        } else if (type == types.outputs) {
            for (let element of data) {
                response.push({
                    id: `${
                        element.id
                    }`,
                    description: `${
                        element.description
                    }`,
                    operator: `${
                        element.operator
                    }`,
                    userId: `${
                        element.userid
                    }`,
                    ingenioId: `${
                        element.ingenioid
                    }`,
                    qrdataid: `${
                        element.qrdataid
                    }`
                })
            }
        }
        logger.debug('CONTROLLER: Method getDataentranceByIngenio Ending');
        res.status(200).send(response);
    }
    
}
