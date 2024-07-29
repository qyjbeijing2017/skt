import { sktTestMatch } from "./skt/test/match/match-init";
import { rpcTestSktDeserialize } from "./skt/test/rpc/rpc-test-deserialize";
import { rpcTestSktSerialize } from "./skt/test/rpc/rpc-test-serialize";

function InitModule(
    ctx: nkruntime.Context,
    logger: nkruntime.Logger,
    nk: nkruntime.Nakama,
    initializer: nkruntime.Initializer
) {
    try {
        // test skt
        initializer.registerRpc("rpcTestSktSerialize", rpcTestSktSerialize);
        initializer.registerRpc("rpcTestSktDeserialize", rpcTestSktDeserialize);
        initializer.registerMatch("sktTestMatch", sktTestMatch);
    } catch (error) {
        logger.error("Error initializing module", error.message);
    }
}

// Reference InitModule to avoid it getting removed on build
!InitModule && InitModule.bind(null);