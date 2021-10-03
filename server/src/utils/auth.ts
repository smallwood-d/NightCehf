import jwt, {JwtHeader} from 'jsonwebtoken';

import cfg from "../../resources/cfg.json";

const secret: string = "olalala"
const users: Record<string, string> = {};
let auth: boolean = null;

export function verifyApiKey(key: string): boolean {
    return !!key && ["Aa123456"].includes(key);
}

export function verifyUser(user: string, key: string): boolean {
    return user && key && users[user] === key;
}

export function sgininUser(user: string, key: string) {
    user && key && (users[user] = key);
}

export function verifyJWT(token: string): boolean {
    let decode;
    try {
        decode = jwt.verify(token, secret);
    } catch (err) {
        console.log('fail to decode ')
    }
    return !!decode;
}

export function genrateJWT(data: Record<string, any>, exp: number = -1) {
    const currTime: number = Date.now();
    const payload:  Record<string, string|number> = {
       'iss':  currTime,
       'iat': new Date().getMilliseconds()      
    }
    const header: JwtHeader = {
        "alg": "HS256",
        "typ": "JWT"
    }

    exp > 0 && (payload['exp'] = currTime + exp);
    Object.assign(payload, {
        ...data
    });

    return jwt.sign(payload, secret, {'header': header});
}

export function setAuth(value: boolean): void {
    auth = value;
}

export function isAuth(): boolean {
    return auth;
}