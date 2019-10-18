import { OrderRouter } from "../orderRouter";
import { Request, Response} from "express";
import * as log4js from "log4js";
import Firebase from "../../utils/firebase";
import { OrderController } from "../../controller/orderController";

const logger = log4js.getLogger("sumagro.routes.impl.OrderRouterImpl");

export class OrderRouterImpl extends OrderRouter {

    constructor(firebase: Firebase, 
        private orderController: OrderController) {
        super(firebase)
    }
    
    async postOrder(req: Request, res: Response): Promise<void> {
        logger.info('getPing(): starting')
        this.orderController.postOrder(req, res)
        logger.info('getPing(): ending')
    }    

    async getOrders(req: Request, res: Response): Promise<void> {
        logger.info('getOrders(): starting')
        this.orderController.getOrders(req, res)
        logger.info('getOrders(): ending')
    }

    async deleteOrderByOrderId(req: Request, res: Response): Promise<void> {
        logger.info('deleteOrderByOrderId(): starting')
        this.orderController.deleteOrderByOrderId(req, res)
        logger.info('deleteOrderByOrderId(): ending')
    }

    async getOrder(req: Request, res: Response): Promise<void> {
        logger.info('getOrder(): starting')
        this.orderController.getOrder(req, res)
        logger.info('getOrder(): ending')
    }

    async getOrderById(req: Request, res: Response): Promise<void> {
        logger.info('getOrderById(): starting')
        this.orderController.getOrderById(req, res)
        logger.info('getOrderById(): ending')
    }

    async generatePdf(req: Request, res: Response): Promise<void> {
        logger.info('generatePdf(): starting')
        this.orderController.generatePdf(req, res)
        logger.info('generatePdf(): ending')
    }

    async getChargeData(req: Request, res: Response): Promise<void> {
        logger.info('getChargeData(): starting')
        this.orderController.getChargeData(req, res)
        logger.info('getChargeData(): ending')
    }

    async getStatusOrder(req: Request, res: Response): Promise<void> {
        logger.info('getStatusOrder(): starting')
        this.orderController.getStatusOrder(req, res)
        logger.info('getStatusOrder(): ending')
    }

    async getRemissionNumber(req: Request, res: Response): Promise<void> {
        logger.info('getRemissionNumber(): starting')
        this.orderController.getRemissionNumber(req, res)
        logger.info('getRemissionNumber(): ending')
    }

    async getOrdersByIngenio(req: Request, res: Response): Promise<void> {
        logger.info('getOrdersByIngenio(): starting')
        this.orderController.getOrdersByIngenio(req, res)
        logger.info('getOrdersByIngenio(): ending')
    }

    async intransit(req: Request, res: Response): Promise<void> {
        logger.info('intransit(): starting')
        this.orderController.intransit(req, res)
        logger.info('intransit(): ending')
    }

    async outputs(req: Request, res: Response): Promise<void> {
        logger.info('outputs(): starting')
        this.orderController.outputs(req, res)
        logger.info('outputs(): ending')
    }

    async countFormule(req: Request, res: Response): Promise<void> {
        logger.info('countFormule(): starting')
        this.orderController.countFormule(req, res)
        logger.info('countFormule(): ending')
    }

}