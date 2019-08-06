import * as functions from 'firebase-functions';
import * as express from 'express';
import * as bodyparser from 'body-parser';
import PinRoute from './routes/pinRoute';
import UserRoute from './routes/userRoute';
import NotificationRoute from './routes/notificationRoute';
import OrderRoute from './routes/orderRoute';
//import errorMiddleware from './exceptions/error.middleware';
const json2xls = require('json2xls');
class App{
    public app: express.Application;
    public pinRoute: PinRoute;
    public userRoute:UserRoute;
    public notificationRoute:NotificationRoute;
    public orderRoute:OrderRoute;
    constructor(){
        this.app = express();
        this.pinRoute = new PinRoute();
        this.userRoute = new UserRoute();
        this.notificationRoute = new NotificationRoute();
        this.orderRoute = new OrderRoute();
        this.config();
        this.pinRoute.addRoutes(this.app);
        this.userRoute.addRoutes(this.app);
        this.notificationRoute.addRoutes(this.app);
        this.orderRoute.addRoutes(this.app);
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