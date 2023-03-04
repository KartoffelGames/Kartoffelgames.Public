// Object path.
export type ObjectFieldPath = Array<ObjectFieldPathPart>;
export type ObjectFieldPathPart = string | number | symbol;

// Writeable types.
export type Writeable<T> = { -readonly [P in keyof T]: T[P] };
export type Readonly<T> = { +readonly [P in keyof T]: T[P] };

// Union types.
export type TypedArray = Float32Array | Float64Array | Uint8Array | Int8Array | Uint16Array | Int16Array | Uint32Array | Int32Array;

// (no)Optional property types.
export type NoOptional<T> = { [P in keyof Required<T>]: NoOptional<T[P]> };
