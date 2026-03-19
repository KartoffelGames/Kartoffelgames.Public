/**
 * Implementation of the xxHash32 non-cryptographic hash algorithm.
 *
 * @see {@link https://github.com/Cyan4973/xxHash/blob/dev/doc/xxhash_spec.md | xxHash specification}
 */
export class XxHash {
    private static readonly PRIME_ONE: number = 0x9E3779B1;
    private static readonly PRIME_TWO: number = 0x85EBCA77;
    private static readonly PRIME_THREE: number = 0xC2B2AE3D;
    private static readonly PRIME_FOUR: number = 0x27D4EB2F;
    private static readonly PRIME_FIVE: number = 0x165667B1;

    private readonly mSeed: number;

    /**
     * Constructor.
     * @param pSeed - Seed value for the hash function.
     */
    public constructor(pSeed: number) {
        this.mSeed = pSeed >>> 0;
    }

    /**
     * Compute the xxHash32 hash of the given data.
     * @param pData - Input data to hash.
     * @returns 32-bit hash value as unsigned integer.
     */
    public hash(pData: Uint8Array): number {
        const lDataLength: number = pData.length;
        let lHash: number;
        let lOffset: number = 0;

        // Process 16-byte stripes when input is large enough.
        if (lDataLength >= 16) {
            let lAccumulatorOne: number = (this.mSeed + XxHash.PRIME_ONE + XxHash.PRIME_TWO) >>> 0;
            let lAccumulatorTwo: number = (this.mSeed + XxHash.PRIME_TWO) >>> 0;
            let lAccumulatorThree: number = this.mSeed >>> 0;
            let lAccumulatorFour: number = (this.mSeed - XxHash.PRIME_ONE) >>> 0;

            const lStripeLimit: number = lDataLength - 16;
            while (lOffset <= lStripeLimit) {
                lAccumulatorOne = this.round(lAccumulatorOne, this.readUint32LittleEndian(pData, lOffset));
                lAccumulatorTwo = this.round(lAccumulatorTwo, this.readUint32LittleEndian(pData, lOffset + 4));
                lAccumulatorThree = this.round(lAccumulatorThree, this.readUint32LittleEndian(pData, lOffset + 8));
                lAccumulatorFour = this.round(lAccumulatorFour, this.readUint32LittleEndian(pData, lOffset + 12));
                lOffset += 16;
            }

            // Merge accumulators.
            lHash = (
                this.rotateLeft(lAccumulatorOne, 1)
                + this.rotateLeft(lAccumulatorTwo, 7)
                + this.rotateLeft(lAccumulatorThree, 12)
                + this.rotateLeft(lAccumulatorFour, 18)
            ) >>> 0;
        } else {
            lHash = (this.mSeed + XxHash.PRIME_FIVE) >>> 0;
        }

        // Add total input length.
        lHash = (lHash + lDataLength) >>> 0;

        // Process remaining 4-byte chunks.
        while (lOffset + 4 <= lDataLength) {
            lHash = (lHash + Math.imul(this.readUint32LittleEndian(pData, lOffset), XxHash.PRIME_THREE)) >>> 0;
            lHash = Math.imul(this.rotateLeft(lHash, 17), XxHash.PRIME_FOUR) >>> 0;
            lOffset += 4;
        }

        // Process remaining individual bytes.
        while (lOffset < lDataLength) {
            lHash = (lHash + Math.imul(pData[lOffset], XxHash.PRIME_FIVE)) >>> 0;
            lHash = Math.imul(this.rotateLeft(lHash, 11), XxHash.PRIME_ONE) >>> 0;
            lOffset++;
        }

        // Avalanche mixing.
        lHash ^= lHash >>> 15;
        lHash = Math.imul(lHash, XxHash.PRIME_TWO) >>> 0;
        lHash ^= lHash >>> 13;
        lHash = Math.imul(lHash, XxHash.PRIME_THREE) >>> 0;
        lHash ^= lHash >>> 16;

        return lHash >>> 0;
    }

    /**
     * Read a 32-bit unsigned integer from a byte array in little-endian order.
     * @param pData - Source byte array.
     * @param pOffset - Byte offset to read from.
     */
    private readUint32LittleEndian(pData: Uint8Array, pOffset: number): number {
        return (
            pData[pOffset]
            | (pData[pOffset + 1] << 8)
            | (pData[pOffset + 2] << 16)
            | (pData[pOffset + 3] << 24)
        ) >>> 0;
    }

    /**
     * Perform a single xxHash32 round operation.
     * @param pAccumulator - Current accumulator value.
     * @param pInput - Input lane value.
     */
    private round(pAccumulator: number, pInput: number): number {
        let lAccumulator: number = (pAccumulator + Math.imul(pInput, XxHash.PRIME_TWO)) >>> 0;
        lAccumulator = this.rotateLeft(lAccumulator, 13);
        lAccumulator = Math.imul(lAccumulator, XxHash.PRIME_ONE) >>> 0;
        return lAccumulator;
    }

    /**
     * Rotate a 32-bit unsigned integer left by the given number of bits.
     * @param pValue - Value to rotate.
     * @param pBits - Number of bits to rotate by.
     */
    private rotateLeft(pValue: number, pBits: number): number {
        return ((pValue << pBits) | (pValue >>> (32 - pBits))) >>> 0;
    }
}
