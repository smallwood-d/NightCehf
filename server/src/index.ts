import express, { Request, Response } from "express";
import cors from "cors";
import path from 'path';
import fs from 'fs';

import { DB }  from './api/db';
import { setAuth }  from './utils/auth';
import { Rogger }  from './utils/logger';
import { addGraphql }  from './graphql/resolver';
import { ncargs }  from './api/CLI';
import {ncRouterInit} from './routes/routes';
import { authenticate }  from './routes/AuthMid';
import {ncMockRouterInit} from './routes/mockRoutes';
import cfg from "../resources/cfg.json";

const info = JSON.parse(fs.readFileSync(path.join(__dirname, '..',  '..', 'package.json'), 'utf8'));
const logger = Rogger.getRogger(__filename);

const app = express();
const mockApp = express();
const PORT = 7811;
const MOCK_PORT = 7812;


const args = ncargs.parse_args();

setAuth(args.auth);
app.use(cors());
app.use(express.json());

mockApp.use(cors());

async function server() {
    console.log(cfg.LOGO);

    addGraphql(app);
    const db = new DB();
    db.setDB("NightChef");
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

    app.use(authenticate, ncRouterInit(db));

    app.listen(PORT, () => {
        logger.info(`Deploy server at http://localhost:${PORT}`);
    });
}

async function mockServer() {
    console.log(cfg.LOGO);

    /**
         * @openapi
         * /about:
         *   get:
         *     description: Return information about the server.
         *     responses:
         *       200:
         *         description: Returns String with the server name.
         */
    mockApp.get('/about', (req: Request, res: Response) => {
        res.send("MockNightChef");
    });

    mockApp.use(ncMockRouterInit());

    mockApp.listen(MOCK_PORT, () => {
        logger.info(`Deploy mock server at http://localhost:${MOCK_PORT}`);
    });
}

async function run() {
    if (args.version) {
        console.log(info.version);
    }
    args.server && await server();
    args.mock && await mockServer();
}

run();
