import { Application, Request, Response, NextFunction } from 'express';

export abstract class PingRoute {
    constructor(protected app: Application) {
        app.route('/sumagro-app/getpin').
            get(async (req: Request, res: Response, next: NextFunction) => {
                this.getPing(req, res);
            });
    }

    abstract getPing(req: Request, res: Response): Promise<any>;
}