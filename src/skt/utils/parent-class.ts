import { SktClassConstructor } from "./class-constructor"

export function sktParentClass<T extends SktClassConstructor<any>>(target: T): SktClassConstructor<any> {
    return Object.getPrototypeOf(target.prototype).constructor;
}