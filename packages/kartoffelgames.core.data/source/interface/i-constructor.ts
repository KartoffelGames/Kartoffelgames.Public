/**
 * Type that has no constructor parameter.
 * 
 * @experimental @alpha
 */
export interface IVoidParameterConstructor<T> {
    new(): T;
}

/**
 * Type that can have constructor parameter.
 * 
 * @experimental @alpha
 */
export interface IAnyParameterConstructor<T> {
    new(...pParameter: Array<any>): T;
}