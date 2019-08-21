import * as functions from 'firebase-functions';
import * as express from 'express';
import * as bodyparser from 'body-parser';
import PinRoute from './routes/pinRoute';
import UserRoute from './routes/userRoute';
import OrderRoute from './routes/orderRoute';
import IngenioRoute from './routes/ingenioRoute';
import Mysql from './utils/mysql';
import  SumagroReportRouter  from './routes/sumagroReportRouter';
import DatabaseRoute from './routes/databaseRoute';
import SackRoute from './routes/sackRote';
import Firebase from './utils/firebase';
import config from './models/config';
//import errorMiddleware from './exceptions/error.middleware';
const json2xls = require('json2xls');
class App{
    public app: express.Application;
    public pinRoute: PinRoute;
    public userRoute:UserRoute;
    public orderRoute:OrderRoute;
    public ingenioRoute:IngenioRoute;
    private mysql: Mysql;
    public sumagroReportRouter : SumagroReportRouter;
    public databaseRoute: DatabaseRoute;
    public sackRoute: SackRoute;
    public firebase: Firebase;
    constructor(){
        this.mysql = new Mysql();
        this.firebase = new Firebase(config);
        this.app = express();
        this.pinRoute = new PinRoute();
        this.userRoute = new UserRoute(this.mysql,this.firebase);
        this.orderRoute = new OrderRoute(this.mysql,this.firebase);
        this.ingenioRoute = new IngenioRoute(this.mysql,this.firebase);
        this.sumagroReportRouter = new SumagroReportRouter(this.mysql);
        this.databaseRoute = new DatabaseRoute(this.mysql);
        this.sackRoute = new SackRoute(this.mysql,this.firebase);
        this.config();
        this.pinRoute.addRoutes(this.app);
        this.userRoute.addRoutes(this.app);
        this.orderRoute.addRoutes(this.app);
        this.ingenioRoute.addRoutes(this.app);
        this.sumagroReportRouter.addRoutes(this.app);
        this.databaseRoute.addRoutes(this.app);
        this.sackRoute.addRoutes(this.app);
    }
    config(){
        this.app.use(function(req, res, next) {
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
        this.app.use(bodyparser.urlencoded({ extended: false}));
    }
}

export const app = functions.https.onRequest(new App().app);