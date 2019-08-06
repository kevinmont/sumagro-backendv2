import * as express from 'express';
import NotificationController from '../controller/notificationController';

export default class NotificationRoute{
    public notificationController: NotificationController;

    constructor(){
        this.notificationController= new NotificationController();
    }

    addRoutes(app: express.Application){

        app.route('/sumagro-app/send/notification')
        .post((req: express.Request, res: express.Response)=>{
                this.notificationController.notificationPush(req,res)
            }
        )

    }
}