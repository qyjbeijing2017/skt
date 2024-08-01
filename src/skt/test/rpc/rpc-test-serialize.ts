import { sktClassMeta } from "../../decorator/meta-data";
import { SktLogger } from "../../logger";
import { SktTestClass } from "../skt-test-class";
import { SktTestSubClass } from "../skt-test-sub-class";

export const rpcTestSktSerialize: nkruntime.RpcFunction = (
    ctx,
    logger,
    nk,
    payload
) => {
    const instance = new SktTestClass(nk, new SktLogger(logger));
    instance.testMap.set("test", new SktTestSubClass(nk, new SktLogger(logger), instance));
    instance.testMap.set("test2", new SktTestSubClass(nk, new SktLogger(logger), instance));
    const serialized = instance.serialize();
    return JSON.stringify({
        metadata: sktClassMeta,
        serialized
    });
}