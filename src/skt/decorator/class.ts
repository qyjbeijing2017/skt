import { sktClassMeta } from "./meta-data";

export interface SktClassOptions {}
export function SktClass(options: SktClassOptions = {}): ClassDecorator {
    return function <T extends Function>(target: T) {
        const name = target.name;
        if (!sktClassMeta[name]) {
            sktClassMeta[name] = {
                properties: []
            };
        }
        sktClassMeta[name].type = target as any;
    }
}