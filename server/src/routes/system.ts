import {Router, Request, Response } from "express";
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import {sgininUser, verifyUser, genrateJWT} from '../utils/auth';

import { Rogger }  from '../utils/logger';
const logger = Rogger.getRogger(__filename);

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
        title: 'NightChef',
        version: '0.0.1',
        },
    },
    apis: [path.join(__dirname, '*.js')], // files containing annotations as above
};

const openapiSpecification = swaggerJsdoc(options);

export const sysRouter: Router = Router();

/**
 * @openapi
 * /system/login:
 *   post:
 *     description: login to NightChef.
 *     parameters:
 *       - in: body
 *         name: user
 *         description: User name
 *         schema:
 *           type: string
 *           example: JDad
 *         required: true
 *       - in: body
 *         name: pass
 *         description: Cryptic digest of the password.
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Returns JSON with all the match recepies.
 *       403: 
 *         bad user creadentilas
 */
sysRouter.post('/system/login', (req: Request, res: Response) => {
    const user = req.body.user;
    const key = req.body.key;
    if (verifyUser(user, key)) {
        const token = genrateJWT({"user": user});
        res.cookie('session_id', token, { maxAge: 900000, httpOnly: true });
        res.sendStatus(200);
    } else {
        res.sendStatus(403);
    }
});

sysRouter.post('/system/signin', (req: Request, res: Response) => {
    sgininUser(req.body.user, req.body.key);
    res.sendStatus(200);
});

/**
 * @openapi
 * /system/about:
 *   get:
 *     description: Return information about the server.
 *     responses:
 *       200:
 *         description: Returns String with the server name.
 */
sysRouter.get('/system/about', (req: Request, res: Response) => {
res.send("NightChef");
});

sysRouter.use('/api-docs', swaggerUi.serve);
sysRouter.get('/api-docs', swaggerUi.setup(openapiSpecification));