import { SktStorageObjectState } from "../interface/storage.interface";
import { SktUserMetadata } from "../user-metadata";
import { SktPropertyOptions } from "./property";


export function SktUserMetadataProperty(options: SktPropertyOptions = {}): PropertyDecorator {
    return function (target: SktUserMetadata, propertyKey: string) {
        let value: any;
        Object.defineProperty(target, propertyKey, {
            get: function () {
                return value;
            },
            set: function (next: any) {
                if(next === value) {
                    return;
                }
                const self = this as SktUserMetadata;
                if(self['_state'] === SktStorageObjectState.NEW) {
                    throw new Error(`Storage object ${this.sktId} is not initialized, call update() first`);
                }
                self['_state'] = SktStorageObjectState.CHANGED;
                value = next;
            },
            enumerable: true,
            configurable: false,
        });
    }
}