import { Exception, type IVoidParameterConstructor, type TypedArray } from '@kartoffelgames/core';
import type { SerializerMetadata } from '../core/serializer-metadata.ts';
import { Serializer } from '../core/serializer.ts';
import { TypedArraySubType, ValueTypeTag } from './blob-serializer-types.ts';

/**
 * Encodes JavaScript values into binary `Uint8Array` format.
 * Handles all supported value types and detects circular references.
 */
export class BlobSerializerValueSerializer {
    /**
     * Shared TextEncoder instance for UTF-8 string encoding.
     */
    private static readonly mTextEncoder: TextEncoder = new TextEncoder();

    /**
     * Concatenate multiple Uint8Array segments into one.
     *
     * @param pArrays - Variable length array of Uint8Array segments to concatenate.
     *
     * @returns Single concatenated Uint8Array containing all input segments.
     */
    private static concat(...pArrays: Array<Uint8Array>): Uint8Array {
        // Calculate total length of concatenated array.
        const lTotalLength: number = pArrays.reduce((pSum, pCurrentItem) => {
            return pSum + pCurrentItem.byteLength;
        }, 0);

        // Create result array and copy segments into it.
        const lResult: Uint8Array = new Uint8Array(lTotalLength);

        // Merge arrays by copying each into the result at the correct offset.
        let lOffset: number = 0;
        for (const lArray of pArrays) {
            lResult.set(lArray, lOffset);
            lOffset += lArray.byteLength;
        }

        return lResult;
    }

    /**
     * Get the TypedArray sub-type ID for a given TypedArray instance.
     *
     * @param pValue - The TypedArray instance to identify.
     *
     * @returns The TypedArraySubType ID corresponding to the input TypedArray type.
     *
     * @throws Exception if the TypedArray type is not supported.
     */
    private static getTypedArraySubType(pValue: TypedArray): TypedArraySubType {
        switch (true) {
            case pValue instanceof Int8Array: return TypedArraySubType.Int8Array;
            case pValue instanceof Uint8Array: return TypedArraySubType.Uint8Array;
            case pValue instanceof Uint8ClampedArray: return TypedArraySubType.Uint8ClampedArray;
            case pValue instanceof Int16Array: return TypedArraySubType.Int16Array;
            case pValue instanceof Uint16Array: return TypedArraySubType.Uint16Array;
            case pValue instanceof Int32Array: return TypedArraySubType.Int32Array;
            case pValue instanceof Uint32Array: return TypedArraySubType.Uint32Array;
            case pValue instanceof Float32Array: return TypedArraySubType.Float32Array;
            case pValue instanceof Float64Array: return TypedArraySubType.Float64Array;
            case pValue instanceof BigInt64Array: return TypedArraySubType.BigInt64Array;
            case pValue instanceof BigUint64Array: return TypedArraySubType.BigUint64Array;
        }

        throw new Exception('Unsupported TypedArray type.', pValue);
    }

    /**
     * Serialitze a value into a Uint8Array.
     * 
     * @param pValue - The value to serialize
     * 
     * @returns Uint8Array of encoded bytes.
     */
    public serialize(pValue: unknown): Uint8Array {
        return this.encode(pValue, new Set<object>());
    }

    /**
     * Encode a value into a Uint8Array.
     *
     * @param pValue - The value to encode.
     * @param pVisited - Set tracking visited objects to detect circular references.
     *
     * @returns Uint8Array of encoded bytes.
     *
     * @throws Exception when circular reference is detected or unsupported type encountered.
     */
    private encode(pValue: unknown, pVisited: Set<object>): Uint8Array {
        // Null.
        if (pValue === null) {
            return this.encodeNull();
        }

        // Undefined - not expected but handle gracefully during recursion.
        if (pValue === undefined) {
            return this.encodeNull();
        }

        // Boolean.
        if (typeof pValue === 'boolean') {
            return this.encodeBoolean(pValue);
        }

        // Number.
        if (typeof pValue === 'number') {
            return this.encodeNumber(pValue);
        }

        // String.
        if (typeof pValue === 'string') {
            return this.encodeString(pValue);
        }

        // ArrayBuffer.
        if (pValue instanceof ArrayBuffer) {
            return this.encodeArrayBuffer(pValue);
        }

        // TypedArray (must check before generic object).
        if (ArrayBuffer.isView(pValue) && !(pValue instanceof DataView)) {
            return this.encodeTypedArray(pValue as TypedArray);
        }

        // Map.
        if (pValue instanceof Map) {
            // Throw if circular reference is detected before recursing into map entries.
            this.validateNotCircular(pValue, pVisited);

            // Add to visited set before recursion to detect circular references.
            pVisited.add(pValue);

            // Try to encode map entries. Remove from visited set after recursion to allow re-serialization in different paths.
            try {
                return this.encodeMap(pValue, pVisited);
            } finally {
                pVisited.delete(pValue);
            }
        }

        // Array.
        if (Array.isArray(pValue)) {
            // Throw if circular reference is detected before recursing into array elements.
            this.validateNotCircular(pValue, pVisited);

            // Add to visited set before recursion to detect circular references.
            pVisited.add(pValue);

            // Try to encode array elements. Remove from visited set after recursion to allow re-serialization in different paths.
            try {
                return this.encodeArray(pValue, pVisited);
            } finally {
                pVisited.delete(pValue);
            }
        }

        // Object (registered or plain - but only registered objects are supported as top-level objects).
        if (typeof pValue === 'object') {
            // Throw if circular reference is detected before recursing into array elements.
            this.validateNotCircular(pValue, pVisited);

            // Add to visited set before recursion to detect circular references.
            pVisited.add(pValue);

            // Try to get serializer metadata for the object's constructor. Only registered (decorated) classes are supported for serialization.
            const lConstructor: IVoidParameterConstructor<object> = pValue.constructor as IVoidParameterConstructor<object>;
            const lMetadata: SerializerMetadata | null = Serializer.metadataOf(lConstructor);
            if (lMetadata === null) {
                throw new Exception(`Object of type "${lConstructor.name}" is not registered as serializable. Apply @Serializer.class() decorator.`, pValue);
            }

            // Try to encode registered object. Remove from visited set after recursion to allow re-serialization in different paths.
            try {
                return this.encodeRegisteredObject(pValue as object, lMetadata, pVisited);
            } finally {
                pVisited.delete(pValue);
            }
        }

        throw new Exception(`Unsupported value type: ${typeof pValue}`, pValue);
    }

    /**
     * Encode array. Tag 0x05 + uint32 element count + recursive elements.
     *
     * @param pValue - The array to encode.
     * @param pVisited - Set tracking visited objects to detect circular references.
     *
     * @returns Uint8Array containing the encoded array data.
     */
    private encodeArray(pValue: Array<unknown>, pVisited: Set<object>): Uint8Array {
        // Create header for array: tag + element count.
        const lHeaderBuffer: ArrayBuffer = new ArrayBuffer(5);
        const lHeaderView: DataView = new DataView(lHeaderBuffer);
        lHeaderView.setUint8(0, ValueTypeTag.Array);
        lHeaderView.setUint32(1, pValue.length, true);

        // Create array of parts to concatenate: start with header, then recursively encode each element.
        const lDataParts: Array<Uint8Array> = [new Uint8Array(lHeaderBuffer)];
        for (const lElement of pValue) {
            lDataParts.push(this.encode(lElement, pVisited));
        }

        return BlobSerializerValueSerializer.concat(...lDataParts);
    }

    /**
     * Encode ArrayBuffer. Tag 0x07 + uint32 byte-length + raw bytes.
     *
     * @param pValue - The ArrayBuffer to encode.
     *
     * @returns Uint8Array containing the encoded ArrayBuffer data.
     */
    private encodeArrayBuffer(pValue: ArrayBuffer): Uint8Array {
        // Create header for ArrayBuffer: tag + byte length.
        const lHeaderBuffer: ArrayBuffer = new ArrayBuffer(5);
        const lHeaderView: DataView = new DataView(lHeaderBuffer);
        lHeaderView.setUint8(0, ValueTypeTag.ArrayBuffer);
        lHeaderView.setUint32(1, pValue.byteLength, true);

        // Concat header and raw bytes of ArrayBuffer.
        return BlobSerializerValueSerializer.concat(new Uint8Array(lHeaderBuffer), new Uint8Array(pValue));
    }

    /**
     * Encode boolean value. Tag 0x01 (false) or 0x02 (true).
     *
     * @param pValue - The boolean value to encode.
     *
     * @returns Uint8Array containing the encoded boolean (single byte).
     */
    private encodeBoolean(pValue: boolean): Uint8Array {
        return new Uint8Array([pValue ? ValueTypeTag.BooleanTrue : ValueTypeTag.BooleanFalse]);
    }

    /**
     * Encode null value. Tag 0x00.
     *
     * @returns Uint8Array containing the encoded null (single byte).
     */
    private encodeNull(): Uint8Array {
        return new Uint8Array([ValueTypeTag.Null]);
    }

    /**
     * Encode Map. Tag 0x09 + uint32 entry count + recursive key/value pairs.
     *
     * @param pValue - The Map to encode.
     * @param pVisited - Set tracking visited objects to detect circular references.
     *
     * @returns Uint8Array containing the encoded Map data.
     */
    private encodeMap(pValue: Map<unknown, unknown>, pVisited: Set<object>): Uint8Array {
        // Create header for map: tag + entry count.
        const lHeaderBuffer: ArrayBuffer = new ArrayBuffer(5);
        const lHeaderView: DataView = new DataView(lHeaderBuffer);
        lHeaderView.setUint8(0, ValueTypeTag.Map);
        lHeaderView.setUint32(1, pValue.size, true);

        // Create array of parts to concatenate: start with header, then recursively encode each key and value.
        const lDataParts: Array<Uint8Array> = [new Uint8Array(lHeaderBuffer)];
        for (const [lKey, lValue] of pValue) {
            lDataParts.push(this.encode(lKey, pVisited));
            lDataParts.push(this.encode(lValue, pVisited));
        }

        return BlobSerializerValueSerializer.concat(...lDataParts);
    }

    /**
     * Encode number as float64 LE. Tag 0x03 + 8 bytes.
     *
     * @param pValue - The number to encode.
     *
     * @returns Uint8Array containing the encoded number (1 tag byte + 8 bytes for float64).
     */
    private encodeNumber(pValue: number): Uint8Array {
        // Create buffer for number: tag + 8 bytes for float64.
        const lBuffer: ArrayBuffer = new ArrayBuffer(9);

        // Assign tag and number value to buffer using DataView for correct byte layout.
        const lView: DataView = new DataView(lBuffer);
        lView.setUint8(0, ValueTypeTag.Number);
        lView.setFloat64(1, pValue, true); // little-endian

        return new Uint8Array(lBuffer);
    }

    /**
     * Encode a registered (decorated) object.
     * Tag 0x06 + uint16 uuid-length + UTF-8 uuid + uint32 prop-count + properties.
     *
     * @param pValue - The object instance to encode.
     * @param pMetadata - Serializer metadata for the object's class.
     * @param pVisited - Set tracking visited objects to detect circular references.
     *
     * @returns Uint8Array containing the encoded object data.
     *
     * @throws Exception if the serializer UUID has not been set on the metadata.
     */
    private encodeRegisteredObject(pValue: object, pMetadata: SerializerMetadata, pVisited: Set<object>): Uint8Array {
        const lClassUuid: string | null = pMetadata.uuid;
        if (!lClassUuid) {
            throw new Exception('Serializer UUID has not been set.', this);
        }

        const lUuidBytes: Uint8Array = BlobSerializerValueSerializer.mTextEncoder.encode(lClassUuid);
        const lPropertyNames: Array<string> = pMetadata.propertyNames;

        // Header: tag + uuid length + uuid bytes + property count.
        const lHeaderBuffer: ArrayBuffer = new ArrayBuffer(1 + 2 + lUuidBytes.byteLength + 4);
        const lHeaderView: DataView = new DataView(lHeaderBuffer);
        let lOffset: number = 0;

        // Tag
        lHeaderView.setUint8(lOffset, ValueTypeTag.Object);
        lOffset += 1;

        // UUID length.
        lHeaderView.setUint16(lOffset, lUuidBytes.byteLength, true);
        lOffset += 2;

        // UUID data bytes.
        new Uint8Array(lHeaderBuffer, lOffset, lUuidBytes.byteLength).set(lUuidBytes);
        lOffset += lUuidBytes.byteLength;

        // Property count.
        lHeaderView.setUint32(lOffset, lPropertyNames.length, true);

        const lParts: Array<Uint8Array> = [new Uint8Array(lHeaderBuffer)];

        // Encode each property.
        for (const lPropertyName of lPropertyNames) {
            // Read configuration for property to get alias.
            const lConfig = pMetadata.getPropertyConfig(lPropertyName);

            // Name under which the property is stored in the serialized data.
            const lStoredPropertyKey: string = lConfig.alias ?? lPropertyName;
            const lStoredPropertyKeyDataBytes: Uint8Array = BlobSerializerValueSerializer.mTextEncoder.encode(lStoredPropertyKey);

            // Key: uint16 stored property key length
            const lKeyHeaderBuffer: ArrayBuffer = new ArrayBuffer(2);
            const lKeyHeaderView: DataView = new DataView(lKeyHeaderBuffer);
            lKeyHeaderView.setUint16(0, lStoredPropertyKeyDataBytes.byteLength, true);

            // Key header and key data.
            lParts.push(new Uint8Array(lKeyHeaderBuffer));
            lParts.push(lStoredPropertyKeyDataBytes);

            // Value: recursive encoding of property value.
            const lPropertyValue: unknown = (pValue as Record<string, unknown>)[lPropertyName];
            lParts.push(this.encode(lPropertyValue, pVisited));
        }

        return BlobSerializerValueSerializer.concat(...lParts);
    }

    /**
     * Encode string as UTF-8. Tag 0x04 + uint32 byte-length + UTF-8 bytes.
     *
     * @param pValue - The string to encode.
     *
     * @returns Uint8Array containing the encoded string (tag + UTF-8 length + UTF-8 bytes).
     */
    private encodeString(pValue: string): Uint8Array {
        // Encode string to UTF-8 bytes.
        const lStringBytes: Uint8Array = BlobSerializerValueSerializer.mTextEncoder.encode(pValue);

        // Create header for string: tag + byte length.
        const lBuffer: ArrayBuffer = new ArrayBuffer(5);
        const lView: DataView = new DataView(lBuffer);
        lView.setUint8(0, ValueTypeTag.String);
        lView.setUint32(1, lStringBytes.byteLength, true);

        return BlobSerializerValueSerializer.concat(new Uint8Array(lBuffer), lStringBytes);
    }

    /**
     * Encode TypedArray. Tag 0x08 + uint8 sub-type-id + uint32 byte-length + raw bytes.
     *
     * @param pValue - The TypedArray to encode.
     *
     * @returns Uint8Array containing the encoded TypedArray (tag + sub-type + byte-length + bytes).
     */
    private encodeTypedArray(pValue: TypedArray): Uint8Array {
        // Get sub-type ID for the specific TypedArray type and raw bytes of the TypedArray.
        const lSubType: TypedArraySubType = BlobSerializerValueSerializer.getTypedArraySubType(pValue);

        // Convert TypedArray to Uint8Array view for easier concatenation.
        const lBytes: Uint8Array = new Uint8Array(pValue.buffer, pValue.byteOffset, pValue.byteLength);

        // Create header for TypedArray: tag + sub-type ID + byte length.
        const lHeaderBuffer: ArrayBuffer = new ArrayBuffer(6);
        const lHeaderView: DataView = new DataView(lHeaderBuffer);
        lHeaderView.setUint8(0, ValueTypeTag.TypedArray);
        lHeaderView.setUint8(1, lSubType);
        lHeaderView.setUint32(2, pValue.byteLength, true);

        return BlobSerializerValueSerializer.concat(new Uint8Array(lHeaderBuffer), lBytes);
    }

    /**
     * Assert that an object is not already on the current serialization path.
     *
     * @param pObject - The object to check.
     * @param pVisited - Set of objects already visited in the current serialization path.
     *
     * @throws Exception if circular reference is detected.
     */
    private validateNotCircular(pObject: object, pVisited: Set<object>): void {
        if (pVisited.has(pObject)) {
            throw new Exception('Circular reference detected during serialization.', pObject);
        }
    }

}
