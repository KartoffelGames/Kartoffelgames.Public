import { expect } from '@kartoffelgames/core-test';
import { ByteUtil } from '../../source/util/byte-util.ts';

Deno.test('ByteUtil.byteToByte()', async (pContext) => {
    await pContext.step('Unsigned byte', () => {
        // Setup.
        const lInput: number = 300;

        // Process.
        const lResult: number = ByteUtil.byteToByte(lInput);

        // Evaluation.
        expect(lResult).toBe(44); // 300 & 0xff = 44
    });

    await pContext.step('Signed byte', () => {
        // Setup.
        const lInput: number = 200;

        // Process.
        const lResult: number = ByteUtil.byteToByte(lInput, true);

        // Evaluation.
        expect(lResult).toBe(-56); // 200 - 0x100 = -56
    });

    await pContext.step('Signed byte with value > 127', () => {
        // Setup.
        const lInput: number = 200;

        // Process.
        const lResult: number = ByteUtil.byteToByte(lInput, true);

        // Evaluation.
        expect(lResult).toBe(-56); // 200 - 0x100 = -56
    });
});

Deno.test('ByteUtil.byteToNibble()', async (pContext) => {
    await pContext.step('Unsigned nibbles', () => {
        // Setup.
        const lInput: number = 255;

        // Process.
        const lResult: [number, number] = ByteUtil.byteToNibble(lInput);

        // Evaluation.
        expect(lResult).toBeDeepEqual([15, 15]); // High = 0xf, Low = 0xf
    });

    await pContext.step('Signed nibbles', () => {
        // Setup.
        const lInput: number = 255;

        // Process.
        const lResult: [number, number] = ByteUtil.byteToNibble(lInput, true);

        // Evaluation.
        expect(lResult).toBeDeepEqual([-1, -1]); // High = -1, Low = -1
    });

    await pContext.step('Signed nibbles with high and low > 7', () => {
        // Setup.
        const lInput: number = 255;

        // Process.
        const lResult: [number, number] = ByteUtil.byteToNibble(lInput, true);

        // Evaluation.
        expect(lResult).toBeDeepEqual([-1, -1]); // High = -1, Low = -1
    });
});

Deno.test('ByteUtil.byteToString()', async (pContext) => {
    await pContext.step('Filter empty value', () => {
        // Setup.
        const lInput: Uint8Array = new Uint8Array([72, 101, 108, 108, 111, 0]);
        const lEmptyValue: number = 0;

        // Process.
        const lResult: string = ByteUtil.byteToString(lInput, lEmptyValue);

        // Evaluation.
        expect(lResult).toBe('Hello');
    });

    await pContext.step('No empty value filtering', () => {
        // Setup.
        const lInput: Uint8Array = new Uint8Array([72, 101, 108, 108, 111]);

        // Process.
        const lResult: string = ByteUtil.byteToString(lInput);

        // Evaluation.
        expect(lResult).toBe('Hello');
    });
});

Deno.test('ByteUtil.byteToWorld()', async (pContext) => {
    await pContext.step('Unsigned word', () => {
        // Setup.
        const lHighByte: number = 1;
        const lLowByte: number = 255;

        // Process.
        const lResult: number = ByteUtil.byteToWorld(lHighByte, lLowByte);

        // Evaluation.
        expect(lResult).toBe(511); // (1 << 8) + 255 = 511
    });

    await pContext.step('Signed word', () => {
        // Setup.
        const lHighByte: number = 255;
        const lLowByte: number = 255;

        // Process.
        const lResult: number = ByteUtil.byteToWorld(lHighByte, lLowByte, true);

        // Evaluation.
        expect(lResult).toBe(-1); // 0xffff - 0x10000 = -1
    });

    await pContext.step('Signed word with value > 32767', () => {
        // Setup.
        const lHighByte: number = 128;
        const lLowByte: number = 0;

        // Process.
        const lResult: number = ByteUtil.byteToWorld(lHighByte, lLowByte, true);

        // Evaluation.
        expect(lResult).toBe(-32768); // 0x8000 - 0x10000 = -32768
    });
});

Deno.test('ByteUtil.concatBytes()', async (pContext) => {
    await pContext.step('Concatenate bytes', () => {
        // Setup.
        const lInput: Uint8Array = new Uint8Array([1, 2, 3]);

        // Process.
        const lResult: bigint = ByteUtil.concatBytes(lInput);

        // Evaluation.
        expect(lResult).toBe(0x010203n); // BigInt concatenation
    });

    await pContext.step('Empty array', () => {
        // Setup.
        const lInput: Uint8Array = new Uint8Array([]);

        // Process.
        const lResult: bigint = ByteUtil.concatBytes(lInput);

        // Evaluation.
        expect(lResult).toBe(0n);
    });
});

Deno.test('ByteUtil.pickBits()', async (pContext) => {
    await pContext.step('Pick specific bits', () => {
        // Setup.
        const lBits: bigint = 0b10101010n;
        const lBitCount: number = 8;
        const lBitList: Array<number> = [0, 2, 4, 6];

        // Process.
        const lResult: bigint = ByteUtil.pickBits(lBits, lBitCount, lBitList);

        // Evaluation.
        expect(lResult).toBe(0b1111n); // Picks bits 0, 2, 4, 6
    });

    await pContext.step('No bits to pick', () => {
        // Setup.
        const lBits: bigint = 0b10101010n;
        const lBitCount: number = 8;
        const lBitList: Array<number> = [];

        // Process.
        const lResult: bigint = ByteUtil.pickBits(lBits, lBitCount, lBitList);

        // Evaluation.
        expect(lResult).toBe(0n);
    });

    await pContext.step('Pick bits with no match', () => {
        // Setup.
        const lBits: bigint = 0b00000000n;
        const lBitCount: number = 8;
        const lBitList: Array<number> = [0, 1, 2, 3];

        // Process.
        const lResult: bigint = ByteUtil.pickBits(lBits, lBitCount, lBitList);

        // Evaluation.
        expect(lResult).toBe(0n); // No bits match
    });

    await pContext.step('Pick bits with match', () => {
        // Setup.
        const lBits: bigint = 0b10101010n;
        const lBitCount: number = 8;
        const lBitList: Array<number> = [1, 3, 5, 7];

        // Process.
        const lResult: bigint = ByteUtil.pickBits(lBits, lBitCount, lBitList);

        // Evaluation.
        expect(lResult).toBe(0b1111n); // Picks bits 1, 3, 5, 7
    });
});

Deno.test('ByteUtil.readBytes()', async (pContext) => {
    await pContext.step('Read subset of bytes', () => {
        // Setup.
        const lData: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const lOffset: number = 1;
        const lLength: number = 3;

        // Process.
        const lResult: Uint8Array = ByteUtil.readBytes(lData, lOffset, lLength);

        // Evaluation.
        expect(lResult).toBeDeepEqual(new Uint8Array([2, 3, 4]));
    });

    await pContext.step('Read beyond bounds', () => {
        // Setup.
        const lData: Uint8Array = new Uint8Array([1, 2, 3]);
        const lOffset: number = 2;
        const lLength: number = 5;

        // Process.
        const lResult: Uint8Array = ByteUtil.readBytes(lData, lOffset, lLength);

        // Evaluation.
        expect(lResult).toBeDeepEqual(new Uint8Array([3]));
    });
});