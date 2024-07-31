import { SktSerializable } from "../serializable";
import { SktStorageObject } from "../storage-object";
import { ClassConstructor } from "./class-constructor";
import { sktClassMeta } from "./meta-data";
import { SktStorageProperty, SktStoragePropertyOptions } from "./storage-property";
// import { typeInstanceOf } from "./type-instance-of";

export interface SktPropertyOptions {
    type?: string | ClassConstructor<SktSerializable>
    storage?: SktStoragePropertyOptions
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

        if(target instanceof SktStorageObject) {
            SktStorageProperty(options.storage)(target, propertyKey);
        }
    }
}