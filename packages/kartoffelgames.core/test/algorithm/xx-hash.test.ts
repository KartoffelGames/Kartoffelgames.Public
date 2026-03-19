import { expect } from '@std/expect';
import { XxHash } from '../../source/algorithm/xx-hash.ts';

/**
 * Generate the standard xxHash test buffer.
 * Uses the deterministic generator from the xxHash reference implementation.
 * @param pLength - Number of bytes to generate.
 */
function generateTestBuffer(pLength: number): Uint8Array {
    const lBuffer: Uint8Array = new Uint8Array(pLength);
    const lPrimeSixtyFour: bigint = 11400714785074694797n;
    const lMaskSixtyFour: bigint = (1n << 64n) - 1n;

    let lByteGenerator: bigint = 2654435761n;
    for (let lIndex: number = 0; lIndex < pLength; lIndex++) {
        lBuffer[lIndex] = Number((lByteGenerator >> 56n) & 0xFFn);
        lByteGenerator = (lByteGenerator * lPrimeSixtyFour) & lMaskSixtyFour;
    }

    return lBuffer;
}

Deno.test('XxHash.hash()', async (pContext) => {
    await pContext.step('Hash empty input with seed zero', () => {
        // Setup.
        const lHasher: XxHash = new XxHash(0);
        const lData: Uint8Array = generateTestBuffer(0);

        // Process.
        const lResult: number = lHasher.hash(lData);

        // Evaluation.
        expect(lResult).toBe(0x02CC5D05);
    });

    await pContext.step('Hash single byte input with seed zero', () => {
        // Setup.
        const lHasher: XxHash = new XxHash(0);
        const lData: Uint8Array = generateTestBuffer(1);

        // Process.
        const lResult: number = lHasher.hash(lData);

        // Evaluation.
        expect(lResult).toBe(0xCF65B03E);
    });

    await pContext.step('Hash 14-byte input with seed zero', () => {
        // Setup.
        const lHasher: XxHash = new XxHash(0);
        const lData: Uint8Array = generateTestBuffer(14);

        // Process.
        const lResult: number = lHasher.hash(lData);

        // Evaluation.
        expect(lResult).toBe(0x1208E7E2);
    });

    await pContext.step('Hash 222-byte input with seed zero', () => {
        // Setup.
        const lHasher: XxHash = new XxHash(0);
        const lData: Uint8Array = generateTestBuffer(222);

        // Process.
        const lResult: number = lHasher.hash(lData);

        // Evaluation.
        expect(lResult).toBe(0x5BD11DBD);
    });

    await pContext.step('Hash empty input with prime seed', () => {
        // Setup.
        const lHasher: XxHash = new XxHash(2654435761);
        const lData: Uint8Array = generateTestBuffer(0);

        // Process.
        const lResult: number = lHasher.hash(lData);

        // Evaluation.
        expect(lResult).toBe(0x36B78AE7);
    });

    await pContext.step('Hash single byte input with prime seed', () => {
        // Setup.
        const lHasher: XxHash = new XxHash(2654435761);
        const lData: Uint8Array = generateTestBuffer(1);

        // Process.
        const lResult: number = lHasher.hash(lData);

        // Evaluation.
        expect(lResult).toBe(0xB4545AA4);
    });

    await pContext.step('Hash 14-byte input with prime seed', () => {
        // Setup.
        const lHasher: XxHash = new XxHash(2654435761);
        const lData: Uint8Array = generateTestBuffer(14);

        // Process.
        const lResult: number = lHasher.hash(lData);

        // Evaluation.
        expect(lResult).toBe(0x6AF1D1FE);
    });

    await pContext.step('Hash 222-byte input with prime seed', () => {
        // Setup.
        const lHasher: XxHash = new XxHash(2654435761);
        const lData: Uint8Array = generateTestBuffer(222);

        // Process.
        const lResult: number = lHasher.hash(lData);

        // Evaluation.
        expect(lResult).toBe(0x58803C5F);
    });

    await pContext.step('Produce consistent hash for same input', () => {
        // Setup.
        const lHasher: XxHash = new XxHash(0);
        const lData: Uint8Array = generateTestBuffer(100);

        // Process.
        const lResultFirst: number = lHasher.hash(lData);
        const lResultSecond: number = lHasher.hash(lData);

        // Evaluation.
        expect(lResultFirst).toBe(lResultSecond);
    });

    await pContext.step('Produce different hashes for different seeds', () => {
        // Setup.
        const lHasherOne: XxHash = new XxHash(0);
        const lHasherTwo: XxHash = new XxHash(1);
        const lData: Uint8Array = generateTestBuffer(50);

        // Process.
        const lResultOne: number = lHasherOne.hash(lData);
        const lResultTwo: number = lHasherTwo.hash(lData);

        // Evaluation.
        expect(lResultOne).not.toBe(lResultTwo);
    });
});
