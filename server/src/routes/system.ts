import {Router, Request, Response } from "express";
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

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
 * /login:
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
sysRouter.post('/login', async (req: Request, res: Response) => {
console.log(req.body)
});

/**
 * @openapi
 * /about:
 *   get:
 *     description: Return information about the server.
 *     responses:
 *       200:
 *         description: Returns String with the server name.
 */
sysRouter.get('/about', (req: Request, res: Response) => {
res.send("NightChef");
});

sysRouter.use('/api-docs', swaggerUi.serve);
sysRouter.get('/api-docs', swaggerUi.setup(openapiSpecification));


export const foo = 6;