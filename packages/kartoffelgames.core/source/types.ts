/**
 * Support type that sets all types of properties to writeable.
 * Removes the readonly modifier to all properties.
 * 
 * @typeParam T - Type of object whose properties should convert to writeonly.
 * 
 * @public
 */
export type Writeable<T> = { -readonly [P in keyof T]: T[P] };

/**
 * Support type that sets all types of properties to readonly.
 * Adds the readonly modifier to all properties.
 * 
 * @typeParam T - Type of object whose properties should convert to readyonly.
 * 
 * @public
 */
export type Readonly<T> = { +readonly [P in keyof T]: T[P] };

// Decorator types.
export type ClassDecorator<TClass extends Function, TResult extends TClass | void> = (pOriginalClass: TClass, pContext: ClassDecoratorContext) => TResult;
export type ClassAccessorDecorator<TThis extends Function, TValue> = (pTarget: ClassAccessorDecoratorTarget<TThis, TValue>, pContext: ClassAccessorDecoratorContext) => ClassAccessorDecoratorResult<TThis, TValue>;
export type ClassMethodDecorator<TThis extends Function, TFunction extends Function> = (pTarget: TFunction, pContext: ClassMethodDecoratorContext<TThis>) => TFunction | void;
export type ClassFieldDecorator<TThis extends Function, TValue> = (_pTarget: any, pContext: ClassFieldDecoratorContext<TThis, TValue>) => ((pValue: TValue) => TValue) | void;

// Typed array type.
export type TypedArray = | Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array | BigInt64Array | BigUint64Array;