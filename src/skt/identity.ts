import { ClassConstructor } from "./decorator/class-constructor";
import { SktLogger } from "./logger";
import { SktSerializable } from "./serializable";

export abstract class SktIdentity extends SktSerializable {
    static readonly sktIdentities: { [sktId: string]: SktIdentity } = {};
    constructor(
        nk: nkruntime.Nakama,
        logger: SktLogger,
        sktId: string,
    ) {
        super(nk, logger, sktId);
        if(SktIdentity.sktIdentities[this.sktId]) {
            return SktIdentity.sktIdentities[this.sktId];
        }
        SktIdentity.sktIdentities[this.sktId] = this;
    }

    static hasIdentity(sktId: string): boolean {
        return SktIdentity.sktIdentities[sktId] !== undefined;
    }

    static getIdentity(sktId: string): SktIdentity | undefined {
        return SktIdentity.sktIdentities[sktId];
    }

    static findIdentityById(sktId: string): SktIdentity | undefined {
        return SktIdentity.sktIdentities[sktId];
    }

    static findIdentityByType<T extends SktIdentity>(type: ClassConstructor<T>): T | undefined {
        for(const sktId in SktIdentity.sktIdentities) {
            const identity = SktIdentity.sktIdentities[sktId];
            if(identity instanceof type) {
                return identity as T;
            }
        }
        return undefined;
    }

    static findIdentitiesByType<T extends SktIdentity>(type: ClassConstructor<T>): T[] {
        const identities: T[] = [];
        for(const sktId in SktIdentity.sktIdentities) {
            const identity = SktIdentity.sktIdentities[sktId];
            if(identity instanceof type) {
                identities.push(identity as T);
            }
        }
        return identities;
    }
}