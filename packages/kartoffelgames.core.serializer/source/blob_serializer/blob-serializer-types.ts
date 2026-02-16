/**
 * Enum of type tags used in binary value encoding.
 */
export const enum ValueTypeTag {
    Null = 0x00,
    BooleanFalse = 0x01,
    BooleanTrue = 0x02,
    Number = 0x03,
    String = 0x04,
    Array = 0x05,
    Object = 0x06,
    ArrayBuffer = 0x07,
    TypedArray = 0x08,
}

/**
 * Enum of typed array sub-type identifiers.
 */
export const enum TypedArraySubType {
    Int8Array = 0,
    Uint8Array = 1,
    Uint8ClampedArray = 2,
    Int16Array = 3,
    Uint16Array = 4,
    Int32Array = 5,
    Uint32Array = 6,
    Float32Array = 7,
    Float64Array = 8,
    BigInt64Array = 9,
    BigUint64Array = 10,
}