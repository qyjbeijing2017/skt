import { SktClass } from "../decorator/class";
import { SktProperty } from "../decorator/property";
import { SktLogger } from "../logger";
import { SktSerializable } from "../serializable";
import type { SktTestClass } from "./skt-test-class";

@SktClass()
export class SktTestSubClass extends SktSerializable {
    @SktProperty()
    public testString: string = "test";
    @SktProperty()
    public testNumber: number = 1;
    @SktProperty()
    public testBoolean: boolean = true;
    @SktProperty()
    public testArray: number[] = [1, 2, 3];
    @SktProperty()
    public testObject: any = { test: "test" };
    @SktProperty({ type: "SktTestClass" })
    public parent: SktTestClass;

    constructor(nk: nkruntime.Nakama, logger: SktLogger, userId: string | undefined, parent: SktTestClass) {
        super(nk, logger, userId);
        this.parent = parent;
    }
}