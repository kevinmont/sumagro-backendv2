import {Request, Response} from 'express';
import UserDao from '../dao/userDao';
import IngenioDao from '../dao/ingenioDao';
import AddressDao from '../dao/addressDao';
import { User } from '../models/user';
import { Nodemailers } from '../utils/Nodemailer-helper';
import Firebase from '../utils/firebase';
import config from '../models/config';
import * as log4js from 'log4js';
import Mysql from '../utils/mysql';

import {roles} from '../models/rol';
import OrderDao from '../dao/orderDao';
const logger = log4js.getLogger();
logger.level = 'debug';

export default class UserController {
    public userDao: UserDao;
    public ingenioDao: IngenioDao;
    public addressDao: AddressDao;
    public orderDao: OrderDao;
    public nodemailers: Nodemailers;
    public firebase: Firebase;
    public config: any;

    constructor(mysql: Mysql,firebase: Firebase){
        this.config= config;
        this.ingenioDao = new IngenioDao(mysql);
        this.addressDao = new AddressDao(mysql);
        this.userDao = new UserDao(mysql);
        this.orderDao = new OrderDao(mysql);
        this.firebase = firebase;
        this.nodemailers = new Nodemailers(this.config);
    }

    async createUser(req : Request, res : Response) {
        logger.info("Controller: Methos createUser Starting");
        let {email, uid, rol, ingenioId} = req.body;
        let password = await this.makeid(8);
        let user: User = {
            email,
            password,
            uid,
            rol,
            ingenioId
        }

        if (user.ingenioId == undefined && (user.rol == "CAPTURIST" || user.rol == "WAREHOUSE")) {
            delete user.ingenioId;
        }


        let emailUser: any = await this.userDao.getUserById(email);
        console.log(emailUser)
        if (emailUser.length) throw res.status(400).send({ msg: "Email is register" }); 

        try {
            let uid: any = await this.firebase.createUserFirebase(user);
            if (user.rol == "WAREHOUSE" || user.rol == "CAPTURIST") {
                user.ingenioId = 0;
            }
            logger.info(uid);
            await this.userDao.createUser(user,uid);
            await this.nodemailers.sendMailNewAccount(email, { email: user.email, password });
            res.status(200).send({ msg: "Usuario registrado" });
        } catch (err) {
            logger.error(err);
            res.status(200).send({ msg: "Usuarios actualizados" });
        }
        logger.debug("Controller: Method createUser Ending");
    }

    makeid(length : number) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    async deleteUser(req : Request, res : Response) {
        logger.info(`Controller: Method deleteUser startting`);

        if (req.headers.email == "sumagro.distribucion@gmail.com") {
            if (!req.params.userId) 
                throw res.status(400).send(`{"msg": "userId is required"}`);
            
            let userid: any = req.params.userId;
            await this.userDao.deleteUser(userid);
            await this.firebase.deleteUserFirebase(userid)
            res.status(200).send(`{}`);
        } else {
            res.status(401).send({msg: "USUARIO NO AUTORIZADO"});
        }

        logger.debug(`Controller: Method deleteUser Ending`);
    }

    async notificationPush(req : Request, res : Response) {
        logger.info("Controller: Methos notificationPush Starting");
        let tokens = req.body.tokens;
        let notify = req.body.notify;
        if (! tokens) 
            throw res.status(400).send('request is required');
        
        let response = await this.firebase.notification(tokens, notify);
        logger.info(response);
        logger.debug("Controller: Methos notificationPush Ending");
        res.send(response);
    }

    async saveToken(req : any, res : Response) {
        logger.info("Controller: Methos saveToken Starting");
        let token = req.body.token;
        let uid = req.headers.uid;
        logger.info("TOKEN A REGISTRAR...", token)
        await this.userDao.saveToken(uid, token)
        logger.debug("Controller: Methos saveToken Ending");
        res.send();
    }

    async deleteToken(req : any, res : Response) {
        logger.info("Controller: Methos deleteToken Starting");
        let uid = req.headers.uid;
        let userFirebase: any = await this.firebase.getUserFirebase(uid);
        let userRds: any = await this.userDao.getUserByEmail(userFirebase.email);
        await this.userDao.deleteToken(userRds[0].id)
        let response = await this.firebase.deleteToken(uid);
        logger.debug("Controller: Methos deleteToken Ending");
        res.send(response);
    }

    async getUsers(req : Request, res : Response) {
        logger.info('CONTROLER: Method getUsers Startting');
        let peer_page: number = req.query.peer_page;
        let page: number = req.query.page;
        let ingenioId: number = req.query.ingenioId;
        let rol: string = req.query.rol;
        if (rol) 
            if (!roles.includes(rol)) 
                throw res.status(400).send(`ROL is invalid`);
            
        if (! peer_page) 
            throw res.status(400).send(`peer_page is required`);
        
        if (! page) 
            throw res.status(400).send(`page is required`)
        
        if(page==0 && page <0){
            page=1;
        }
        let discard: number = (page-1) * peer_page;
        let users: any;
        let structureUsers: any = [];

        if (! ingenioId) {
            if (! rol) {
                users = await this.userDao.getUsers(discard, peer_page);
            } else {
                let complements: string = `WHERE rol='${rol}'`;
                users = await this.userDao.getUsers(discard, peer_page, complements);
            }
        } else {
            if (! rol) {
                let complements: string = `WHERE ingenioid=${ingenioId}`;
                users = await this.userDao.getUsers(discard, peer_page, complements);
            } else {
                let complements: string = `WHERE ingenioid=${ingenioId} AND rol='${rol}'`;
                users = await this.userDao.getUsers(discard, peer_page, complements);
            }
        }
        for (let user of users) {
            structureUsers.push({uid: `${
                    user.id
                }`, rol: `${
                    user.rol
                }`, email: `${
                    user.email
                }`, ingenioId: `${
                    user.ingenioid
                }`});
        }
        logger.debug('CONTROLER: Method getUsers Ending');
        res.status(200).send(structureUsers);
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
            await this.firebase.deleteUserFirebase(users[i].id);
        }
        await this.addressDao.deleteAddresById(ingenio[0].addressid);
        await this.ingenioDao.deleteIngeniosById(ingenioId);
        res.status(200).send({})
        logger.debug('CONTROLLER: method createeIngenio Ending');
    }

    async getUserInfo(req: Request,res: Response){
        logger.info('CONTROLLER: method getUserInfo Starting');
        let uid:any = req.headers.uid;
        let response:any = await this.userDao.getUser(uid);
        logger.info("response user Obtained",response);
        logger.debug('CONTROLLER: method getUserInfo Ending');
        if(response.length){
        res.send(response[0]);
        }else{
            res.send([]);
        }
    }


    async updateOrderStatus(req:Request,res: Response){
        logger.info('CONTROLLER: method updateOrderStatus Starting');
        if (!req.params.ingenioId) throw res.status(400).send({ msg: 'ingenioId is required' });
        if (!req.params.orderId) throw res.status(400).send({ msg: 'orderId is required' });
        let orderId = req.params.orderId;
        let ingenioId = req.params.ingenioId;
        let updateRequest = req.body;
        logger.info("El status: " + updateRequest.status);
        if(updateRequest.status=="CAPTURED"){
            let userAdminAlmacen:any = await this.userDao.getByRol('WAREHOUSE');
            for(let userAlmacen of userAdminAlmacen){
                this.firebase.notification(userAlmacen.token,{title:'Orden capturada',body:'Se ha capturado una orden'});
            }
            await this.orderDao.updateOrderByOrderIdAndIngenioId(orderId,ingenioId,updateRequest);
            res.status(200).send();
        }else if(updateRequest.status=="TRANSIT" || updateRequest.status=="DELIVERED"){
            let order:any = await this.orderDao.orderById(orderId)
            let userAdminAlmacen:any = await this.userDao.getByRolandIngenioId('INGENIO_ADMIN',order.ingenioid);
            let notification={};
                if(updateRequest.status=="TRANSIT"){
                notification = {
                    title:'Orden en camino',
                    body:`Orden ${order.remissionnumber} está en camino`
                }
            }else{
                notification = {
                    title:'Orden entregada',
                    body:`Orden ${order.remissionnumber} ha sido entregada`
                }
                }
            for(let userAlmacen of userAdminAlmacen){
                this.firebase.notification(userAlmacen.token,notification);
            }
            await this.orderDao.updateOrderByOrderIdAndIngenioId(orderId,ingenioId,updateRequest);
            res.status(200).send();
        }else{
        let ingenio:any = await this.ingenioDao.getIngenioById(ingenioId);
        if (!ingenio.length) throw res.status(404).send({ msg: 'ingenio not fund' });
        let order:any = await this.orderDao.orderById(orderId)
        if (!order.length) throw res.status(404).send({ msg: 'order not fund' });
        await this.orderDao.updateOrderByOrderIdAndIngenioId(orderId,ingenioId,updateRequest);
        logger.debug('CONTROLLER: method updateOrderStatus Ending');
        res.status(200).send({msg:"Updated"});
    }
    }

    async deleteOrder(req: Request,res: Response){
        logger.info('CONTROLLER: method deleteOrder Starting');
        if (!req.params.orderId) throw res.status(400).send({ msg: 'orderId is required' });
        let orderId = req.params.orderId;
        //let ingenioId = req.params.ingenioId;
        let response = await this.orderDao.deleteOrderById(orderId);
        logger.debug('CONTROLLER: method deleteOrder Ending');
        res.status(200).send({msg:response });
    }  

}
