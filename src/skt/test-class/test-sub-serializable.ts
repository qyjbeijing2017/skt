import { SktLogger } from "../logger";
import { SktClass, SktProperty, SktSerializable } from "../serializable";
import type { TestSktSerializable } from "./test-serializable";

@SktClass()
export class TestSktSubSerializable extends SktSerializable {
    @SktProperty({ type: 'TestSktSerializable' })
    parent: TestSktSerializable;

    @SktProperty()
    testStr: string = "testSubStr";

    constructor(
        nk: nkruntime.Nakama,
        logger: SktLogger,
        parent: TestSktSerializable
    ) {
        super(nk, logger);
        this.parent = parent;
    }
}