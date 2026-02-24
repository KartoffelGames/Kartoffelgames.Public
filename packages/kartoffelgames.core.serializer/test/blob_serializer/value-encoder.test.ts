import { expect } from '@kartoffelgames/core-test';
import { TypedArraySubType, ValueTypeTag } from '../../source/blob_serializer/blob-serializer-types.ts';
import { BlobSerializerValueSerializer } from '../../source/blob_serializer/blob-serializer-value-serializer.ts';
import { Serializer } from '../../source/core/serializer.ts';

Deno.test('BlobSerializerValueSerializer.serialize() - Primitives', async (pContext) => {
    await pContext.step('Encode null', () => {
        // Setup.
        const lEncoder: BlobSerializerValueSerializer = new BlobSerializerValueSerializer();

        // Process.
        const lResult: Uint8Array = lEncoder.serialize(null);

        // Evaluation.
        expect(lResult.length).toBe(1);
        expect(lResult[0]).toBe(ValueTypeTag.Null);
    });

    await pContext.step('Encode undefined as null', () => {
        // Setup.
        const lEncoder: BlobSerializerValueSerializer = new BlobSerializerValueSerializer();

        // Process.
        const lResult: Uint8Array = lEncoder.serialize(undefined);

        // Evaluation.
        expect(lResult.length).toBe(1);
        expect(lResult[0]).toBe(ValueTypeTag.Null);
    });

    await pContext.step('Encode boolean true', () => {
        // Setup.
        const lEncoder: BlobSerializerValueSerializer = new BlobSerializerValueSerializer();

        // Process.
        const lResult: Uint8Array = lEncoder.serialize(true);

        // Evaluation.
        expect(lResult.length).toBe(1);
        expect(lResult[0]).toBe(ValueTypeTag.BooleanTrue);
    });

    await pContext.step('Encode boolean false', () => {
        // Setup.
        const lEncoder: BlobSerializerValueSerializer = new BlobSerializerValueSerializer();

        // Process.
        const lResult: Uint8Array = lEncoder.serialize(false);

        // Evaluation.
        expect(lResult.length).toBe(1);
        expect(lResult[0]).toBe(ValueTypeTag.BooleanFalse);
    });

    await pContext.step('Encode number zero', () => {
        // Setup.
        const lEncoder: BlobSerializerValueSerializer = new BlobSerializerValueSerializer();

        // Process.
        const lResult: Uint8Array = lEncoder.serialize(0);

        // Evaluation.
        expect(lResult.length).toBe(9);
        expect(lResult[0]).toBe(ValueTypeTag.Number);
        const lView: DataView = new DataView(lResult.buffer, lResult.byteOffset);
        expect(lView.getFloat64(1, true)).toBe(0);
    });

    await pContext.step('Encode positive number', () => {
        // Setup.
        const lEncoder: BlobSerializerValueSerializer = new BlobSerializerValueSerializer();
        const lValue: number = 42.5;

        // Process.
        const lResult: Uint8Array = lEncoder.serialize(lValue);

        // Evaluation.
        expect(lResult.length).toBe(9);
        expect(lResult[0]).toBe(ValueTypeTag.Number);
        const lView: DataView = new DataView(lResult.buffer, lResult.byteOffset);
        expect(lView.getFloat64(1, true)).toBe(lValue);
    });

    await pContext.step('Encode negative number', () => {
        // Setup.
        const lEncoder: BlobSerializerValueSerializer = new BlobSerializerValueSerializer();
        const lValue: number = -123.456;

        // Process.
        const lResult: Uint8Array = lEncoder.serialize(lValue);

        // Evaluation.
        const lView: DataView = new DataView(lResult.buffer, lResult.byteOffset);
        expect(lView.getFloat64(1, true)).toBe(lValue);
    });

    await pContext.step('Encode NaN', () => {
        // Setup.
        const lEncoder: BlobSerializerValueSerializer = new BlobSerializerValueSerializer();

        // Process.
        const lResult: Uint8Array = lEncoder.serialize(NaN);

        // Evaluation.
        const lView: DataView = new DataView(lResult.buffer, lResult.byteOffset);
        expect(Number.isNaN(lView.getFloat64(1, true))).toBeTruthy();
    });

    await pContext.step('Encode Infinity', () => {
        // Setup.
        const lEncoder: BlobSerializerValueSerializer = new BlobSerializerValueSerializer();

        // Process.
        const lResult: Uint8Array = lEncoder.serialize(Infinity);

        // Evaluation.
        const lView: DataView = new DataView(lResult.buffer, lResult.byteOffset);
        expect(lView.getFloat64(1, true)).toBe(Infinity);
    });
});

Deno.test('ValueEncoder.serialize() - String', async (pContext) => {
    await pContext.step('Encode empty string', () => {
        // Setup.
        const lEncoder: BlobSerializerValueSerializer = new BlobSerializerValueSerializer();

        // Process.
        const lResult: Uint8Array = lEncoder.serialize('');

        // Evaluation.
        expect(lResult[0]).toBe(ValueTypeTag.String);
        const lView: DataView = new DataView(lResult.buffer, lResult.byteOffset);
        expect(lView.getUint32(1, true)).toBe(0);
        expect(lResult.length).toBe(5);
    });

    await pContext.step('Encode ASCII string', () => {
        // Setup.
        const lEncoder: BlobSerializerValueSerializer = new BlobSerializerValueSerializer();
        const lValue: string = 'Hello';
        const lExpectedBytes: Uint8Array = new TextEncoder().encode(lValue);

        // Process.
        const lResult: Uint8Array = lEncoder.serialize(lValue);

        // Evaluation.
        expect(lResult[0]).toBe(ValueTypeTag.String);
        const lView: DataView = new DataView(lResult.buffer, lResult.byteOffset);
        expect(lView.getUint32(1, true)).toBe(lExpectedBytes.byteLength);
        const lStringBytes: Uint8Array = lResult.subarray(5);
        expect(new TextDecoder().decode(lStringBytes)).toBe(lValue);
    });

    await pContext.step('Encode Unicode string', () => {
        // Setup.
        const lEncoder: BlobSerializerValueSerializer = new BlobSerializerValueSerializer();
        const lValue: string = 'Kartoffel\u00E4\u00F6\u00FC';

        // Process.
        const lResult: Uint8Array = lEncoder.serialize(lValue);

        // Evaluation.
        expect(lResult[0]).toBe(ValueTypeTag.String);
        const lView: DataView = new DataView(lResult.buffer, lResult.byteOffset);
        const lByteLength: number = lView.getUint32(1, true);
        const lStringBytes: Uint8Array = lResult.subarray(5, 5 + lByteLength);
        expect(new TextDecoder().decode(lStringBytes)).toBe(lValue);
    });
});

Deno.test('ValueEncoder.serialize() - Array', async (pContext) => {
    await pContext.step('Encode empty array', () => {
        // Setup.
        const lEncoder: BlobSerializerValueSerializer = new BlobSerializerValueSerializer();

        // Process.
        const lResult: Uint8Array = lEncoder.serialize([]);

        // Evaluation.
        expect(lResult[0]).toBe(ValueTypeTag.Array);
        const lView: DataView = new DataView(lResult.buffer, lResult.byteOffset);
        expect(lView.getUint32(1, true)).toBe(0);
        expect(lResult.length).toBe(5);
    });

    await pContext.step('Encode array with mixed types', () => {
        // Setup.
        const lEncoder: BlobSerializerValueSerializer = new BlobSerializerValueSerializer();
        const lValue: Array<unknown> = [42, 'hello', true, null];

        // Process.
        const lResult: Uint8Array = lEncoder.serialize(lValue);

        // Evaluation.
        expect(lResult[0]).toBe(ValueTypeTag.Array);
        const lView: DataView = new DataView(lResult.buffer, lResult.byteOffset);
        expect(lView.getUint32(1, true)).toBe(4);
    });

    await pContext.step('Encode nested array', () => {
        // Setup.
        const lEncoder: BlobSerializerValueSerializer = new BlobSerializerValueSerializer();
        const lValue: Array<unknown> = [[1, 2], [3, 4]];

        // Process.
        const lResult: Uint8Array = lEncoder.serialize(lValue);

        // Evaluation.
        expect(lResult[0]).toBe(ValueTypeTag.Array);
        const lView: DataView = new DataView(lResult.buffer, lResult.byteOffset);
        expect(lView.getUint32(1, true)).toBe(2); // 2 inner arrays
    });
});

Deno.test('ValueEncoder.serialize() - ArrayBuffer', async (pContext) => {
    await pContext.step('Encode ArrayBuffer', () => {
        // Setup.
        const lEncoder: BlobSerializerValueSerializer = new BlobSerializerValueSerializer();
        const lBuffer: ArrayBuffer = new ArrayBuffer(4);
        new Uint8Array(lBuffer).set([0x01, 0x02, 0x03, 0x04]);

        // Process.
        const lResult: Uint8Array = lEncoder.serialize(lBuffer);

        // Evaluation.
        expect(lResult[0]).toBe(ValueTypeTag.ArrayBuffer);
        const lView: DataView = new DataView(lResult.buffer, lResult.byteOffset);
        expect(lView.getUint32(1, true)).toBe(4);
        expect(lResult[5]).toBe(0x01);
        expect(lResult[6]).toBe(0x02);
        expect(lResult[7]).toBe(0x03);
        expect(lResult[8]).toBe(0x04);
    });

    await pContext.step('Encode empty ArrayBuffer', () => {
        // Setup.
        const lEncoder: BlobSerializerValueSerializer = new BlobSerializerValueSerializer();
        const lBuffer: ArrayBuffer = new ArrayBuffer(0);

        // Process.
        const lResult: Uint8Array = lEncoder.serialize(lBuffer);

        // Evaluation.
        expect(lResult[0]).toBe(ValueTypeTag.ArrayBuffer);
        const lView: DataView = new DataView(lResult.buffer, lResult.byteOffset);
        expect(lView.getUint32(1, true)).toBe(0);
        expect(lResult.length).toBe(5);
    });
});

Deno.test('ValueEncoder.serialize() - TypedArray', async (pContext) => {
    await pContext.step('Encode Uint8Array', () => {
        // Setup.
        const lEncoder: BlobSerializerValueSerializer = new BlobSerializerValueSerializer();
        const lValue: Uint8Array = new Uint8Array([10, 20, 30]);

        // Process.
        const lResult: Uint8Array = lEncoder.serialize(lValue);

        // Evaluation.
        expect(lResult[0]).toBe(ValueTypeTag.TypedArray);
        expect(lResult[1]).toBe(TypedArraySubType.Uint8Array);
        const lView: DataView = new DataView(lResult.buffer, lResult.byteOffset);
        expect(lView.getUint32(2, true)).toBe(3);
    });

    await pContext.step('Encode Float32Array', () => {
        // Setup.
        const lEncoder: BlobSerializerValueSerializer = new BlobSerializerValueSerializer();
        const lValue: Float32Array = new Float32Array([1.5, 2.5]);

        // Process.
        const lResult: Uint8Array = lEncoder.serialize(lValue);

        // Evaluation.
        expect(lResult[0]).toBe(ValueTypeTag.TypedArray);
        expect(lResult[1]).toBe(TypedArraySubType.Float32Array);
        const lView: DataView = new DataView(lResult.buffer, lResult.byteOffset);
        expect(lView.getUint32(2, true)).toBe(8); // 2 elements * 4 bytes
    });

    await pContext.step('Encode Int16Array', () => {
        // Setup.
        const lEncoder: BlobSerializerValueSerializer = new BlobSerializerValueSerializer();
        const lValue: Int16Array = new Int16Array([-100, 200, -300]);

        // Process.
        const lResult: Uint8Array = lEncoder.serialize(lValue);

        // Evaluation.
        expect(lResult[0]).toBe(ValueTypeTag.TypedArray);
        expect(lResult[1]).toBe(TypedArraySubType.Int16Array);
    });

    await pContext.step('Encode BigInt64Array', () => {
        // Setup.
        const lEncoder: BlobSerializerValueSerializer = new BlobSerializerValueSerializer();
        const lValue: BigInt64Array = new BigInt64Array([1n, -2n]);

        // Process.
        const lResult: Uint8Array = lEncoder.serialize(lValue);

        // Evaluation.
        expect(lResult[0]).toBe(ValueTypeTag.TypedArray);
        expect(lResult[1]).toBe(TypedArraySubType.BigInt64Array);
        const lView: DataView = new DataView(lResult.buffer, lResult.byteOffset);
        expect(lView.getUint32(2, true)).toBe(16); // 2 elements * 8 bytes
    });
});

Deno.test('ValueEncoder.serialize() - Registered Object', async (pContext) => {
    await pContext.step('Encode registered object', () => {
        // Setup.
        const lUuid: string = 'enc-test-obj-1';

        @Serializer.serializeableClass(lUuid)
        class TestObj {
            @Serializer.property()
            public age: number = 30;

            @Serializer.property()
            public name: string = 'Alice';
        }

        const lEncoder: BlobSerializerValueSerializer = new BlobSerializerValueSerializer();
        const lObj: TestObj = new TestObj();

        // Process.
        const lResult: Uint8Array = lEncoder.serialize(lObj);

        // Evaluation.
        expect(lResult[0]).toBe(ValueTypeTag.Object);
        // UUID length.
        const lView: DataView = new DataView(lResult.buffer, lResult.byteOffset);
        const lUuidLength: number = lView.getUint16(1, true);
        expect(lUuidLength).toBe(new TextEncoder().encode(lUuid).byteLength);
    });

    await pContext.step('Encode registered object with alias', () => {
        // Setup.
        const lUuid: string = 'enc-test-obj-alias';

        @Serializer.serializeableClass(lUuid)
        class TestObj {
            @Serializer.property({ alias: 'n' })
            public name: string = 'Bob';
        }

        const lEncoder: BlobSerializerValueSerializer = new BlobSerializerValueSerializer();
        const lObj: TestObj = new TestObj();

        // Process.
        const lResult: Uint8Array = lEncoder.serialize(lObj);

        // Evaluation.
        expect(lResult[0]).toBe(ValueTypeTag.Object);
        // The alias 'n' should be used in binary, not 'name'.
        const lDecoded: string = new TextDecoder().decode(lResult);
        expect(lDecoded.includes('n')).toBeTruthy();
    });

    await pContext.step('Only serialize decorated properties', () => {
        // Setup.
        const lUuid: string = 'enc-test-obj-partial';

        @Serializer.serializeableClass(lUuid)
        class TestObj {
            @Serializer.property()
            public serialized: string = 'yes';

            public notSerialized: string = 'no';
        }

        const lEncoder: BlobSerializerValueSerializer = new BlobSerializerValueSerializer();
        const lObj: TestObj = new TestObj();

        // Process.
        const lResult: Uint8Array = lEncoder.serialize(lObj);

        // Evaluation.
        expect(lResult[0]).toBe(ValueTypeTag.Object);
        // Property count should be 1.
        const lView: DataView = new DataView(lResult.buffer, lResult.byteOffset);
        const lUuidLength: number = lView.getUint16(1, true);
        const lPropCount: number = lView.getUint32(3 + lUuidLength, true);
        expect(lPropCount).toBe(1);
    });

    await pContext.step('Throw on unregistered object', () => {
        // Setup.
        const lEncoder: BlobSerializerValueSerializer = new BlobSerializerValueSerializer();
        const lObj: object = { key: 'value' };

        // Process.
        const lIllegalInstruction = () => {
            lEncoder.serialize(lObj);
        };

        // Evaluation.
        expect(lIllegalInstruction).toThrow('Object of type "Object" is not registered as serializable. Apply @Serializer.class() decorator.');
    });
});

Deno.test('ValueEncoder.serialize() - Circular Reference', async (pContext) => {
    await pContext.step('Throw on circular array reference', () => {
        // Setup.
        const lEncoder: BlobSerializerValueSerializer = new BlobSerializerValueSerializer();
        const lArray: Array<unknown> = [];
        lArray.push(lArray);

        // Process.
        const lIllegalInstruction = () => {
            lEncoder.serialize(lArray);
        };

        // Evaluation.
        expect(lIllegalInstruction).toThrow('Circular reference detected during serialization.');
    });

    await pContext.step('Throw on circular object reference', () => {
        // Setup.
        const lUuid: string = 'enc-test-circular-obj';

        @Serializer.serializeableClass(lUuid)
        class CircularObj {
            @Serializer.property()
            public self: CircularObj | null = null;
        }

        const lEncoder: BlobSerializerValueSerializer = new BlobSerializerValueSerializer();
        const lObj: CircularObj = new CircularObj();
        lObj.self = lObj;

        // Process.
        const lIllegalInstruction = () => {
            lEncoder.serialize(lObj);
        };

        // Evaluation.
        expect(lIllegalInstruction).toThrow('Circular reference detected during serialization.');
    });

    await pContext.step('Allow shared references (non-circular)', () => {
        // Setup.
        const lUuid1: string = 'enc-test-shared-inner';
        const lUuid2: string = 'enc-test-shared-outer';

        @Serializer.serializeableClass(lUuid1)
        class Inner {
            @Serializer.property()
            public value: number = 42;
        }

        @Serializer.serializeableClass(lUuid2)
        class Outer {
            @Serializer.property()
            public a: Inner = new Inner();

            @Serializer.property()
            public b: Inner = new Inner();
        }

        const lEncoder: BlobSerializerValueSerializer = new BlobSerializerValueSerializer();
        const lShared: Inner = new Inner();
        const lOuter: Outer = new Outer();
        lOuter.a = lShared;
        lOuter.b = lShared;

        // Process. Should not throw because shared references are not circular.
        const lResult: Uint8Array = lEncoder.serialize(lOuter);

        // Evaluation.
        expect(lResult.length).toBeGreaterThan(0);
    });

    await pContext.step('Throw on unsupported type (function)', () => {
        // Setup.
        const lEncoder: BlobSerializerValueSerializer = new BlobSerializerValueSerializer();

        // Process.
        const lIllegalInstruction = () => {
            lEncoder.serialize((() => { }) as unknown);
        };

        // Evaluation.
        expect(lIllegalInstruction).toThrow('Unsupported value type: function');
    });
});
