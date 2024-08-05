import { SktClass, SktProperty, SktSerializable } from "../serializable";
import { TestSktSubSerializable } from "./test-sub-serializable";

@SktClass()
export class TestSktSerializable extends SktSerializable {
    @SktProperty()
    testStr: string = "testStr";
    @SktProperty()
    testNum: number = 123;
    @SktProperty()
    testBool: boolean = true;
    @SktProperty()
    testObj: object = { test: "test" };
    @SktProperty()
    testNull: null = null;
    @SktProperty()
    testUndefined: undefined = undefined;
    @SktProperty()
    testArr: string[] = ["test1", "test2"];
    @SktProperty({ type: TestSktSubSerializable })
    testSub: TestSktSubSerializable = new TestSktSubSerializable(this.nk, this.logger, this);
    @SktProperty({ type: TestSktSubSerializable })
    testSubArr: TestSktSubSerializable[] = [
        new TestSktSubSerializable(this.nk, this.logger, this), 
        new TestSktSubSerializable(this.nk, this.logger, this)
    ];
}