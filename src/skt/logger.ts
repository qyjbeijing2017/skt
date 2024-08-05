export class SktLogger {
    constructor(
        readonly nakamaLogger: nkruntime.Logger
    ) {
    }

    private join(args: any[]): string {
        return args.map(arg => {
            if (typeof arg === 'object') {
                return JSON.stringify(arg);
            }
            return arg;
        }).join(' ');
    }

    debug(...args: any[]) {
        this.nakamaLogger.debug(this.join(args));
    }

    info(...args: any[]) {
        this.nakamaLogger.info(this.join(args));
    }

    warn(...args: any[]) {
        this.nakamaLogger.warn(this.join(args));
    }

    error(...args: any[]) {
        this.nakamaLogger.error(this.join(args));
    }
}