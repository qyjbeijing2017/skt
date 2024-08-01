import { SktSerializable } from "../serializable";
import { SktStorage } from "../storage";
import { SktUserMetadata } from "../user-metadata";
import { ClassConstructor } from "./class-constructor";
import { ISktPropertyMeta, sktClassMeta } from "./meta-data";
import { SktStorageProperty } from "./storage.property";
import { SktUserMetadataProperty } from "./user-metadata.property";

export interface SktPropertyOptions {
    type?: string | ClassConstructor<SktSerializable>
}


export function SktProperty(options: SktPropertyOptions = {}): PropertyDecorator {
    return function (target: Object, propertyKey: string) {
        const name = target.constructor.name;
        if (!sktClassMeta[name]) {
            sktClassMeta[name] = {
                properties: []
            }
        }

        const meta: ISktPropertyMeta = {
            key: propertyKey,
            typeName: options.type ? (typeof options.type === 'string' ? options.type : options.type.name) : undefined
        }

        sktClassMeta[name].properties.push(meta);

        if (target instanceof SktStorage) SktStorageProperty(options)(target, propertyKey);
        if(target instanceof SktUserMetadata) SktUserMetadataProperty(options)(target, propertyKey);
    }
}