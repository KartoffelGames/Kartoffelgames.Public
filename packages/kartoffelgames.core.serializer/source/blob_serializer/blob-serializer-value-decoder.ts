import { Exception, type IVoidParameterConstructor, type TypedArray } from '@kartoffelgames/core';
import { Serializer } from '../core/serializer.ts';
import type { SerializerMetadata } from '../core/serializer-metadata.ts';
import { ValueTypeTag, TypedArraySubType } from './blob-serializer-types.ts';

/**
 * Decodes binary `Uint8Array` data back into JavaScript values.
 */
export class BlobSerializerValueDecoder {
    private static readonly mTextDecoder: TextDecoder = new TextDecoder();

    /**
     * Map from typed array sub-type ID to the number of bytes per element.
     */
    private static readonly mTypedArrayBytesPerElement: ReadonlyMap<TypedArraySubType, number> = new Map([
        [TypedArraySubType.Int8Array, 1],
        [TypedArraySubType.Uint8Array, 1],
        [TypedArraySubType.Uint8ClampedArray, 1],
        [TypedArraySubType.Int16Array, 2],
        [TypedArraySubType.Uint16Array, 2],
        [TypedArraySubType.Int32Array, 4],
        [TypedArraySubType.Uint32Array, 4],
        [TypedArraySubType.Float32Array, 4],
        [TypedArraySubType.Float64Array, 8],
        [TypedArraySubType.BigInt64Array, 8],
        [TypedArraySubType.BigUint64Array, 8],
    ]);

    /**
     * Map from typed array sub-type ID to the constructor.
     */
    private static readonly mTypedArrayConstructors: ReadonlyMap<TypedArraySubType, new (buffer: ArrayBuffer, byteOffset?: number, length?: number) => TypedArray> = (() => {
        return new Map([
            [TypedArraySubType.Int8Array, Int8Array],
            [TypedArraySubType.Uint8Array, Uint8Array],
            [TypedArraySubType.Uint8ClampedArray, Uint8ClampedArray],
            [TypedArraySubType.Int16Array, Int16Array],
            [TypedArraySubType.Uint16Array, Uint16Array],
            [TypedArraySubType.Int32Array, Int32Array],
            [TypedArraySubType.Uint32Array, Uint32Array],
            [TypedArraySubType.Float32Array, Float32Array],
            [TypedArraySubType.Float64Array, Float64Array],
            [TypedArraySubType.BigInt64Array, BigInt64Array as any],
            [TypedArraySubType.BigUint64Array, BigUint64Array as any],
        ]);
    })();

    private readonly mBytes: Uint8Array;
    private readonly mDataView: DataView;
    private mOffset: number;

    /**
     * Constructor.
     *
     * @param pData - The encoded byte data.
     */
    public constructor(pData: Uint8Array) {
        this.mBytes = pData;
        this.mDataView = new DataView(pData.buffer, pData.byteOffset, pData.byteLength);
        this.mOffset = 0;
    }

    /**
     * Decode the value starting from the current offset.
     *
     * @returns the decoded JavaScript value.
     *
     * @throws Exception if an unknown type tag is encountered.
     */
    public decode(): unknown {
        const lTag: number = this.readUint8();

        switch (lTag) {
            case ValueTypeTag.Null:
                return null;
            case ValueTypeTag.BooleanFalse:
                return false;
            case ValueTypeTag.BooleanTrue:
                return true;
            case ValueTypeTag.Number:
                return this.decodeNumber();
            case ValueTypeTag.String:
                return this.decodeString();
            case ValueTypeTag.Array:
                return this.decodeArray();
            case ValueTypeTag.Object:
                return this.decodeRegisteredObject();
            case ValueTypeTag.ArrayBuffer:
                return this.decodeArrayBuffer();
            case ValueTypeTag.TypedArray:
                return this.decodeTypedArray();
            default:
                throw new Exception(`Unknown value type tag: 0x${lTag.toString(16).padStart(2, '0')}`, this);
        }
    }

    /**
     * Decode an array of values.
     */
    private decodeArray(): Array<unknown> {
        const lCount: number = this.readUint32();
        const lArray: Array<unknown> = new Array<unknown>(lCount);

        for (let lIndex: number = 0; lIndex < lCount; lIndex++) {
            lArray[lIndex] = this.decode();
        }

        return lArray;
    }

    /**
     * Decode an ArrayBuffer.
     */
    private decodeArrayBuffer(): ArrayBuffer {
        const lByteLength: number = this.readUint32();
        const lBytes: Uint8Array = this.readBytes(lByteLength);
        // Copy bytes into a fresh ArrayBuffer.
        const lBuffer: ArrayBuffer = new ArrayBuffer(lByteLength);
        new Uint8Array(lBuffer).set(lBytes);
        return lBuffer;
    }

    /**
     * Decode a float64 number.
     */
    private decodeNumber(): number {
        return this.readFloat64();
    }

    /**
     * Decode a registered (decorated) object.
     */
    private decodeRegisteredObject(): object {
        // Read UUID.
        const lUuidByteLength: number = this.readUint16();
        const lUuid: string = this.readString(lUuidByteLength);

        // Resolve constructor.
        const lConstructor: IVoidParameterConstructor<object> = Serializer.classOfUuid(lUuid);
        const lInstance: object = new lConstructor();

        // Read metadata for property alias mapping.
        const lMetadata: SerializerMetadata | null = Serializer.metadataOf(lConstructor);

        // Build alias-to-property-name reverse map.
        const lAliasToPropertyName: Map<string, string> = new Map<string, string>();
        if (lMetadata !== null) {
            for (const lPropertyName of lMetadata.propertyNames) {
                const lConfig = lMetadata.getPropertyConfig(lPropertyName);
                const lBinaryKey: string = lConfig.alias ?? lPropertyName;
                lAliasToPropertyName.set(lBinaryKey, lPropertyName);
            }
        }

        // Read properties.
        const lPropertyCount: number = this.readUint32();

        for (let lIndex: number = 0; lIndex < lPropertyCount; lIndex++) {
            // Read key.
            const lKeyByteLength: number = this.readUint16();
            const lBinaryKey: string = this.readString(lKeyByteLength);

            // Decode value.
            const lValue: unknown = this.decode();

            // Map binary key to property name (via alias or direct match).
            const lPropertyName: string = lAliasToPropertyName.get(lBinaryKey) ?? lBinaryKey;

            // Assign to instance.
            (lInstance as Record<string, unknown>)[lPropertyName] = lValue;
        }

        return lInstance;
    }

    /**
     * Decode a UTF-8 string.
     */
    private decodeString(): string {
        const lByteLength: number = this.readUint32();
        return this.readString(lByteLength);
    }

    /**
     * Decode a TypedArray.
     */
    private decodeTypedArray(): TypedArray {
        const lSubType: TypedArraySubType = this.readUint8() as TypedArraySubType;
        const lByteLength: number = this.readUint32();
        const lBytes: Uint8Array = this.readBytes(lByteLength);

        // Get the constructor for this sub-type.
        const lConstructor = BlobSerializerValueDecoder.mTypedArrayConstructors.get(lSubType);
        if (lConstructor === undefined) {
            throw new Exception(`Unknown TypedArray sub-type: ${lSubType}`, this);
        }

        // Copy bytes into a fresh ArrayBuffer and create the typed array.
        const lBuffer: ArrayBuffer = new ArrayBuffer(lByteLength);
        new Uint8Array(lBuffer).set(lBytes);

        // Calculate element count from byte length and bytes per element.
        const lBytesPerElement: number = BlobSerializerValueDecoder.mTypedArrayBytesPerElement.get(lSubType)!;
        const lElementCount: number = lByteLength / lBytesPerElement;

        return new lConstructor(lBuffer, 0, lElementCount);
    }

    /**
     * Read raw bytes from the buffer and advance the offset.
     *
     * @param pLength - Number of bytes to read.
     */
    private readBytes(pLength: number): Uint8Array {
        const lBytes: Uint8Array = this.mBytes.subarray(this.mOffset, this.mOffset + pLength);
        this.mOffset += pLength;
        return lBytes;
    }

    /**
     * Read a float64 (little-endian) from the buffer and advance the offset.
     */
    private readFloat64(): number {
        const lValue: number = this.mDataView.getFloat64(this.mOffset, true);
        this.mOffset += 8;
        return lValue;
    }

    /**
     * Read a UTF-8 string from the buffer.
     *
     * @param pByteLength - Number of bytes of the UTF-8 encoded string.
     */
    private readString(pByteLength: number): string {
        const lBytes: Uint8Array = this.readBytes(pByteLength);
        return BlobSerializerValueDecoder.mTextDecoder.decode(lBytes);
    }

    /**
     * Read a uint16 (little-endian) from the buffer and advance the offset.
     */
    private readUint16(): number {
        const lValue: number = this.mDataView.getUint16(this.mOffset, true);
        this.mOffset += 2;
        return lValue;
    }

    /**
     * Read a uint32 (little-endian) from the buffer and advance the offset.
     */
    private readUint32(): number {
        const lValue: number = this.mDataView.getUint32(this.mOffset, true);
        this.mOffset += 4;
        return lValue;
    }

    /**
     * Read a uint8 from the buffer and advance the offset.
     */
    private readUint8(): number {
        const lValue: number = this.mDataView.getUint8(this.mOffset);
        this.mOffset += 1;
        return lValue;
    }
}
