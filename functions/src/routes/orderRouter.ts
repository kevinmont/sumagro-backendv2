import { Request, Response} from 'express';
import Firebase from '../utils/firebase';
import { AbstractRouter } from './abstractRouter';

export abstract class OrderRouter extends AbstractRouter{
    constructor(private firebase: Firebase) {
        super();

        this.router.route('/sumagro-app/order').
            post(this.firebase.authentication, async(req, res, next) => this.postOrder(req, res)).
            get(async(req, res, next) => this.getOrders(req, res))

        this.router.route('/sumagro-app/order/:orderId').
            delete(async(req, res, next) => this.deleteOrderByOrderId(req, res)).
            patch(async(req, res, next) => this.getOrder(req, res)).
            get(async(req, res, next) => this.getOrderById(req, res))

        this.router.route('/sumagro-app/generate-pdf/:orderId').
            get(async(req, res, next) => this.generatePdf(req, res))

        this.router.route('/sumagro-app/generate-charge-pdf/chargeformat/:orderId').
            get(async(req, res, next) => this.getChargeData(req, res))
        
        this.router.route('/sumagro-app/order/status/:orderId').
            get(async(req, res, next) => this.getStatusOrder(req, res))

        this.router.route('/sumagro-app/remission/number').
            get(async(req, res, next) => this.getRemissionNumber(req, res))

        this.router.route('/sumagro-app/ordersByIngenio/:ingenioId/status/:status').
            get(async(req, res, next) => this.getOrdersByIngenio(req, res))
        
        this.router.route('/sumagro-app/sumagro-almacen/intransit').
            get(async(req, res, next) => this.intransit(req, res))

        this.router.route('/sumagro-app/sumagro-almacen/outputs').
            get(async(req, res, next) => this.outputs(req, res))
        
        this.router.route('/sumagro-app/almacen/formula/:type').
            get(async(req, res, next) => this.countFormule(req, res))
    }

    protected async abstract postOrder(req: Request, res: Response): Promise<void>;

    protected async abstract getOrders(req: Request, res: Response): Promise<void>;

    protected async abstract deleteOrderByOrderId(req: Request, res: Response): Promise<void>;

    protected async abstract getOrder(req: Request, res: Response): Promise<void>;

    protected async abstract getOrderById(req: Request, res: Response): Promise<void>;

    protected async abstract generatePdf(req: Request, res: Response): Promise<void>;

    protected async abstract getChargeData(req: Request, res: Response): Promise<void>;

    protected async abstract getStatusOrder(req: Request, res: Response): Promise<void>;

    protected async abstract getRemissionNumber(req: Request, res: Response): Promise<void>;

    protected async abstract getOrdersByIngenio(req: Request, res: Response): Promise<void>;

    protected async abstract intransit(req: Request, res: Response): Promise<void>;

    protected async abstract outputs(req: Request, res: Response): Promise<void>;

    protected async abstract countFormule(req: Request, res: Response): Promise<void>;

}