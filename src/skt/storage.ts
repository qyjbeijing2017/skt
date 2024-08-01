import { SktIdentity } from "./identity";
import { SktReadPermission, SktWritePermission } from "./interface/permission";
import { SktSerializedObject } from "./interface/serialized.interface";
import { SktStorageObjectState } from "./interface/storage.interface";
import { SktLogger } from "./logger";
import { gmID } from "./user";
import { DeserializeCtx, SktSerializable } from "./serializable";
import { isParent } from "./decorator/type-instance-of";


export class SktStorage extends SktIdentity {
    protected readPermission: SktReadPermission = SktReadPermission.OWNER_READ;
    protected writePermission: SktWritePermission = SktWritePermission.OWNER_WRITE;
    private _version?: string;

    get version(): string | undefined {
        return this._version;
    }
    private _state: SktStorageObjectState = SktStorageObjectState.NEW;
    get state(): SktStorageObjectState {
        return this._state;
    }

    constructor(
        nk: nkruntime.Nakama,
        logger: SktLogger,
        readonly collection: string,
        readonly key: string,
        readonly userId: string = gmID,
    ) {
        super(nk, logger, `${userId}:${collection}:${key}`);
    }

    update(): this {
        const [storageObject] = this.nk.storageRead([this.readRequest]);
        if(!storageObject) {
            this._state = SktStorageObjectState.READ;
            return this;
        }
        this.propertiesMetaInfo.forEach(metaInfo => {
            this[metaInfo.key] = storageObject.value[metaInfo.key];
        });
        this._version = storageObject.version;
        this._state = SktStorageObjectState.READ;
        return this;
    }

    private get readRequest(): nkruntime.StorageReadRequest {
        return {
            collection: this.collection,
            key: this.key,
            userId: this.userId
        };
    }

    private get writeRequest(): nkruntime.StorageWriteRequest {
        return {
            collection: this.collection,
            key: this.key,
            permissionRead: this.readPermission,
            permissionWrite: this.writePermission,
            userId: this.userId,
            value: this.serialize(),
        }
    }

    save(): void {
        this.logger.debug('save', this._state);
        if(this._state !== SktStorageObjectState.CHANGED) {
            return;
        }
        const writeResults = this.nk.storageWrite([this.writeRequest]);
        this._version = writeResults[0].version;
        this._state = SktStorageObjectState.READ;
    }

    static save(...storages: SktStorage[]): void {
        if(storages.length === 0) {
            storages = SktStorage.findIdentitiesByType(SktStorage);
            if(storages.length === 0) {
                return;
            }
        }
        storages = storages.filter(storage => storage.state === SktStorageObjectState.CHANGED);
        if(storages.length === 0)  {
            return;
        }
        const writeRequests = storages.map(storage => storage.writeRequest);
        const writeResults = storages[0].nk.storageWrite(writeRequests);
        storages.forEach((storage, index) => {
            storage._version = writeResults[index].version;
            storage._state = SktStorageObjectState.READ;
        });
    }

    destroy(): void {
        this.nk.storageDelete([this.readRequest]);
        this._state = SktStorageObjectState.NEW;
    }

    serialize(ctx?: SktSerializedObject): SktSerializedObject {
        ctx = super.serialize(ctx);
        ctx.objects[this.sktId].state = this._state;
        return ctx;
    }

    deserialize(input: SktSerializedObject, ctx?: DeserializeCtx): this {
        super.deserialize(input, ctx);
        this._state = ctx.objects[this.sktId].state;
        return this;
    }
}