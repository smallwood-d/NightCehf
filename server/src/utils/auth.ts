import cfg from "../../resources/cfg.json";

let auth: boolean = null;

export function verifyApiKey(key: string): boolean {
    return !!key && ["Aa123456"].includes(key);
}

export function verifyUser(user: string, pass: string): boolean {
    return true;
}

export function verifyJWT(encJWT: string): boolean {
    return true;
}

export function genrateJWT() {

}

export function setAuth(value: boolean): void {
    auth = value;
}

export function isAuth(): boolean {
    return auth ?? !!cfg.AUTH ;
}