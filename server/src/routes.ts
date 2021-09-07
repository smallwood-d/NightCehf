import {Router, Request, Response } from "express";
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import { Rogger }  from './utils/logger';
import { DB } from "./api/db";
const logger = Rogger.getRogger(__filename);


export function ncRouterInit(db : DB) {
    const ncRouter: Router = Router();

    /**
     * @openapi
     * /databases:
     *   get:
     *     description: Return the databases list.
     *     responses:
     *       200:
     *         description: Array of strings
     */
    ncRouter.get('/databases', async (req: Request, res: Response) => {
        let collections: any = await db.listDatabases();
        collections = collections.databases.map((e: any) => e.name);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(collections));
    });

    /**
     * @openapi
     * /collections:
     *   get:
     *     description: Return the recepies DB collections list.
     *     responses:
     *       200:
     *         description: Array of strings
     */
    ncRouter.get('/collections', async (req: Request, res: Response) => {
        let collections = await db.listCollections();
        collections = collections.map((col: Record<string, unknown>) => col.name);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(collections));
    });

    /**
     * @openapi
     * /getRecepies:
     *   get:
     *     description: Return all recepies that contain at least one ingredient
     *                  from the ingredients list.
     *     parameters:
     *       - in: query
     *         name: ingredients
     *         description: List of ingredients to search for.
     *         schema:
     *           type: string
     *           example: oil, egg
     *         required: true
     *       - in: query
     *         name: offset
     *         schema:
     *           type: integer
     *           example: 3
     *         description: The number of items to skip before starting to collect the result set
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *           example: 5
     *         description: The numbers of items to return
     *     responses:
     *       200:
     *         description: Returns JSON with all the match recepies.
     */
    ncRouter.get('/getRecepies', async (req: Request, res: Response) => {
        try {
            console.log(req.body);
            logger.debug(`serching for recepies with [${req.query.ingredients}]`);
            const ingredients: string[] = 
            (req.query.ingredients as string).split(',').map(i => i.trim());

            const results = await db.getRecepie(ingredients, +req.query.limit, +req.query.offset);
            res.setHeader('Content-Type', 'application/json');
            res.send(results);
        } catch (e) {
            logger.error(e);
            res.status(500).send(e.stack);
        }
    });

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

    ncRouter.use('/api-docs', swaggerUi.serve);
    ncRouter.get('/api-docs', swaggerUi.setup(openapiSpecification));

    return ncRouter;
}
