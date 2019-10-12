import { Request, Response } from 'express';
import { AbstractRouter } from './abstractRouter';

export abstract class PingRouter extends AbstractRouter {
    constructor() {
        super();
        this.router.route('/sumagro-app/getpin').
            get(async (req, res, next) =>  this.getPing(req, res));
    }

    protected async abstract getPing(req: Request, res: Response): Promise<void>;
}