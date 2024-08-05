const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

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
    static randomId(): string {
        let result = '';
        for (let i = 0; i < 4; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    static getMeta(name: string | SktSerializableConstructor): SktClassMeta | undefined {
        return SktSerializable.meta.get(typeof name === 'string' ? name : name.name);
    }

    get meta(): SktClassMeta | undefined {
        return SktSerializable.getMeta(this.constructor as SktSerializableConstructor);
    }

    constructor(
        readonly nk: nkruntime.Nakama,
        readonly logger: nkruntime.Logger,
        readonly sktId: string = SktSerializable.randomId()
    ) {}

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
                        const sktSerializable = new type.constructor(this.nk, this.logger, value);
                        return sktSerializable.deserialize(serialized, context);
                    });
                } else {
                    if(!object[propertyKey]) {
                        this[propertyKey] = null;
                    } else {
                        const type = SktSerializable.getMeta(propertyMeta.typeName);
                        const sktSerializable = new type.constructor(this.nk, this.logger, object[propertyKey] as string);
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