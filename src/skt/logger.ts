export class SktLogger {
    constructor(readonly logger: nkruntime.Logger) {
    }
    private join(messages: any[]): string {
        let result = '';
        messages.forEach((message) => {
            result += message + ' ';
        });
        return result;
    }
    info(...messages: any[]) {
        this.logger.info(this.join(messages));
    }
    debug(...messages: any[]) {
        this.logger.debug(this.join(messages));
    }
    error(...messages: any[]) {
        this.logger.error(this.join(messages));
    }
    warn(...messages: any[]) {
        this.logger.warn(this.join(messages));
    }
}