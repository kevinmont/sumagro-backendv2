import { AbstractRouter } from "./abstractRouter";
import { Request, Response } from 'express'
import Firebase from "../utils/firebase";

export abstract class UserRouter extends AbstractRouter{
    constructor(private firebase: Firebase) {
        super();
        
        this.router.route('/sumagro-app/register').
            post(async(req, res, next) => this.createUser(req, res));

        this.router.route('/sumagro-app/user/:userId').
            delete(this.firebase.authentication, async (req, res, next) => this.deleteUser(req, res)).
            get(this.firebase.authentication, async (req, res, next) => this.getUserInfo(req, res));
        
        this.router.route('/sumagro-app/notification').
            post( async(req, res, next) => this.notificationPush(req, res));

        this.router.route('/sumagro-app/token').
            post(this.firebase.authentication, async(req, res, next)=> this.saveToken(req,res)).
            delete(this.firebase.authentication, async(req, res, next)=> this.deleteToken(req,res))

        this.router.route('/sumagro-app/users').
            get(async(req, res, next) => this.getUsers(req, res));

        this.router.route('/sumagro-app/capturist/sacks').
            post(this.firebase.authentication, async(req, res, next) => this.registerSacks(req, res));

        this.router.route('/sumagro-app/order').
            post(this.firebase.authentication, async(req, res, next) => this.postOrder(req, res));

        this.router.route('/sumagro-app/order/:orderId').
            delete(async(req, res, next) => this.deleteOrderByOrderId(req, res)).
            patch(this.firebase.authentication, async(req,res, next) =>  this.getOrder(req,res)).
            get(this.firebase.authentication, async (req, res, next) => this.getOrderById(req,res));
            
        this.router.route('/sumagro-app/ingenio/:ingenioId').
            delete(async(req, res, next) => this.deleteIngenioById(req, res));

        this.router.route('/sumagro-app/warehouse/oders').
            get(this.firebase.authentication, async(req, res, next) => this.warehouseOrders(req, res))

        this.router.route('sumagro-app/ingenio/:ingenioId/order/:orderId').
            patch(this.firebase.authentication, async(req, res, next) => this.updateOrderStatus(req, res)).
            delete(this.firebase.authentication, async (req, res, next) => this.deleteOrder(req, res));

    }

    protected async abstract createUser(req: Request, res: Response): Promise<void>;

    protected async abstract deleteUser(req: Request, res: Response): Promise<void>;

    protected async abstract getUserInfo(req: Request, res: Response): Promise<void>;

    protected async abstract notificationPush(req: Request, res: Response): Promise<void>;

    protected async abstract saveToken(req: Request, res: Response): Promise<void>;

    protected async abstract deleteToken(req: Request, res: Response): Promise<void>;

    protected async abstract getUsers(req: Request, res: Response): Promise<void>;
    
    protected async abstract registerSacks(req: Request, res: Response): Promise<void>;

    protected async abstract postOrder(req: Request, res: Response): Promise<void>;

    protected async abstract deleteOrderByOrderId(req: Request, res: Response): Promise<void>;

    protected async abstract getOrder(req: Request, res: Response): Promise<void>;
    
    protected async abstract getOrderById(req: Request, res: Response): Promise<void>;

    protected async abstract deleteIngenioById(req: Request, res: Response): Promise<void>;

    protected async abstract warehouseOrders(req: Request, res: Response): Promise<void>;

    protected async abstract updateOrderStatus(req: Request, res: Response): Promise<void>;

    protected async abstract deleteOrder(req: Request, res: Response): Promise<void>;
}