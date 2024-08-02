import { SktStorageTarget } from "./decorator/storage.property";
import { SktClassConstructor } from "./utils/class-constructor";

export interface SktPropertyMeta {
    type?: string;
    storageTarget?: SktStorageTarget;
}

export interface SktClassMeta {
    name: string;
    classConstructor?: SktClassConstructor<any>;
    properties: Map<string, SktPropertyMeta>;
}

export class SktMeta {
    static readonly meta: Map<string, SktClassMeta> = new Map<string, SktClassMeta>();

    static getClassMeta<T>(classConstructor: SktClassConstructor<T>): SktClassMeta | null {
        const className = classConstructor.name;
        return SktMeta.meta.get(className) || null;
    }

    static getPropertyMeta<T>(classConstructor: SktClassConstructor<T>, propertyName: string): SktPropertyMeta | null {
        const classMeta = SktMeta.getClassMeta(classConstructor);
        return classMeta?.properties.get(propertyName) || null;
    }
}