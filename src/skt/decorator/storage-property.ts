import { SktStorageObject, SktStorageObjectState } from "../storage-object";
import { SktProperty, SktPropertyOptions } from "./property";

export function SktStorageProperty(options: SktPropertyOptions = {}): PropertyDecorator {
    return function(target: SktStorageObject, key: string) {
        SktProperty(options)(target, key);
        
        let value: any;
        const getter = () => {
            return value;
        }

        const setter = (next: any) => {
            target['state'] = SktStorageObjectState.CHANGED;
            value = next;
        }

        // Object.defineProperty(target, key, {
        //     get: getter,
        //     set: setter,
        //     enumerable: true,
        //     configurable: false,
        // });
    }
}