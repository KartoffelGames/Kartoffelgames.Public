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