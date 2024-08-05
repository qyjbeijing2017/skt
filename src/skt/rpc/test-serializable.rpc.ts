import { SktLogger } from "../logger";
import { TestSktSerializable } from "../test-class/test-serializable"


export const rpcTestSktSerialize: nkruntime.RpcFunction = (
    ctx,
    logger,
    nk,
    payload
) => {
    const instance = new TestSktSerializable(nk, new SktLogger(logger));
    const serialized = instance.serialize();
    const instance2 = new TestSktSerializable(nk, new SktLogger(logger));
    instance2.deserialize(serialized);
    const serialized2 = instance2.serialize();
    return JSON.stringify({
        serialized,
        serialized2
    });
}