import { SktSerialized } from "./interface/serialized.interface";
import { SktLogger } from "./logger";
import { SktDeserializeOptions, SktSerializable } from "./serializable";

export abstract class SktIdentity extends SktSerializable {
    static readonly identities: Map<string, SktIdentity> = new Map<string, SktIdentity>();
    constructor(
        readonly nk: nkruntime.Nakama,
        readonly logger: SktLogger,
        sktId: string
    ) {
        super(nk, logger, sktId);
        if(SktIdentity.identities.has(sktId)) {
            return SktIdentity.identities.get(sktId) as SktIdentity;
        }
        SktIdentity.identities.set(sktId, this);
    }

    deserialize(ctx: SktSerialized, options?: SktDeserializeOptions, deserialized?: Map<string, SktSerializable>): this {
        if(deserialized.has(ctx.sktId)) {
            return deserialized.get(ctx.sktId).deserialize(ctx, options, deserialized) as this;
        }
        return super.deserialize(ctx, options, deserialized);
    }
}