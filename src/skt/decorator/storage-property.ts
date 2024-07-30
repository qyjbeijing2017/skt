import { SktStorageObject, SktStorageObjectState } from "../storage-object";
import { SktProperty, SktPropertyOptions } from "./property";

export function SktStorageProperty(options: SktPropertyOptions = {}): PropertyDecorator {
    return function(target: SktStorageObject, key: string) {
        SktProperty(options)(target, key);
        let value: any;
        Object.defineProperty(target, key, {
            get: function () {
                return value;
            },
            set: function (next: any) {
                this.state = SktStorageObjectState.CHANGED;
                value = next;
            },
            enumerable: true,
            configurable: false,
        });
    }
}