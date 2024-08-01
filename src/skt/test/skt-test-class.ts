import { SktClass } from "../decorator/class";
import { SktProperty } from "../decorator/property";
import { SktMap } from "../map";
import { SktTestBaseClass } from "./skt-test-base-class";
import { SktTestSubClass } from "./skt-test-sub-class";

@SktClass()
export class SktTestClass extends SktTestBaseClass {
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
    @SktProperty({ type: SktTestSubClass })
    public testSubClass: SktTestSubClass = new SktTestSubClass(this.nk, this.logger, this);
    @SktProperty({ type: SktTestSubClass })
    public testSubClassArray: SktTestSubClass[] = [
        new SktTestSubClass(this.nk, this.logger, this),
        new SktTestSubClass(this.nk, this.logger, this),
    ];

    @SktProperty({ type: SktMap })
    public testMap: SktMap<string, SktTestSubClass> = new SktMap<string, SktTestSubClass>(this.nk, this.logger);
}