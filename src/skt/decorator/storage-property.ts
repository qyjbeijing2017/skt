import { SktStorageObjectState } from "../interface/storage.interface";
import { SktStorageObject } from "../storage-object";
import { SktProperty, SktPropertyOptions } from "./property";

export interface SktStoragePropertyOptions extends SktPropertyOptions {
}

export function SktStorageProperty(options: SktStoragePropertyOptions = {}): PropertyDecorator {
    return function(target: SktStorageObject, key: string) {
        SktProperty(options)(target, key);
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
                this.state = SktStorageObjectState.CHANGED;
                value = next;
            },
            enumerable: true,
            configurable: false,
        });
    }
}