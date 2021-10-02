import { Request, Response, RequestHandler  } from "express";

import { verifyApiKey, isAuth, verifyJWT } from "../utils/auth";

export const authenticate: RequestHandler = (req: Request, res: Response, next: any): void  => {
    console.log(" tring to authenticate....");
    const key: string = req.headers?.knigt as string;
    if (!isAuth() || (key && verifyApiKey(key)) || verifyJWT(req.cookies.session_id)) {
        next();
    } 
    else {
        res.sendStatus(403);
    }
}