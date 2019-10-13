import * as functions from 'firebase-functions';
import * as express from 'express';
import * as bodyparser from 'body-parser';
import OrderRoute from './routes/orderRoute';
import IngenioRoute from './routes/ingenioRoute';
import Mysql from './utils/mysql';
import SumagroReportRouter from './routes/sumagroReportRouter';
import DatabaseRoute from './routes/databaseRoute';
import SackRoute from './routes/sackRote';
import Firebase from './utils/firebase';
import config from './models/config';
import { PingController } from './controller/pingController';
import { PingDao } from './dao/pingDao';
import { PingDaoImpl } from './dao/impl/pingDaoImpl';
import { PingRouter } from './routes/pingRouter';
import { PingRouterImpl } from './routes/impl/pingRouterImpl';
import { UserDao } from './dao/userDao';
import { UserDaoImpl } from './dao/impl/userDaoImpl';
import { UserController } from './controller/userController';
import AddressDao from './dao/addressDao';
import OrderDao from './dao/orderDao';
import { Nodemailers } from './utils/Nodemailer-helper';
import ingenioDao from './dao/ingenioDao';
import log4jsInitializer from './utils/log4jsInitializer';
import { UserRouterImpl } from './routes/impl/userRouterImpl';
import SackController from './controller/sackController';
import OrderController from './controller/orderController';
import { UserRouter } from './routes/userRouter';
//import errorMiddleware from './exceptions/error.middleware';
const json2xls = require('json2xls');
class App {
    // core dependencies
    public app: express.Application
    private mysql: Mysql;
    private firebase: Firebase;
    // daos properties
    private pingDao: PingDao;
    private userDao: UserDao;
    private addressDao: AddressDao;
    private orderDao: OrderDao;
    private ingenioDao: ingenioDao;
    // controllers properties
    private pingController: PingController;
    private userController: UserController;
    private sackController: SackController;
    private orderController: OrderController;
    // router properties
    private pingRouter: PingRouter
    private userRouter: UserRouter;
    private orderRouter: OrderRoute;
    private ingenioRouter: IngenioRoute;
    private sumagroReportRouter: SumagroReportRouter;
    private databaseRouter: DatabaseRoute;
    private sackRouter: SackRoute;

    // utils
    private nodemailers: Nodemailers;

    constructor() {
        log4jsInitializer();
        // 1 core dependencies
        this.mysql = new Mysql();
        this.firebase = new Firebase(config);
        this.app = express();

        // 2.- utils
        this.nodemailers = new Nodemailers(this.config);

        // 3.- dao dependencies
        this.addressDao = new AddressDao(this.mysql);
        this.ingenioDao = new ingenioDao(this.mysql);
        this.pingDao = new PingDaoImpl(this.mysql);
        this.orderDao = new OrderDao(this.mysql);
        this.userDao = new UserDaoImpl(this.mysql);
        
        // 4.- controller dependencies
        this.pingController = new PingController(this.pingDao)
        this.userController = new UserController(this.userDao, this.ingenioDao, this.addressDao, this.orderDao, this.nodemailers, this.firebase)
        this.sackController = new SackController(this.mysql);
        this.orderController = new OrderController(this.mysql, this.firebase);

        // 5.- router dependencies
        this.pingRouter = new PingRouterImpl(this.pingController)
        this.userRouter = new UserRouterImpl(this.firebase, this.userController, this.sackController, this.orderController)

        this.orderRouter = new OrderRoute(this.mysql, this.firebase);
        this.ingenioRouter= new IngenioRoute(this.mysql, this.firebase);
        this.sumagroReportRouter = new SumagroReportRouter(this.mysql, this.firebase);
        this.databaseRouter = new DatabaseRoute(this.mysql);
        this.sackRouter = new SackRoute(this.mysql, this.firebase);
        this.config();

        this.orderRouter.addRoutes(this.app);
        this.ingenioRouter.addRoutes(this.app);
        this.sumagroReportRouter.addRoutes(this.app);
        this.databaseRouter.addRoutes(this.app);
        this.sackRouter.addRoutes(this.app);

        // injection routers to express
        this.app.use(this.pingRouter.router);
        this.app.use(this.userRouter.router)
    }
    config() {
        this.app.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, responseType, X-Total-Count");
            res.header('Access-Control-Allow-Methods', "*");
            next();
        });
        this.app.use(json2xls.middleware);

        this.app.options('*', (req, res) => {
            // allowed XHR methods
            res.header('Access-Control-Allow-Methods', 'GET, PATCH, PUT, POST, DELETE, OPTIONS');
            res.send();
        });
        this.app.use(bodyparser.json({ limit: '5mb' }));
        this.app.use(json2xls.middleware);
        this.app.use(bodyparser.urlencoded({ extended: false }));
    }
}

export const app = functions.https.onRequest(new App().app);