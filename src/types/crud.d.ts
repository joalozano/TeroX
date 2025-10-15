import { Request, Response, NextFunction } from "express";

declare global {
    type Middleware = (req: Request, res: Response, next: NextFunction) => void;

    interface MiddlewareCRUD {
        get: Middleware[];
        post: Middleware[];
        put: Middleware[];
        delete: Middleware[];
    }
}

export {};