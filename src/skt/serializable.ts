import { SktLogger } from "./logger";

export type SktClassConstructor<T> = new (...args: any[]) => T;
export type SktSerializableConstructor = SktClassConstructor<SktSerializable>;

export interface SktPropertyMeta {
    typeName?: string;
}

export interface SktClassMeta {
    constructor: SktSerializableConstructor;
    properties: Map<string, SktPropertyMeta>;
}

export interface SktClassOptions {
}

export function SktClass(options: SktClassOptions = {}) {
    return (target: SktSerializableConstructor) => {
        if (!SktSerializable.meta.has(target.name)) {
            SktSerializable.meta.set(target.name, {
                constructor: target,
                properties: new Map<string, SktPropertyMeta>()
            });
        }
    };
}

export interface SktPropertyOptions {
    type?: SktSerializableConstructor | string;
}

export function SktProperty(options: SktPropertyOptions = {}) {
    return (target: SktSerializable, propertyKey: string) => {
        if (!SktSerializable.meta.has(target.constructor.name)) {
            SktSerializable.meta.set(target.constructor.name, {
                constructor: target.constructor as SktSerializableConstructor,
                properties: new Map<string, SktPropertyMeta>()
            });
        }
        const classMeta = SktSerializable.getMeta(target.constructor as SktSerializableConstructor);
        classMeta.properties.set(propertyKey, {
            typeName: options.type ? (typeof options.type === 'string' ? options.type : options.type.name) : undefined
        });
    };
}

export type SktSktSerializableType = string | number | boolean | object | null | undefined

export interface SktSerializedObject {
    [key: string]: SktSktSerializableType | SktSktSerializableType[]
}

export interface SktSerialized {
    sktId: string;
    objects: {
        [key: string]: SktSerializedObject
    }
}

export abstract class SktSerializable {
    static readonly meta: Map<string, SktClassMeta> = new Map<string, SktClassMeta>();

    static getMeta(name: string | SktSerializableConstructor): SktClassMeta | undefined {
        return SktSerializable.meta.get(typeof name === 'string' ? name : name.name);
    }

    get meta(): SktClassMeta | undefined {
        return SktSerializable.getMeta(this.constructor as SktSerializableConstructor);
    }

    private _sktId: string;

    get sktId(): string {
        return this._sktId;
    }


    constructor(
        readonly nk: nkruntime.Nakama,
        readonly logger: SktLogger,
        sktId?: string 
    ) {
        logger.debug(`nk is null: ${nk === undefined}`);
        this._sktId = sktId ?? nk.uuidv4();
    }

    serialize(serialized: SktSerialized = {
        sktId: this.sktId,
        objects: {}
    }){
        if(serialized.objects[this.sktId]) return serialized;
        const classMeta = this.meta;
        if(!classMeta) {
            throw new Error(`Class meta not found for ${this.constructor.name}`);
        }
        const object: SktSerializedObject = {};
        serialized.objects[this.sktId] = object;

        classMeta.properties.forEach((propertyMeta, propertyKey) => {
            if(propertyMeta.typeName) {
                if(Array.isArray(this[propertyKey])) {
                    object[propertyKey] = (this[propertyKey] as SktSerializable[]).map((value) => {
                        if(!value) return null;
                        value.serialize(serialized);
                        return value.sktId;
                    });
                } else {
                    if(!this[propertyKey]) {
                        object[propertyKey] = null;
                    } else {
                        (this[propertyKey] as SktSerializable).serialize(serialized);
                        object[propertyKey] = this[propertyKey].sktId;
                    }
                }

            } else {
                const value = (this as any)[propertyKey];
                object[propertyKey] = value;
            }


        });
        return serialized;
    }

    deserialize(serialized: SktSerialized, context: Map<string, SktSerializable> = new Map()): this {
        if(context.has(serialized.sktId)) return context.get(serialized.sktId) as this;
        this._sktId = serialized.sktId;
        const object = serialized.objects[this.sktId];
        if(!object)  {
            throw new Error(`Object not found for ${this.sktId}`);
        }
        context.set(this.sktId, this);
        const classMeta = this.meta;
        if(!classMeta) {
            throw new Error(`Class meta not found for ${this.constructor.name}`);
        }
        classMeta.properties.forEach((propertyMeta, propertyKey) => {
            if(!propertyMeta) {
                throw new Error(`Property meta not found for ${propertyKey}`);
            }
            if(propertyMeta.typeName) {
                if(Array.isArray(object[propertyKey])) {
                    this[propertyKey] = (object[propertyKey] as string[]).map((value) => {
                        if(!value) return null;
                        const type = SktSerializable.getMeta(propertyMeta.typeName);
                        const sktSerializable = new type.constructor(this.nk, this.logger);
                        serialized.sktId = value;
                        return sktSerializable.deserialize(serialized, context);
                    });
                } else {
                    if(!object[propertyKey]) {
                        this[propertyKey] = null;
                    } else {
                        const type = SktSerializable.getMeta(propertyMeta.typeName);
                        const sktSerializable = new type.constructor(this.nk, this.logger);
                        serialized.sktId = object[propertyKey] as string;
                        this[propertyKey] = sktSerializable.deserialize(serialized, context);;
                    }
                }
            } else {
                this[propertyKey] = object[propertyKey];
            }
        });
        return this;
    }
}