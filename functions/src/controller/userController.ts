import { Request, Response } from 'express';
import UserDao from '../dao/userDao';
import { User } from '../models/user';
import { Nodemailers } from '../utils/Nodemailer-helper';
import Firebase from '../utils/firebase';
import config from '../models/config';
import * as log4js from 'log4js';
import {roles} from '../models/rol';
const logger = log4js.getLogger();
logger.level = 'debug';

export default class UserController {
    public userDao: UserDao;
    public nodemailers: Nodemailers;
    public firebase: Firebase;
    public config: any;

    constructor(firebase: Firebase) {
        this.config = config;
        this.userDao = new UserDao();
        this.firebase = firebase;
        this.nodemailers = new Nodemailers(this.config);
    }

    async createUser(req: Request, res: Response) {
        logger.info("Controller: Methos createUser Starting");
        let { email, uid, rol, ingenioId } = req.body;
        let password = await this.makeid(8);
        let user: User = {
            email,
            password,
            uid,
            rol,
            ingenioId
        }

        if (user.phoneNumber == undefined) {
            delete user.phoneNumber;
        }
        if (user.displayName == undefined) {
            delete user.displayName;
        }

        if (user.ingenioId == undefined && (user.rol == "CAPTURIST" || user.rol == "WAREHOUSE")) {
            delete user.ingenioId;
        }


        let emailUser: any = await this.userDao.getUserById(email);
        console.log(emailUser)
        if (emailUser.length) throw res.status(400).send({ msg: "Email is register" }); 


        try {
            let response:any = await this.firebase.createUserFirebase(user);
            if(user.rol == "WAREHOUSE" || user.rol == "CAPTURIST"){
                user.ingenioId = 0;
            }
            await this.userDao.createUser(user,response.uid);
            await this.nodemailers.sendMailNewAccount(email, { email: user.email, password });
            res.status(200).send({ msg: "Usuario registrado" });
        } catch (err) {
            logger.error(err);
            res.status(200).send({ msg: "Usuarios actualizados" });
        }
        logger.debug("Controller: Method createUser Ending");
    }

    makeid(length: number) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    async deleteUser(req: Request, res: Response) {
        logger.info(`Controller: Method deleteUser startting`);

        if (req.headers.email == "sumagro.distribucion@gmail.com") {
            if (!req.params.userId) throw res.status(400).send(`{"msg": "userId is required"}`);
            let userid: any = req.params.userId;

            let userFirebase: any = await this.firebase.getUserFirebase(userid);
            let userRds: any = await this.userDao.getUserByEmail(userFirebase.email)
            await this.userDao.deleteUser(userRds[0].id);
            await this.firebase.deleteUserFirebase(userid)
            res.status(200).send(`{}`);
        } else {
            res.status(401).send({ msg: "USUARIO NO AUTORIZADO" });
        }

        logger.debug(`Controller: Method deleteUser Ending`);
    }

    async notificationPush(req: Request, res: Response) {
        logger.info("Controller: Methos notificationPush Starting");
        let tokens = req.body.tokens;
        let notify = req.body.notify;
        if (!tokens) throw res.status(400).send('request is required');
        let response = await this.firebase.notification(tokens, notify);
        logger.info(response);
        logger.debug("Controller: Methos notificationPush Ending");
        res.send(response);
    }

    async saveToken(req: any, res: Response) {
        logger.info("Controller: Methos saveToken Starting");
        let token = req.body.token;
        let uid = req.headers.uid;
        logger.info("TOKEN A REGISTRAR...", token)
        let userFirebase: any = await this.firebase.getUserFirebase(uid);
        let userRds: any = await this.userDao.getUserByEmail(userFirebase.email)
        await this.userDao.saveToken(userRds[0].id, token)
        let response = await this.firebase.saveToken(uid, token);
        logger.debug("Controller: Methos saveToken Ending");
        res.send(response);
    }

    async deleteToken(req: any, res: Response) {
        logger.info("Controller: Methos deleteToken Starting");
        let uid = req.headers.uid;
        let userFirebase: any = await this.firebase.getUserFirebase(uid);
        let userRds: any = await this.userDao.getUserByEmail(userFirebase.email);
        await this.userDao.deleteToken(userRds[0].id)
        let response = await this.firebase.deleteToken(uid);
        logger.debug("Controller: Methos deleteToken Ending");
        res.send(response);
    }

    async getUsers(req: Request, res: Response) {
        logger.info('CONTROLER: Method getUsers Startting');
        let num_page: number = req.query.peer_page;
        let total_page: number = req.query.page;
        let ingenioId: number = req.query.ingenioId;
        let rol: string = req.query.rol;
        if(!roles.includes(rol)) throw res.status(400).send(`ROL is invalid`);
        if (!num_page) throw res.status(400).send(`peer_page is required`);
        if (!total_page) throw res.status(400).send(`page is required`)
        let discard: number = num_page * total_page;
        let users: any;
        let structureUsers: any = [];

        if (!ingenioId) {
            if (!rol) {
                users = await this.userDao.getUsers(discard, total_page);
            } else {
                let complements: string = `WHERE rol='${rol}'`;
                users = await this.userDao.getUsers(discard, total_page, complements);
            }
        } else {
            if (!rol) {
                let complements: string = `WHERE ingenioid=${ingenioId}`;
                users = await this.userDao.getUsers(discard, total_page, complements);
            } else {
                let complements: string = `WHERE ingenioid=${ingenioId} AND rol='${rol}'`;
                users = await this.userDao.getUsers(discard, total_page, complements);
            }
        }
        for (let user of users) {
            structureUsers.push({
                uid: `${user.id}`,
                rol: `${user.rol}`,
                email: `${user.email}`,
                ingenioId: `${user.ingenioid}`
            });
        }
        logger.debug('CONTROLER: Method getUsers Ending');
        res.status(200).send(structureUsers);
    }
}
