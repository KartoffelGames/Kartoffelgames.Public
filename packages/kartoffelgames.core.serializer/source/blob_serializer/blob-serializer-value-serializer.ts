import { Exception, type IVoidParameterConstructor, type TypedArray } from '@kartoffelgames/core';
import { Serializer } from '../core/serializer.ts';
import type { SerializerMetadata } from '../core/serializer-metadata.ts';
import { ValueTypeTag, TypedArraySubType } from './blob-serializer-types.ts';

/**
 * Encodes JavaScript values into binary `Uint8Array` format.
 * Handles all supported value types and detects circular references.
 */
export class BlobSerializerValueSerializer {
    private static readonly mTextEncoder: TextEncoder = new TextEncoder();

    /**
     * Concatenate multiple Uint8Array segments into one.
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

    private readonly mVisited: Set<object>;

    /**
     * Constructor.
     */
    public constructor() {
        this.mVisited = new Set<object>();
    }

    /**
     * Encode a value into a Uint8Array.
     *
     * @param pValue - The value to encode.
     *
     * @returns Uint8Array of encoded bytes.
     *
     * @throws Exception when circular reference is detected or unsupported type encountered.
     */
    public encode(pValue: unknown): Uint8Array {
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

        // Array.
        if (Array.isArray(pValue)) {
            this.assertNotCircular(pValue);
            this.mVisited.add(pValue);
            const lResult: Uint8Array = this.encodeArray(pValue);
            this.mVisited.delete(pValue);
            return lResult;
        }

        // Object (registered or plain - but only registered objects are supported as top-level objects).
        if (typeof pValue === 'object') {
            this.assertNotCircular(pValue);
            this.mVisited.add(pValue);

            const lConstructor: IVoidParameterConstructor<object> = pValue.constructor as IVoidParameterConstructor<object>;
            const lMetadata: SerializerMetadata | null = Serializer.metadataOf(lConstructor);

            if (lMetadata === null) {
                throw new Exception(`Object of type "${lConstructor.name}" is not registered as serializable. Apply @Serializer.class() decorator.`, pValue);
            }

            const lResult: Uint8Array = this.encodeRegisteredObject(pValue as object, lMetadata);
            this.mVisited.delete(pValue);
            return lResult;
        }

        throw new Exception(`Unsupported value type: ${typeof pValue}`, pValue);
    }

    /**
     * Assert that an object is not already on the current serialization path.
     *
     * @param pObject - The object to check.
     *
     * @throws Exception if circular reference is detected.
     */
    private assertNotCircular(pObject: object): void {
        if (this.mVisited.has(pObject)) {
            throw new Exception('Circular reference detected during serialization.', pObject);
        }
    }

    /**
     * Encode array. Tag 0x05 + uint32 element count + recursive elements.
     */
    private encodeArray(pValue: Array<unknown>): Uint8Array {
        const lHeaderBuffer: ArrayBuffer = new ArrayBuffer(5);
        const lHeaderView: DataView = new DataView(lHeaderBuffer);
        lHeaderView.setUint8(0, ValueTypeTag.Array);
        lHeaderView.setUint32(1, pValue.length, true);

        const lParts: Array<Uint8Array> = [new Uint8Array(lHeaderBuffer)];

        for (const lElement of pValue) {
            lParts.push(this.encode(lElement));
        }

        return BlobSerializerValueSerializer.concat(...lParts);
    }

    /**
     * Encode ArrayBuffer. Tag 0x07 + uint32 byte-length + raw bytes.
     */
    private encodeArrayBuffer(pValue: ArrayBuffer): Uint8Array {
        const lHeaderBuffer: ArrayBuffer = new ArrayBuffer(5);
        const lHeaderView: DataView = new DataView(lHeaderBuffer);
        lHeaderView.setUint8(0, ValueTypeTag.ArrayBuffer);
        lHeaderView.setUint32(1, pValue.byteLength, true);
        return BlobSerializerValueSerializer.concat(new Uint8Array(lHeaderBuffer), new Uint8Array(pValue));
    }

    /**
     * Encode boolean value. Tag 0x01 (false) or 0x02 (true).
     */
    private encodeBoolean(pValue: boolean): Uint8Array {
        return new Uint8Array([pValue ? ValueTypeTag.BooleanTrue : ValueTypeTag.BooleanFalse]);
    }

    /**
     * Encode null value. Tag 0x00.
     */
    private encodeNull(): Uint8Array {
        return new Uint8Array([ValueTypeTag.Null]);
    }

    /**
     * Encode number as float64 LE. Tag 0x03 + 8 bytes.
     */
    private encodeNumber(pValue: number): Uint8Array {
        const lBuffer: ArrayBuffer = new ArrayBuffer(9);
        const lView: DataView = new DataView(lBuffer);
        lView.setUint8(0, ValueTypeTag.Number);
        lView.setFloat64(1, pValue, true); // little-endian
        return new Uint8Array(lBuffer);
    }

    /**
     * Encode a registered (decorated) object.
     * Tag 0x06 + uint16 uuid-length + UTF-8 uuid + uint32 prop-count + properties.
     */
    private encodeRegisteredObject(pValue: object, pMetadata: SerializerMetadata): Uint8Array {
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

        lHeaderView.setUint8(lOffset, ValueTypeTag.Object);
        lOffset += 1;

        lHeaderView.setUint16(lOffset, lUuidBytes.byteLength, true);
        lOffset += 2;

        new Uint8Array(lHeaderBuffer, lOffset, lUuidBytes.byteLength).set(lUuidBytes);
        lOffset += lUuidBytes.byteLength;

        lHeaderView.setUint32(lOffset, lPropertyNames.length, true);

        const lParts: Array<Uint8Array> = [new Uint8Array(lHeaderBuffer)];

        // Encode each property.
        for (const lPropertyName of lPropertyNames) {
            const lConfig = pMetadata.getPropertyConfig(lPropertyName);
            const lBinaryKey: string = lConfig.alias ?? lPropertyName;
            const lKeyBytes: Uint8Array = BlobSerializerValueSerializer.mTextEncoder.encode(lBinaryKey);

            // Key: uint16 key-length + UTF-8 key bytes.
            const lKeyHeaderBuffer: ArrayBuffer = new ArrayBuffer(2);
            const lKeyHeaderView: DataView = new DataView(lKeyHeaderBuffer);
            lKeyHeaderView.setUint16(0, lKeyBytes.byteLength, true);

            lParts.push(new Uint8Array(lKeyHeaderBuffer));
            lParts.push(lKeyBytes);

            // Value: recursive encoding.
            const lPropertyValue: unknown = (pValue as Record<string, unknown>)[lPropertyName];
            lParts.push(this.encode(lPropertyValue));
        }

        return BlobSerializerValueSerializer.concat(...lParts);
    }

    /**
     * Encode string as UTF-8. Tag 0x04 + uint32 byte-length + UTF-8 bytes.
     */
    private encodeString(pValue: string): Uint8Array {
        const lStringBytes: Uint8Array = BlobSerializerValueSerializer.mTextEncoder.encode(pValue);
        const lBuffer: ArrayBuffer = new ArrayBuffer(5);
        const lView: DataView = new DataView(lBuffer);
        lView.setUint8(0, ValueTypeTag.String);
        lView.setUint32(1, lStringBytes.byteLength, true);
        return BlobSerializerValueSerializer.concat(new Uint8Array(lBuffer), lStringBytes);
    }

    /**
     * Encode TypedArray. Tag 0x08 + uint8 sub-type-id + uint32 byte-length + raw bytes.
     */
    private encodeTypedArray(pValue: TypedArray): Uint8Array {
        const lSubType: TypedArraySubType = BlobSerializerValueSerializer.getTypedArraySubType(pValue);
        const lBytes: Uint8Array = new Uint8Array(pValue.buffer, pValue.byteOffset, pValue.byteLength);

        const lHeaderBuffer: ArrayBuffer = new ArrayBuffer(6);
        const lHeaderView: DataView = new DataView(lHeaderBuffer);
        lHeaderView.setUint8(0, ValueTypeTag.TypedArray);
        lHeaderView.setUint8(1, lSubType);
        lHeaderView.setUint32(2, pValue.byteLength, true);

        return BlobSerializerValueSerializer.concat(new Uint8Array(lHeaderBuffer), lBytes);
    }
}
