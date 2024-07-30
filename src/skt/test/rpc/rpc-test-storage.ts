import { sktClassMeta } from "../../decorator/meta-data";
import { SktLogger } from "../../logger";
import { SktTestStorage } from "../skt-test-storage";

export const rpcTestSktStorage: nkruntime.RpcFunction = (
    ctx,
    logger,
    nk,
    payload
) => {
    const instance = new SktTestStorage(nk, new SktLogger(logger), ctx.userId);
    instance.update();
    
    return JSON.stringify({
        metaData: sktClassMeta,
        instance: instance.serialize()
    });
}