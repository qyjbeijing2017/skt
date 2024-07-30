import { sktClassMeta } from "../../decorator/meta-data";
import { SktLogger } from "../../logger";
import { SktTestStorage } from "../skt-test-storage";
import { SktTestSubStorage } from "../skt-test-sub-storage";

export const rpcTestSktStorage: nkruntime.RpcFunction = (
    ctx,
    logger,
    nk,
    payload
) => {
    const instance = new SktTestStorage(nk, new SktLogger(logger), ctx.userId);
    instance.update();
    instance.testStr = 'testStr';
    instance.testSub = new SktTestSubStorage(nk, new SktLogger(logger), ctx.userId);
    instance.testSub.update();
    instance.testSub.testStr = 'testSubStr11111';
    const testSubInstance2 = new SktTestSubStorage(nk, new SktLogger(logger), ctx.userId);
    if(testSubInstance2 !== instance.testSub) {
        throw new Error('should be the same instance');
    }
    
    return JSON.stringify({
        metaData: sktClassMeta,
        instance: instance.serialize()
    });
}