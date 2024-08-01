import { SktClass } from "../decorator/class";
import { SktProperty } from "../decorator/property";
import { SktReadPermission, SktWritePermission } from "../interface/permission";
import { SktLogger } from "../logger";
import { SktStorage } from "../storage";

@SktClass()
export class SktTestSubStorage extends SktStorage {

    protected readPermission: SktReadPermission = SktReadPermission.PUBLIC_READ;
    protected writePermission: SktWritePermission = SktWritePermission.OWNER_WRITE;

    @SktProperty()
    testStr: string = 'testSubStr';


    constructor(
        nk: nkruntime.Nakama,
        logger: SktLogger,
        userId?: string,
    ) {
        super(nk, logger, 'skt_test', 'sub_test', userId);
    }
}