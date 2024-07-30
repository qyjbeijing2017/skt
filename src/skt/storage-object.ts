import { getProperties } from "./decorator/meta-data";
import { SktReadPermission, SktWritePermission } from "./interface/permission";
import { SktSerializedObject } from "./interface/serialized.interface";
import { SktStorageObjectState } from "./interface/storage.interface";
import { SktLogger } from "./logger";
import { DeserializeCtx, SktSerializable } from "./serializable";


export abstract class SktStorageObject extends SktSerializable {


    static readonly sktStorageObjectMap = new Map<string, SktStorageObject>();

    protected readPermission: SktReadPermission = SktReadPermission.OWNER_READ;
    protected writePermission: SktWritePermission = SktWritePermission.OWNER_WRITE;
    private _version?: string;

    get version(): string | undefined {
        return this._version;
    }
    private state: SktStorageObjectState = SktStorageObjectState.NEW;

    constructor(
        nk: nkruntime.Nakama,
        logger: SktLogger,
        readonly collection: string,
        readonly key: string,
        readonly userId: string = '00000000-0000-0000-0000-000000000000',
    ) {
        super(nk, logger, `${userId}:${collection}:${key}`);
        if(SktStorageObject.sktStorageObjectMap.has(this.sktId)) {
            return SktStorageObject.sktStorageObjectMap.get(this.sktId) as this;
        }
        SktStorageObject.sktStorageObjectMap.set(this.sktId, this);
    }


    get storageObjects(): SktStorageObject[] {
        const properties = getProperties(this.classConstructor)
        return properties.filter((property) => {
            return this[property.key] instanceof SktStorageObject;
        }).map((property) => {
            return this[property.key];
        }).concat(this);
    }

    update(): this {
        const [storageObject] = this.nk.storageRead([this.readRequest]);
        if(!storageObject) {
            this.state = SktStorageObjectState.READ;
            return this;
        }
        // must set state to read before deserializing, otherwise it will throw an state error
        this.state = SktStorageObjectState.READ;
        super.deserialize(storageObject.value as SktSerializedObject);
        this._version = storageObject.version;
        this.state = SktStorageObjectState.READ;
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
            value: super.serialize(),
        }
    }

    save(): void {
        const objects = this.storageObjects.filter((object) => {
            return object.state === SktStorageObjectState.CHANGED;
        });

        if(objects.length === 0) {
            return;
        }

        const writeRequests = objects.map((object) => {
            this.logger.info(`Saving ${object.sktId}, checking state ${object.state}`);
            return object.writeRequest;
        });

        const writeResults = this.nk.storageWrite(writeRequests);

        objects.forEach((object, index) => {
            object._version = writeResults[index].version;
            object.state = SktStorageObjectState.READ;
        });
    }

    serialize(ctx: SktSerializedObject = {
        sktId: this.sktId,
        objects: {}
    }): SktSerializedObject {
        if(ctx[this.sktId]) {
            return ctx;
        }
        this.save();
        return ctx;
    }

    deserialize(input: SktSerializedObject, ctx: DeserializeCtx  = {}): this {
        if(SktStorageObject.sktStorageObjectMap.has(input.sktId)) {
            return SktStorageObject.sktStorageObjectMap.get(input.sktId) as this;
        }
        if(input.sktId !== this.sktId) {
            throw new Error(`Invalid sktId ${input.sktId} for ${this.sktId}`);
        }
        this.state = SktStorageObjectState.NEW;
        return this;
    }
}