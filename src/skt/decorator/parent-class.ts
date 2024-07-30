import { ClassConstructor } from "./class-constructor";

export function parentClass<T extends ClassConstructor<any>>(target: T): ClassConstructor<any> {
    return Object.getPrototypeOf(target.prototype).constructor;
}