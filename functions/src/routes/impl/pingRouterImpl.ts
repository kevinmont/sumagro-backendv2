import { PingController } from "../../controller/pingController";
import { Request, Response } from "express";
import { PingRouter } from "../pingRouter";
import * as log4js from 'log4js'

const logger = log4js.getLogger("sumagro.routes.impl.PingRouteImpl");

export class PingRouterImpl extends PingRouter {
    constructor(private pingController: PingController) {
        super();
    }

    async getPing(req: Request, res: Response): Promise<void> {
        logger.info('getPing(): starting')
        let result = await this.pingController.getPing()
        res.status(200).send({ result });
        logger.info('getPing(): ending')
    }

}