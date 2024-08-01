import { SktClass } from "./decorator/class";
import { sktGetClass } from "./decorator/meta-data";
import { SktSerialized, SktSerializedObject } from "./interface/serialized.interface";
import { DeserializeCtx, SktSerializable } from "./serializable";

export interface SktMapSerialized extends SktSerialized {
    [key: string | number]: {
        typeName: string,
        sktId: string
    }
}

@SktClass()
export class SktMap<K extends string | number, V extends SktSerializable> extends SktSerializable {
    protected readonly map: Map<K, V> = new Map();

    readonly set: (key: K, value: V) => void = this.map.set.bind(this.map);
    readonly get: (key: K) => V | undefined = this.map.get.bind(this.map);
    readonly delete: (key: K) => boolean = this.map.delete.bind(this.map);
    readonly clear: () => void = this.map.clear.bind(this.map);
    readonly forEach: (callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any) => void = this.map.forEach.bind(this.map);
    readonly keys: () => IterableIterator<K> = this.map.keys.bind(this.map);
    readonly values: () => IterableIterator<V> = this.map.values.bind(this.map);
    get size(): number {
        return this.map.size;
    }


    serialize(ctx?: SktSerializedObject): SktSerializedObject {
        if(ctx.objects[this.sktId]) {
            return ctx;
        }
        const serialized: SktMapSerialized = {};
        ctx.objects[this.sktId]= serialized

        this.map.forEach((value, key) => {
            value.serialize(ctx);
            serialized[key] = {
                typeName: value.constructor.name,
                sktId: value.sktId
            }
        });
        return ctx;
    }

    deserialize(input: SktSerializedObject, ctx: DeserializeCtx = {}): this {
        if(ctx[input.sktId]) {
            return ctx[input.sktId] as this;
        }
        this._sktId = input.sktId;
        ctx[this.sktId] = this;

        const serialized = input.objects[this.sktId] as SktMapSerialized;

        const keys = Object.keys(serialized) as K[];

        keys.forEach((key) => {
            const value = serialized[key];
            const classMeta = sktGetClass(value.typeName);
            const instance = new classMeta.type(this.nk, this.logger);
            instance.deserialize(input, ctx);
            this.map.set(key, instance as V);
        });

        return this;
    }
}