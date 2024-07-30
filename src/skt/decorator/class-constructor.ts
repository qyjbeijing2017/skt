export type ClassConstructor<T> = new (...args: any[]) => T;

export type SuperClass<C> = C extends ClassConstructor<infer I>
  ? I extends { constructor: infer S }
    ? S extends new (...args: any[]) => infer P
      ? P
      : never
    : never
  : never;