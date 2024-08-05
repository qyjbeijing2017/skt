import { SktIdentity } from "./identity";
import { SktLogger } from "./logger";

const gmId = `00000000-0000-0000-0000-000000000000`

export class SktStorage extends SktIdentity {



    constructor(
        nk: nkruntime.Nakama,
        logger: SktLogger,
        readonly collection: string,
        readonly key: string,
        readonly userId: string = gmId,
    ) {
        super(nk, logger, `${userId}:${collection}:${key}`);
    }


}