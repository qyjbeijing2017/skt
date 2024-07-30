import { SktClass } from "../decorator/class";
import { SktStorageProperty } from "../decorator/storage-property";
import { SktReadPermission, SktWritePermission } from "../interface/permission";
import { SktStorageObject } from "../storage-object";

@SktClass()
export class SktTestSubStorage extends SktStorageObject {
    get collection(): string {
        return 'skt_test';
    }
    get key(): string {
        return 'test';
    }

    protected readPermission: SktReadPermission = SktReadPermission.PUBLIC_READ;
    protected writePermission: SktWritePermission = SktWritePermission.OWNER_WRITE;

    @SktStorageProperty()
    testStr: string = 'sub-Storage';
}