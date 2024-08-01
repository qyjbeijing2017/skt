import { sktGetProperties } from "./decorator/meta-data";
import { isParent } from "./decorator/type-instance-of";
import { SktIdentity } from "./identity";
import { SktReadPermission, SktWritePermission } from "./interface/permission";
import { SktSerializedObject } from "./interface/serialized.interface";
import { SktStorageObjectState } from "./interface/storage.interface";
import { SktLogger } from "./logger";
import { gmID } from "./user";
import { DeserializeCtx, SktSerializable } from "./serializable";


export abstract class SktStorage extends SktIdentity {
    protected readPermission: SktReadPermission = SktReadPermission.OWNER_READ;
    protected writePermission: SktWritePermission = SktWritePermission.OWNER_WRITE;
    private _version?: string;
    private _ctx: DeserializeCtx;

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


    get storageObjects(): SktStorage[] {
        const properties = sktGetProperties(this.classConstructor)
        return properties.filter((property) => {
            return this[property.key] instanceof SktStorage;
        }).map((property) => {
            return this[property.key];
        }).concat(this);
    }

    update(): this {
        const [storageObject] = this.nk.storageRead([this.readRequest]);
        if(!storageObject) {
            this._state = SktStorageObjectState.READ;
            return this;
        }
        // must set state to read before deserializing, otherwise it will throw an state error
        this._state = SktStorageObjectState.READ;
        super.deserialize({
            sktId: this.sktId,
            objects: {
                [this.sktId]: storageObject.value
            }
        }, this._ctx);
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
            value: super.serialize().objects[this.sktId],
        }
    }

    save(): void {
        const objects = this.storageObjects.filter((object) => {
            return object._state === SktStorageObjectState.CHANGED;
        });

        if(objects.length === 0) {
            return;
        }

        const writeRequests = objects.map((object) => {
            this.logger.info(`Saving ${object.sktId}, checking state ${object._state}`);
            return object.writeRequest;
        });

        const writeResults = this.nk.storageWrite(writeRequests);

        objects.forEach((object, index) => {
            object._version = writeResults[index].version;
            object._state = SktStorageObjectState.READ;
        });
    }

    destroy(): void {
        this.nk.storageDelete([this.readRequest]);
        this._state = SktStorageObjectState.NEW;
    }

    private checkTree(): void {
        const properties = sktGetProperties(this.classConstructor)
        properties.forEach((property) => {
            if(!isParent(property.type, SktStorage) && isParent(property.type, SktSerializable)) {
                throw new Error(`Property ${property.key} is not a SktStorageObject`);
            }
        });
    }

    serialize(ctx: SktSerializedObject = {
        sktId: this.sktId,
        objects: {}
    }): SktSerializedObject {
        this.checkTree();
        this.save();
        return ctx;
    }

    deserialize(input: SktSerializedObject, ctx: DeserializeCtx  = {}): this {
        if(SktIdentity.hasIdentity(input.sktId)) {
            return SktStorage.getIdentity(input.sktId) as this;
        }
        if(input.sktId !== this.sktId) {
            throw new Error(`Invalid sktId ${input.sktId} for ${this.sktId}`);
        }
        this.checkTree();
        this._ctx = ctx;
        this._state = SktStorageObjectState.NEW;
        return this;
    }
}