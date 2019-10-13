import { UserRouter } from "../userRouter";
import { UserController } from "../../controller/userController";
import { Request, Response } from 'express'
import Firebase from "../../utils/firebase";
import SackController from "../../controller/sackController";
import OrderController from "../../controller/orderController";
import * as log4js from 'log4js';

const logger = log4js.getLogger('sumagro.routes.impl.UserRouterImpl')

export class UserRouterImpl extends UserRouter {

    constructor(firebase: Firebase,
        private userController: UserController,
        private sackController: SackController,
        private orderController: OrderController) {
        super(firebase);
    }

    async createUser(req: Request, res: Response): Promise<void> {
        logger.info('createUser(): starting');
        this.userController.createUser(req,res);
        logger.info('createUser(): ending')
    }

    async deleteUser(req: Request, res: Response): Promise<void> {
        logger.info('deleteUser(): starting');
        this.userController.deleteUser(req, res);
        logger.info('deleteUser(): ending')
    }

    async getUserInfo(req: Request, res: Response): Promise<void> {
        logger.info('getUserInfo(): starting');
        this.userController.getUserInfo(req, res);
        logger.info('getUserInfo(): ending')
    }

    async notificationPush(req: Request, res: Response): Promise<void> {
        logger.info('notificationPush(): starting');
        this.userController.notificationPush(req, res);
        logger.info('notificationPush(): ending')
    }

    async saveToken(req: Request, res: Response): Promise<void> {
        logger.info('saveToken(): starting');
        this.userController.saveToken(req, res);
        logger.info('saveToken(): ending')
    }

    async deleteToken(req: Request, res: Response): Promise<void> {
        logger.info('deleteToken(): starting');
        this.userController.deleteToken(req, res);
        logger.info('deleteToken(): ending')
    }

    async getUsers(req: Request, res: Response): Promise<void> {
        logger.info('getUsers(): starting');
        this.userController.getUsers(req, res);
        logger.info('getUsers(): ending')
    }

    async registerSacks(req: Request, res: Response): Promise<void> {
        logger.info('registerSacks(): starting');
        this.sackController.registerSacks(req, res);
        logger.info('registerSacks(): ending')
    }

    async postOrder(req: Request, res: Response): Promise<void> {
        logger.info('postOrder(): starting');
        this.orderController.postOrder(req, res);
        logger.info('postOrder(): ending')
    }

    async deleteOrderByOrderId(req: Request, res: Response): Promise<void> {
        logger.info('deleteOrderByOrderId(): starting');
        this.orderController.deleteOrderByOrderId(req, res);
        logger.info('deleteOrderByOrderId(): ending')
    }

    async getOrder(req: Request, res: Response): Promise<void> {
        logger.info('getOrder(): starting');
        this.orderController.getOrder(req, res);
        logger.info('getOrder(): ending')
    }

    async getOrderById(req: Request, res: Response): Promise<void> {
        logger.info('getOrderById(): starting');
        this.orderController.getOrderById(req, res);
        logger.info('getOrderById(): ending')
    }

    async deleteIngenioById(req: Request, res: Response): Promise<void> {
        logger.info('deleteIngenioById(): starting');
        this.userController.deleteIngenioById(req, res);
        logger.info('deleteIngenioById(): ending')
    }

    async warehouseOrders(req: Request, res: Response): Promise<void> {
        logger.info('warehouseOrders(): starting');
        this.orderController.warehouseOrders(req, res);
        logger.info('warehouseOrders(): ending')
    }

    async updateOrderStatus(req: Request, res: Response): Promise<void> {
        logger.info('updateOrderStatus(): starting');
        this.userController.updateOrderStatus(req, res);
        logger.info('updateOrderStatus(): ending')
    }

    async deleteOrder(req: Request, res: Response): Promise<void> {
        logger.info('deleteOrder(): starting');
        this.userController.deleteOrder(req, res);
        logger.info('deleteOrder(): ending')
    }

}