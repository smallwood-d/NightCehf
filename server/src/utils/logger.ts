import winston from 'winston';
import moment from "moment";
import path from 'path';
import * as Transport from 'winston-transport';

const { combine, printf, colorize } = winston.format;

const timeStamp = () => moment().format('YYYY-MM-DD HH:mm:ss').trim();
const myFormat = printf( (log => {
    const { level, message, label, timestamp, ...args} = log;
    return `${timeStamp()} ${level}: ${message}`;
}));

interface TransportsMap {
    [name: string]: Transport;
}

const logTransports: TransportsMap  = {
    console: new winston.transports.Console({
        level: 'debug',
        format: combine (
            colorize(),
            winston.format.simple(),
            myFormat
        ),
    })
};

class Rogger {
    private static logger: winston.Logger;
    private fileName: string;

    constructor(filePath: string) {
        this.fileName = path.basename(filePath);
    }

    private formatted_msg(msg: string): string {
        return `[${this.fileName}] ${msg}`;
    }

    public debug(msg: string): void {
        Rogger.getLogger().debug(this.formatted_msg(msg));
    }

    public info(msg: string): void {
        Rogger.getLogger().info(this.formatted_msg(msg));
    }

    public warn(msg: string): void {
        Rogger.getLogger().warn(this.formatted_msg(msg));
    }

    public error(msg: string): void {
        Rogger.getLogger().error(this.formatted_msg(msg));
    }

    public setLogLevel(logger: string, level: string): void {
        if (logTransports[logger]) {
            logTransports[logger].level = level;
        }
    }

    public static getLogger(): winston.Logger {
        return Rogger.logger;
    }

    public static getRogger(fileName: string): Rogger {
        if (!Rogger.getLogger()) {
                Rogger.initLogger();
        }
        return new Rogger(fileName);
    }

    private static initLogger(): void {
        Rogger.logger = winston.createLogger({
            transports: [
                logTransports.console
            ],
            exitOnError: false,
        });
        winston.addColors({error: 'red', warn: 'yellow', info: 'cyan', debug: 'white'});
    }
}

export { Rogger };
