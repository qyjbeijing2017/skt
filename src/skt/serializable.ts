import { ClassConstructor } from "./decorator/class-constructor";
import { ISktPropertyMetaInfo, sktGetProperties } from "./decorator/meta-data";
import { SktId, SktSerialized, SktSerializedObject } from "./interface/serialized.interface";
import { SktLogger } from "./logger";
import { createStringSktId } from "./utils/id";

export interface DeserializeCtx {
    [key: string]: SktSerializable;
}

export abstract class SktSerializable {
    protected _sktId: SktId = createStringSktId();
    get sktId(): SktId {
        return this._sktId;
    }

    get classConstructor(): ClassConstructor<SktSerializable> {
        return this.constructor as ClassConstructor<SktSerializable>;
    }

    get propertiesMetaInfo(): ISktPropertyMetaInfo[] {
        return sktGetProperties(this.classConstructor);
    }

    get classMetaInfo(): ISktPropertyMetaInfo {
        return sktGetProperties(this.classConstructor)[0];
    }

    constructor(
        readonly nk: nkruntime.Nakama,
        readonly logger: SktLogger,
        sktId: SktId = createStringSktId()
    ) {
        this._sktId = sktId;
    }

    private replaceProperties(input: SktSerializedObject, origin: SktSerializable, property:ISktPropertyMetaInfo,  ctx: DeserializeCtx): SktSerializable {
        if(ctx[input.sktId]) {
            return ctx[input.sktId];
        }
        const instance = !origin || ctx[origin.sktId] ? new property.type(this.nk, this.logger) : origin;
        return instance.deserialize(input, ctx);
    }

    deserialize(input: SktSerializedObject, ctx: DeserializeCtx = {}): this {
        if(ctx[input.sktId]) {
            return ctx[input.sktId] as this;
        }

        this._sktId = input.sktId;
        ctx[this.sktId] = this;

        const properties = sktGetProperties(this.classConstructor);
        const serialized = input.objects[this.sktId];
        properties.forEach((property) => {
            let value = serialized[property.key];
            if(property.type) {
                if(Array.isArray(value)) {
                    this[property.key] = (value as SktId[]).map((v, index) => {
                       if(!v) {
                           return v as null | undefined;
                       }
                       input.sktId = v;
                       return this.replaceProperties(input, this[property.key][index], property, ctx);
                    });
                } else {
                    if(!value) {
                        this[property.key] = value;
                    } else {
                        input.sktId = (value as SktId);
                        this[property.key] = this.replaceProperties(input, this[property.key], property, ctx);
                    }
                }
            } else {
                this[property.key] = value;
            }
        });

        return this;
    }

    serialize(ctx: SktSerializedObject = {
        sktId: this.sktId,
        objects: {}
    }): SktSerializedObject {
        if(ctx.objects[this.sktId]) {
            return ctx;
        }
        const properties = sktGetProperties(this.classConstructor);
        const serialized: SktSerialized = {};
        ctx.objects[this.sktId] = serialized;

        properties.forEach((property) => {
            if(property.type) {
                if(Array.isArray(this[property.key])) {
                    serialized[property.key] = (this[property.key] as (SktSerializable)[]).map((v) => {
                        if(!v) {
                            return v as null | undefined;
                        }
                        v.serialize(ctx);
                        return v.sktId;
                    });
                } else {
                    if(!this[property.key]) {
                        serialized[property.key] = this[property.key];
                    } else {
                        this[property.key].serialize(ctx);
                        serialized[property.key] = this[property.key].sktId;
                    }
                }
            } else {
                serialized[property.key] = this[property.key];
            }
        });

        return ctx;
    }
}