import { SktLogger } from "./logger";
import { SktSerializable, SktSerialized } from "./serializable";

export class SktIdentity extends SktSerializable {
    static readonly identities: Map<string, SktIdentity> = new Map();
    constructor(
        nk: nkruntime.Nakama,
        logger: SktLogger,
        sktId: string,
    ) {
        super(nk, logger, sktId);
        if(SktIdentity.identities.has(sktId)) {
            return SktIdentity.identities.get(sktId);
        }
        SktIdentity.identities.set(sktId, this);
    }

    findIdentity(sktId: string): SktIdentity {
        return SktIdentity.identities.get(sktId);
    }

    deserialize(serialized: SktSerialized, context?: Map<string, SktSerializable>): this {
        if(context.has(serialized.sktId)) {
            return context.get(serialized.sktId).deserialize(serialized, context) as this;
        }
        return super.deserialize(serialized, context);
    }
}