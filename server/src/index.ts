import express from "express";
import cookieParser from 'cookie-parser';

import cors from "cors";
import path from 'path';
import fs from 'fs';

import { DB }  from './api/db';
import { setAuth }  from './utils/auth';
import { Rogger }  from './utils/logger';
import { addGraphql }  from './graphql/resolver';
import { ncargs }  from './api/CLI';
import {RouterInit, sysRouter} from './routes';
import cfg from "../resources/cfg.json";
import { exit } from "process";

const info = JSON.parse(fs.readFileSync(path.join(__dirname, '..',  '..', 'package.json'), 'utf8'));
const logger = Rogger.getRogger(__filename);

process
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p);
  })
  .on('uncaughtException', err => {
    console.error(err, 'Uncaught Exception thrown');
    process.exit(1);
  });


const app = express();
const mockApp = express();
const PORT = 7811;
const MOCK_PORT = 7812;


const args = ncargs.parse_args();

setAuth(args.auth);
app.use(cors());
app.use(express.json());
app.use(cookieParser());

mockApp.use(cors());

async function server() {
    addGraphql(app);
    const db = new DB();
    db.setDB("NightChef");
    await db.connect();

    app.use(RouterInit(db));
    app.use(sysRouter);

    console.log(cfg.LOGO);
    app.listen(PORT, () => {
        logger.info(`Deploy server at http://localhost:${PORT}`);
    });
}


async function run() {
    if (args.version) {
        console.log(info.version);
    }
    args.server && await server();
    args.mock && exit(0);
}

run();
