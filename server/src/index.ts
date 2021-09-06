import express, { Request, Response } from "express";
import cors from "cors";
import path from 'path';
import fs from 'fs';

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

    app.get('/about', (req: Request, res: Response) => {
        res.send("NightChef");
    });

    app.get('/databases', async (req: Request, res: Response) => {
        let collections: any = await db.listDatabases();
        collections = collections.databases.map((e: any) => e.name);
        res.send(JSON.stringify(collections));
    });

    app.get('/collections', async (req: Request, res: Response) => {
        let collections = await db.listCollections();
        collections = collections.map(col => col.name);
        res.send(JSON.stringify(collections));
    });

    app.get('/getRecepies', async (req: Request, res: Response) => {
        try {
            logger.debug(`serching for recepies with [${req.body.ingredients}]`);
            const results = await db.getRecepie(req.body.ingredients, +req.query.limit, +req.query.offset);
            res.send(results);
        } catch (e) {
            logger.error(e);
            res.status(500).send(e.stack);
        }
    });

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
