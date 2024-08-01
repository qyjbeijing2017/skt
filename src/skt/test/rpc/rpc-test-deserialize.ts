import { sktClassMeta } from "../../decorator/meta-data";
import { SktLogger } from "../../logger";
import { SktTestClass } from "../skt-test-class";

export const rpcTestSktDeserialize: nkruntime.RpcFunction = (
    ctx,
    logger,
    nk,
    payload
) => {
    const instance = new SktTestClass(nk, new SktLogger(logger));
    const serializedObject = JSON.parse(payload);
    const deserialized = instance.deserialize(serializedObject);
    const parentEqual = deserialized.testSubClass.parent === deserialized;
    const arrayParentEqual = deserialized.testSubClassArray.map((subClass) => subClass.parent === deserialized);
    deserialized.testSubClass.parent = null;
    deserialized.testSubClassArray.forEach((subClass) => subClass.parent = null);
    deserialized.testMap.forEach((subClass) => subClass.parent = null);
    return JSON.stringify({
        metadata: sktClassMeta,
        parentEqual,
        arrayParentEqual,
        deserialized,
        map: {
            test: deserialized.testMap.get("test"),
            test2: deserialized.testMap.get("test2"),
            test3: deserialized.testMap.get("test3"),
        }
    });
}