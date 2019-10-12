import PingController from "../../controller/pingController";
import { Application, Request, Response } from "express";
import { PingRoute } from "../pingRoute";
import * as log4js from 'log4js'

const logger = log4js.getLogger("PingRouteImpl");

export default class PingRouteImpl extends PingRoute {
    private pingController: PingController;
    constructor(protected app: Application,
        pingController: PingController) {
        super(app);
        this.pingController = pingController;
    }

    async getPing(req: Request, res: Response): Promise<any> {
        logger.log('getPing(): starting')
        let result = await this.pingController.getPing()
        res.status(200).send({ result });
        logger.log('getPing(): ending')
    }

}