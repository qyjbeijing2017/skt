import { SktMeta } from "../meta";
import { SktStorage } from "../storage";
import { SktProperty, SktPropertyOptions } from "./property";

export enum SktStorageTarget {
    MEMORY = 1,
    STORAGE = 1 << 1,
}

export interface SktStoragePropertyOptions extends SktPropertyOptions {
    storage?: SktStorageTarget;
}

export function SktStorageProperty(options: SktStoragePropertyOptions = {}): PropertyDecorator {
    return function (target: SktStorage, propertyKey: string) {
        SktProperty(options)(target, propertyKey);
        const name = target.constructor.name;
        const classMeta = SktMeta.meta.get(name)!;
        const propertyMeta = classMeta.properties.get(propertyKey)!;
        propertyMeta.storageTarget = options.storage ?? SktStorageTarget.MEMORY | SktStorageTarget.STORAGE;
    }
}