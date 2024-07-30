import { SktSerializable } from "../serializable";
import { ClassConstructor } from "./class-constructor";
import { sktClassMeta } from "./meta-data";

export interface SktPropertyOptions {
    type?: string | ClassConstructor<SktSerializable>
}


export function SktProperty(options: SktPropertyOptions = {}): PropertyDecorator {
    return function (target: Object, propertyKey: string) {
        const name = target.constructor.name;
        if(!sktClassMeta[name]) {
            sktClassMeta[name] = {
                properties: []
            }
        }
        sktClassMeta[name].properties.push({
            key: propertyKey,
            typeName: options.type ? (typeof options.type === 'string' ? options.type : options.type.name) : undefined
        });

        // let value: any;
        // Object.defineProperty(target, propertyKey, {
        //     get: function () {
        //         return value;
        //     },
        //     set: function (next: any) {
        //         if(next === value) {
        //             return;
        //         }
        //         if(this.state === SktStorageObjectState.NEW) {
        //             throw new Error(`Storage object ${this.sktId} is not initialized, call update() first`);
        //         }
        //         this.state = SktStorageObjectState.CHANGED;
        //         value = next;
        //     },
        //     enumerable: true,
        //     configurable: false,
        // });
    }
}