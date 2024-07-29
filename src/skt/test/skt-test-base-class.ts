import { SktClass } from "../decorator/class";
import { SktProperty } from "../decorator/property";
import { SktSerializable } from "../serializable";

@SktClass()
export class SktTestBaseClass extends SktSerializable {
    @SktProperty()
    public testBaseString: string = "testBase";
    @SktProperty()
    public testBaseNumber: number = 1;
    @SktProperty()
    public testBaseBoolean: boolean = true;
}