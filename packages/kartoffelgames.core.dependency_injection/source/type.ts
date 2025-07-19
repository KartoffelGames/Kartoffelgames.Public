export type InjectionConstructor<T extends object = object> = new (...pParameter: Array<any>) => T;

export type InjectionInstance<T extends InjectionConstructor> = InstanceType<T>;
