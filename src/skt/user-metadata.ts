import { SktIdentity } from "./identity";
import { SktStorageObjectState } from "./interface/storage.interface";
import { SktLogger } from "./logger";

export class SktUserMetadata extends SktIdentity{
    private _state: SktStorageObjectState = SktStorageObjectState.NEW;
    get state(): SktStorageObjectState {
        return this._state;
    }
    constructor(
        nk: nkruntime.Nakama,
        logger: SktLogger,
        readonly userId: string,
    ) {
        super(nk, logger, `metadata:${userId}`);
    }
}