import {Router, Request, Response, RequestHandler  } from "express";

import { Rogger }  from '../utils/logger';
import { DB } from "../api/db";
const logger = Rogger.getRogger(__filename);


export function RouterInit(db : DB): Router {
    const recipesRouter: Router = Router();

    /**
     * @openapi
     * /databases:
     *   get:
     *     description: Return the databases list.
     *     responses:
     *       200:
     *         description: Array of strings
     */
    recipesRouter.get('/databases', async (req: Request, res: Response) => {
        let collections: any = await db.listDatabases();
        collections = collections.databases.map((e: Record<string, unknown>) => e.name);
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
    recipesRouter.get('/collections', async (req: Request, res: Response) => {
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
    recipesRouter.get('/getRecepies', async (req: Request, res: Response) => {
        try {
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

    return recipesRouter;
}
