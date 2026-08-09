export default class Logger {
    env; // 0 -> Dev , 1 -> Prod
    constructor(env) {
        this.env = env;
    }
    log = (s) => this.env === 0 ? console.log("[LOG] : ", s) : null;
    prod = (s) => console.log(s);
}
//# sourceMappingURL=Logger.mjs.map