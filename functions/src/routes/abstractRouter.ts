import { Router } from 'express';
import * as express from 'express';

export abstract class AbstractRouter {
    public router: Router
    constructor() {
        this.router = express.Router()
    }
}