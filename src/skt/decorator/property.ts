import { SktMeta } from "../meta";
import { SktSerializable } from "../serializable";
import { SktClassConstructor } from "../utils/class-constructor";

export interface SktPropertyOptions {
    type?: string | SktClassConstructor<SktSerializable>;
}

export function SktProperty(options: SktPropertyOptions = {}): PropertyDecorator {
    return function (target: SktSerializable, propertyKey: string) {
        const name = target.constructor.name;
        if(!SktMeta.meta.has(name)) {
            SktMeta.meta.set(name, {
                name: name,
                properties: new Map()
            });
        }
        const classMeta = SktMeta.meta.get(name)!;
        classMeta.properties.set(propertyKey, {
            type: typeof options.type === "string" ? options.type : options.type?.name
        });
    } as PropertyDecorator;
}