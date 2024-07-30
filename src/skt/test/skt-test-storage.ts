import { SktClass } from "../decorator/class";
import { SktStorageProperty } from "../decorator/storage-property";
import { SktReadPermission, SktWritePermission } from "../interface/permission";
import { SktLogger } from "../logger";
import { SktStorageObject } from "../storage-object";
import { SktTestSubStorage } from "./skt-test-sub-storage";


@SktClass()
export class SktTestStorage extends SktStorageObject {
    get collection(): string {
        return 'skt_test';
    }
    get key(): string {
        return 'test';
    }

    protected readPermission: SktReadPermission = SktReadPermission.PUBLIC_READ;
    protected writePermission: SktWritePermission = SktWritePermission.OWNER_WRITE;

    @SktStorageProperty()
    testStr: string;

    @SktStorageProperty()
    testNumber: number;

    @SktStorageProperty({ type: SktTestSubStorage })
    testSub: SktTestSubStorage;

    constructor(
        nk: nkruntime.Nakama,
        logger: SktLogger,
        userId: string,
    ) {
        super(nk, logger);
        this.ownerId = userId;
    }
}