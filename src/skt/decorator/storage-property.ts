import { SktStorageObjectState } from "../interface/storage.interface";
import { SktStorageObject } from "../storage-object";

export interface SktStoragePropertyOptions {
}

export function SktStorageProperty(options: SktStoragePropertyOptions = {}): PropertyDecorator {
    return function(target: SktStorageObject, key: string) {
        let value: any;
        Object.defineProperty(target, key, {
            get: function () {
                return value;
            },
            set: function (next: any) {
                if(next === value) {
                    return;
                }
                if(this.state === SktStorageObjectState.NEW) {
                    throw new Error(`Storage object ${this.sktId} is not initialized, call update() first`);
                }
                this.logger.info(`Storage object ${this.sktId} property ${key} changed from ${value} to ${next}`);
                this.state = SktStorageObjectState.CHANGED;
                value = next;
            },
            enumerable: true,
            configurable: false,
        });
    }
}