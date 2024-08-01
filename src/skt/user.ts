import { SktClass } from "./decorator/class";
import { ClassConstructor } from "./decorator/class-constructor";
import { SktIdentity } from "./identity";
import { SktSerializedObject } from "./interface/serialized.interface";
import { SktStorageObjectState } from "./interface/storage.interface";
import { SktLogger } from "./logger";
import { SktUserMetadata } from "./user-metadata";

export const gmID = '00000000-0000-0000-0000-000000000000'

@SktClass()
export class SktUser<T extends SktUserMetadata> extends SktIdentity {
    private _account: nkruntime.Account;
    get account(): nkruntime.Account {
        if(this._state === SktStorageObjectState.NEW) {
            this.update();
        }
        return this._account;
    }
    get user(): nkruntime.User {
        return this.account.user;
    }
    private _state: SktStorageObjectState = SktStorageObjectState.NEW;
    get state(): SktStorageObjectState {
        return this._state;
    }
    get userName(): string {
        return this.user.username;
    }
    set userName(value: string) {
        this.user.username = value;
        this._state = SktStorageObjectState.CHANGED;
    }
    get displayName(): string {
        return this.user.displayName;
    }
    set displayName(value: string) {
        this.user.displayName = value;
        this._state = SktStorageObjectState.CHANGED;
    }
    get avatarUrl(): string {
        return this.user.avatarUrl;
    }
    set avatarUrl(value: string) {
        this.user.avatarUrl = value;
        this._state = SktStorageObjectState.CHANGED;
    }
    get langTag(): string {
        return this.user.langTag;
    }
    set langTag(value: string) {
        this.user.langTag = value;
        this._state = SktStorageObjectState.CHANGED;
    }
    get location(): string {
        return this.user.location;
    }
    set location(value: string) {
        this.user.location = value;
        this._state = SktStorageObjectState.CHANGED;
    }
    get timezone(): string {
        return this.user.timezone;
    }
    set timezone(value: string) {
        this.user.timezone = value;
        this._state = SktStorageObjectState.CHANGED;
    }
    private _metadata: T;
    get metadata(): T {
        if(this._state === SktStorageObjectState.NEW) {
            this.update();
        }
        return this._metadata;
    }

    update(): void {
        this._account = this.nk.accountGetId(this.userId);
        this._metadata = new this.meta(this.nk, this.logger, this.userId);
        this._metadata.deserialize(this._account.user.metadata as SktSerializedObject)
        this._state = SktStorageObjectState.READ;
    }

    constructor(
        nk: nkruntime.Nakama,
        logger: SktLogger,
        readonly userId: string,
        readonly meta: ClassConstructor<T>,
    ) {
        super(nk, logger, userId);
    }

    save(): void {
        if(this._state === SktStorageObjectState.NEW) {
            this.update();
        }
        if(this._state === SktStorageObjectState.CHANGED) {
            this.nk.accountUpdateId(
                this.userId, 
                this.userName, 
                this.displayName, 
                this.avatarUrl, 
                this.langTag, 
                this.location, 
                this.timezone, 
                this.metadata.serialize()
            );
            this._state = SktStorageObjectState.READ;
        }
    }
}