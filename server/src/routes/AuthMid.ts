import { Request, Response, RequestHandler  } from "express";
import { verifyApiKey, isAuth } from "../utils/auth";

export const authenticate: RequestHandler = (req: Request, res: Response, next: any): void  => {
    console.log(" tring to authenticate....");
    const key: string = req.headers?.knigt as string;
    
    if (!isAuth() || verifyApiKey(key)) {
        next();
    } 
    else {
        res.sendStatus(403);
    }
}