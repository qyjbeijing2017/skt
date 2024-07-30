import { getProperties } from "./decorator/meta-data";
import { SktProperty } from "./decorator/property";
import { SktReadPermission, SktWritePermission } from "./interface/permission";
import { SktLogger } from "./logger";
import { SktSerializable } from "./serializable";

export enum SktStorageObjectState {
    NEW = 0,
    READ = 1,
    CHANGED = 2,
}

export abstract class SktStorageObject extends SktSerializable {
    abstract get collection(): string;
    abstract get key(): string;
    protected readPermission: SktReadPermission = SktReadPermission.OWNER_READ;
    protected writePermission: SktWritePermission = SktWritePermission.OWNER_WRITE;
    @SktProperty()
    protected ownerId?: string;
    @SktProperty()
    private _version?: string;
    get version(): string | undefined {
        return this._version;
    }

    @SktProperty()
    public state: SktStorageObjectState = SktStorageObjectState.NEW;

    constructor(
        nk: nkruntime.Nakama,
        logger: SktLogger,
    ) {
        super(nk, logger);
    }

    private get object(): any {
        const properties = getProperties(this.read.classConstructor)

        return this;
    }

    private set object(value: any) {
    }

    get read(): this {
        const properties = getProperties(this.read.classConstructor)
        properties.filter(p => p instanceof SktStorageObject).forEach(p => {
            this.logger.debug(`Reading property ${p.key} from storage object ${this.key}`);
        });
        return this;
    }

    private get readRequest(): nkruntime.StorageReadRequest {
        return {
            collection: this.collection,
            key: this.key,
            userId: this.ownerId
        };
    }

    private get writeRequest(): nkruntime.StorageWriteRequest {
        return {
            collection: this.collection,
            key: this.key,
            permissionRead: this.readPermission,
            permissionWrite: this.writePermission,
            userId: this.ownerId,
            value: this.object,
        }
    }

    save(): void {

    }


}