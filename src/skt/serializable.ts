import { SktSerialized, SktSerializedObject } from "./interface/serialized.interface";
import { SktLogger } from "./logger";
import { SktMeta } from "./meta";
import { sktRandomString } from "./utils/random-string";

export interface SktSerializeOptions {
}

export interface SktDeserializeOptions {
}


export abstract class SktSerializable {
    private _sktId: string;
    get sktId(): string {
        return this._sktId;
    }
    constructor(
        readonly nk: nkruntime.Nakama,
        readonly logger: SktLogger,
        sktId: string = sktRandomString(4)
    ) {
        this._sktId = sktId;
    }

    deserialize(ctx: SktSerialized, options: SktDeserializeOptions = {}, deserialized: Map<string, SktSerializable> = new Map<string, SktSerializable>()): this {
        this._sktId = ctx.sktId;
        if(deserialized.has(this.sktId)) {
            return deserialized.get(this.sktId) as this;
        }
        deserialized.set(this.sktId, this);
        const classMeta = SktMeta.getClassMeta(this.constructor as any);
        if(!classMeta) {
            throw new Error(`Class meta not found for ${this.constructor.name}`);
        }
        const serializedObject = ctx.object[this.sktId];
        if(!serializedObject) {
            throw new Error(`Serialized object not found for ${this.sktId}`);
        }
        classMeta.properties.forEach((propertyMeta, propertyName) => {
            if(propertyMeta.type) {
                if(Array.isArray(serializedObject[propertyName])) {
                    this[propertyName] = (serializedObject[propertyName] as string[]).map((v, index) => {
                        if(!deserialized.has(v)) {
                            const instance = new (propertyMeta.type as any)(this.nk, this.logger);
                            deserialized.set(v, instance.deserialize(ctx, deserialized));
                        }
                        return deserialized.get(v);
                    });
                } else {
                    if(!deserialized.has(serializedObject[propertyName])) {
                        const instance = new (propertyMeta.type as any)(this.nk, this.logger);
                        deserialized.set(serializedObject[propertyName], instance.deserialize(ctx, deserialized));
                    }
                    this[propertyName] = deserialized.get(serializedObject[propertyName]);
                }
            } else {
                this[propertyName] = serializedObject[propertyName];
            }
        });
        return this;
    }

    serialize(options: SktSerializeOptions = {}, ctx: SktSerialized = {
        sktId: this.sktId,
        object: {}
    }): SktSerialized {
        if(ctx.object[this.sktId]) {
            return ctx;
        }
        const serializedObject: SktSerializedObject = {}
        ctx.object[this.sktId] = serializedObject
        const classMeta = SktMeta.getClassMeta(this.constructor as any);
        if(!classMeta) {
            throw new Error(`Class meta not found for ${this.constructor.name}`);
        }
        classMeta.properties.forEach((propertyMeta, propertyName) => {
            if(propertyMeta.type) {
                if(Array.isArray(this[propertyName])) {
                    serializedObject[propertyName] = (this[propertyName] as SktSerializable[]).map((v) => {
                        v.serialize(ctx)
                        return v.sktId;
                    });
                } else {
                    const v = this[propertyName] as SktSerializable;
                    v.serialize(ctx)
                    serializedObject[propertyName] = v.sktId;
                }
            } else {
                serializedObject[propertyName] = this[propertyName];
            }
        });
        return ctx;
    }
}