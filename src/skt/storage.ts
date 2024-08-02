import { SktStorageTarget } from "./decorator/storage.property";
import { SktIdentity } from "./identity";
import { SktSerialized, SktSerializedObject } from "./interface/serialized.interface";
import { SktLogger } from "./logger";
import { SktMeta } from "./meta";
import { SktDeserializeOptions, SktSerializable, SktSerializeOptions } from "./serializable";
import { sktServerId } from "./utils/server-id";

export interface SktSerializeStorageOptions extends SktSerializeOptions {
    target: SktStorageTarget;
    storageDepth: number;
}

export interface SktDeserializeStorageOptions extends SktDeserializeOptions {
    from: SktStorageTarget;
}


export abstract class SktStorage extends SktIdentity {
    private _userId?: string;
    get userId(): string {
        return this._userId ?? sktServerId;
    }

    constructor(
        readonly nk: nkruntime.Nakama,
        readonly logger: SktLogger,
        readonly collection: string,
        readonly key: string,
        userId?: string
    ) {
        super(nk, logger, `${userId}:${collection}:${key}`);
        this._userId = userId;
    }

    
    serialize(options: SktSerializeStorageOptions = {
        target: SktStorageTarget.MEMORY,
        storageDepth: 0
    }, ctx: SktSerialized = {
        sktId: this.sktId,
        object: {}
    }): SktSerialized {
        if(ctx.object[this.sktId]) {
            return ctx;
        }

        const serializedObject: SktSerializedObject = {}
        ctx.object[this.sktId] = serializedObject;

        const classMeta = SktMeta.getClassMeta(this.constructor as any);
        if(!classMeta) {
            throw new Error(`Class meta not found for ${this.constructor.name}`);
        }

        if(options.storageDepth > 0 && options.target === SktStorageTarget.STORAGE) {
            return ctx;
        }

        options.storageDepth++;

        classMeta.properties.forEach((propertyMeta, propertyName) => {
            if(propertyMeta.storageTarget & options.target) {
                let value = (this as any)[propertyName];
                if(propertyMeta.type) {
                    if(Array.isArray(value)) {
                        serializedObject[propertyName] = (value as SktSerializable[]).map((v) => {
                            return v.serialize(options, ctx).sktId;
                        });
                    }  else {
                        serializedObject[propertyName] = (value as SktSerializable).serialize(options, ctx).sktId;
                    }

                } else {
                    serializedObject[propertyName] = value;
                }
            }
        });

        return ctx
    }
}