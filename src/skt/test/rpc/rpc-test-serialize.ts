import { sktClassMeta } from "../../decorator/meta-data";
import { SktLogger } from "../../logger";
import { SktTestClass } from "../skt-test-class";

export const rpcTestSktSerialize: nkruntime.RpcFunction = (
    ctx,
    logger,
    nk,
    payload
) => {
    const instance = new SktTestClass(nk, new SktLogger(logger));
    const serialized = instance.serialize();
    return JSON.stringify({
        metadata: sktClassMeta,
        serialized
    });
}