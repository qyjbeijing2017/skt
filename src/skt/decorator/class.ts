import { SktMeta } from "../meta";
import { SktSerializable } from "../serializable";
import { SktClassConstructor } from "../utils/class-constructor";

export interface SktClassOptions {}
export function SktClass(options: SktClassOptions = {}): ClassDecorator {
    return function <T extends SktClassConstructor<SktSerializable>>(target: T) {
        const name = target.name;
        if(!SktMeta.meta.has(name)) {
            SktMeta.meta.set(name, {
                name: name,
                properties: new Map()
            });
        }
        const meta = SktMeta.meta.get(name)!;
        meta.classConstructor = target;        
    } as ClassDecorator;
}