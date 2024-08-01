import { SktStorageObjectState } from "../interface/storage.interface";
import { SktStorage } from "../storage";
import { SktPropertyOptions } from "./property";


export function SktStorageProperty(options: SktPropertyOptions = {}): PropertyDecorator {
    return function(target: SktStorage, key: string) {
        let value: any;
        Object.defineProperty(target, key, {
            get: function () {
                return value;
            },
            set: function (next: any) {
                if(next === value) {
                    return;
                }
                const self = this as SktStorage;
                self['_state'] = SktStorageObjectState.CHANGED;
                value = next;
            },
            enumerable: true,
            configurable: false,
        });
    }
}