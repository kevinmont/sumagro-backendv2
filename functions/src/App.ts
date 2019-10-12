import * as functions from 'firebase-functions';
import * as express from 'express';
import * as bodyparser from 'body-parser';
import UserRoute from './routes/userRoute';
import OrderRoute from './routes/orderRoute';
import IngenioRoute from './routes/ingenioRoute';
import Mysql from './utils/mysql';
import SumagroReportRouter from './routes/sumagroReportRouter';
import DatabaseRoute from './routes/databaseRoute';
import SackRoute from './routes/sackRote';
import Firebase from './utils/firebase';
import config from './models/config';
import PingDaoImpl from './dao/impl/pingDaoImpl';
import PingController from './controller/pingController';
import { PingDao } from './dao/pingDao';
import { PingRoute } from './routes/pingRoute';
import PingRouteImpl from './routes/impl/pingRouteImpl';
import log4jsInitializer from './utils/log4jsInitializer';
//import errorMiddleware from './exceptions/error.middleware';
const json2xls = require('json2xls');
class App {
    public app: express.Application
    private mysql: Mysql;
    private firebase: Firebase;
    // daos properties
    private pingDao: PingDao;
    // controllers properties
    public pingController: PingController
    // route properties
    public pingRoute: PingRoute
    private userRoute: UserRoute;
    private orderRoute: OrderRoute;
    private ingenioRoute: IngenioRoute;
    private sumagroReportRouter: SumagroReportRouter;
    private databaseRoute: DatabaseRoute;
    private sackRoute: SackRoute;
    constructor() {
        log4jsInitializer();

        this.mysql = new Mysql();
        this.firebase = new Firebase(config);
        this.app = express()
        // 1.- Add dao dependencies
        this.pingDao = new PingDaoImpl(this.mysql)
        // 2.- Add controller dependencies
        this.pingController = new PingController(this.pingDao)
        // 3- Add Routes
        this.pingRoute = new PingRouteImpl(this.app, this.pingController)
        this.userRoute = new UserRoute(this.mysql, this.firebase);
        this.orderRoute = new OrderRoute(this.mysql, this.firebase);
        this.ingenioRoute = new IngenioRoute(this.mysql, this.firebase);
        this.sumagroReportRouter = new SumagroReportRouter(this.mysql, this.firebase);
        this.databaseRoute = new DatabaseRoute(this.mysql);
        this.sackRoute = new SackRoute(this.mysql, this.firebase);
        this.config();
        this.userRoute.addRoutes(this.app);
        this.orderRoute.addRoutes(this.app);
        this.ingenioRoute.addRoutes(this.app);
        this.sumagroReportRouter.addRoutes(this.app);
        this.databaseRoute.addRoutes(this.app);
        this.sackRoute.addRoutes(this.app);
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