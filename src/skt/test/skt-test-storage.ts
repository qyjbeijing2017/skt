import { SktClass } from "../decorator/class";
import { SktProperty } from "../decorator/property";
import { SktStorageProperty } from "../decorator/storage-property";
import { SktReadPermission, SktWritePermission } from "../interface/permission";
import { SktLogger } from "../logger";
import { SktStorageObject } from "../storage-object";
import { SktTestClass } from "./skt-test-class";
import { SktTestSubStorage } from "./skt-test-sub-storage";


@SktClass()
export class SktTestStorage extends SktStorageObject {
    protected readPermission: SktReadPermission = SktReadPermission.PUBLIC_READ;
    protected writePermission: SktWritePermission = SktWritePermission.OWNER_WRITE;

    @SktStorageProperty()
    testStr: string;

    @SktStorageProperty()
    testNumber: number;

    @SktStorageProperty({ type: SktTestSubStorage })
    testSub: SktTestSubStorage;

    @SktStorageProperty({ type: SktTestClass })
    testSktObject: SktTestClass;

    constructor(
        nk: nkruntime.Nakama,
        logger: SktLogger,
        userId?: string,
    ) {
        super(nk, logger, 'skt_test', 'test', userId);
    }
}