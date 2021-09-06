import express, { Request, Response } from "express";
import cors from "cors";
import path from 'path';
import fs from 'fs';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const info = JSON.parse(fs.readFileSync(path.join(__dirname, '..',  '..', 'package.json'), 'utf8'));

import { DB }  from './api/db';
import { Rogger }  from './utils/logger';
import { addGraphql }  from './graphql/resolver';
import { ncargs }  from './api/CLI';

const logger = Rogger.getRogger(__filename);

import cfg from "../resources/cfg.json";

const args = ncargs.parse_args();

const app = express();
const PORT = 7811

app.use(cors());
app.use(express.json());

async function server() {
    console.log(cfg.LOGO);

    addGraphql(app);
    const db = new DB();
    db.setDB("recepies");
    await db.connect();

    /**
     * @openapi
     * /about:
     *   get:
     *     description: Return information about the server.
     *     responses:
     *       200:
     *         description: Returns String with the server name.
     */
    app.get('/about', (req: Request, res: Response) => {
        res.send("NightChef");
    });

    /**
     * @openapi
     * /databases:
     *   get:
     *     description: Return the databases list.
     *     responses:
     *       200:
     *         description: Array of strings
     */
    app.get('/databases', async (req: Request, res: Response) => {
        let collections: any = await db.listDatabases();
        collections = collections.databases.map((e: any) => e.name);
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
    app.get('/collections', async (req: Request, res: Response) => {
        let collections = await db.listCollections();
        collections = collections.map(col => col.name);
        res.send(JSON.stringify(collections));
    });
    
    /**
     * @openapi
     * /getRecepies:
     *   get:
     *     description: Return all recepies that contain at least one ingredient
     *                  from the ingredients list.
     *     parameters:
     *       - in: body
     *         name: ingredients
     *         description: List of ingredients to search for.
     *         schema:
     *           type: array
     *           items:
     *             type: string
     *           example: ["oil", "egg"]
     *         required: true
     *       - in: query
     *         name: offset
     *         schema:
     *           type: integer
     *         description: The number of items to skip before starting to collect the result set
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *         description: The numbers of items to return
     *     responses:
     *       200:
     *         description: Returns JSON with all the match recepies.
     */
    app.get('/getRecepies', async (req: Request, res: Response) => {
        try {
            console.log(req.body);
            logger.debug(`serching for recepies with [${req.body.ingredients}]`);
            const results = await db.getRecepie(req.body.ingredients, +req.query.limit, +req.query.offset);
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

    app.use('/api-docs', swaggerUi.serve);
    app.get('/api-docs', swaggerUi.setup(openapiSpecification));

    app.listen(PORT, () => {
        logger.info(`Deploy server at http://localhost:${PORT}`);
    });
}

async function run() {
    if (args.version) {
        console.log(info.version);
    }
    args.server && await server();
}

run();
