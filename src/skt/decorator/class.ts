import { sktClassMeta } from "./meta-data";
import { SktSerializable } from "../serializable";
import { ClassConstructor } from "./class-constructor";

export interface SktClassOptions {
    extend?: ClassConstructor<SktSerializable>
}

export function SktClass(options: SktClassOptions = {}): ClassDecorator {
    return function <T extends Function>(target: T) {
        const name = target.name;
        if (!sktClassMeta[name]) {
            sktClassMeta[name] = {
                properties: []
            };
        }
        sktClassMeta[name].type = target as any;
        sktClassMeta[name].extends = options.extend;
    }
}