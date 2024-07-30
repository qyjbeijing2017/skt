import { SktStorageObjectState } from "../interface/storage.interface";
import { SktStorageObject } from "../storage-object";
import { SktProperty, SktPropertyOptions } from "./property";

export function SktStorageProperty(options: SktPropertyOptions = {}): PropertyDecorator {
    return function(target: SktStorageObject, key: string) {
        SktProperty(options)(target, key);
        let value: any;
        Object.defineProperty(target, key, {
            get: function () {
                if(this.state === SktStorageObjectState.NEW) {
                    throw new Error(`Storage object ${this.sktId} is not initialized, call update() first`);
                }
                return value;
            },
            set: function (next: any) {
                if(next === value) {
                    return;
                }
                this.state = SktStorageObjectState.CHANGED;
                value = next;
            },
            enumerable: true,
            configurable: false,
        });
    }
}