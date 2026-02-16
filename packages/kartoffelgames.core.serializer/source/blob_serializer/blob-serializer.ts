import { Exception, type IVoidParameterConstructor } from '@kartoffelgames/core';
import { Serializer } from '../core/serializer.ts';
import { BlobSerializerValueEncoder } from './blob-serializer-value-encoder.ts';
import { BlobSerializerValueDecoder } from './blob-serializer-value-decoder.ts';

/**
 * Instance-based serializer for reading/writing class objects from/to Blob.
 * Objects are stored at user-defined paths (e.g. "MyFolder/SubFolder/MyClass").
 * Paths are case-insensitive and normalized to lowercase.
 *
 * Reading from a loaded blob uses partial reads via Blob.slice()
 * to minimize memory usage.
 *
 * Binary Layout:
 *
 * HEADER (16 bytes):
 * | Offset | Size | Description                                |
 * |--------|------|--------------------------------------------|
 * | 0      | 4    | Magic number 0x4B475342 ("KGSB"), uint32 LE|
 * | 4      | 2    | Format version, uint16 LE                  |
 * | 6      | 2    | Reserved flags, uint16 LE                  |
 * | 8      | 4    | Table of content byte offset, uint32 LE    |
 * | 12     | 4    | Entry count, uint32 LE                     |
 *
 * DATA ENTRIES (variable, starts at byte 16):
 * | Offset | Size | Description                                |
 * |--------|------|--------------------------------------------|
 * | 16     | var  | Entry 0 encoded data (ValueEncoder output) |
 * | ...    | var  | Entry N encoded data                       |
 *
 * TABLE OF CONTENT (repeated per entry):
 * | Offset | Size | Description                                |
 * |--------|------|--------------------------------------------|
 * | +0     | 2    | Path byte length P, uint16 LE              |
 * | +2     | P    | Path UTF-8 bytes                           |
 * | +2+P   | 4    | Data byte offset in blob, uint32 LE        |
 * | +6+P   | 4    | Data byte size, uint32 LE                  |
 */
export class BlobSerializer {
    private static readonly FORMAT_VERSION: number = 1;
    private static readonly HEADER_BYTE_SIZE: number = 16;
    private static readonly MAGIC_NUMBER: number = 0x4B475342; // `KGSB` (KartoffelGames Serializer Binary)

    /**
     * Read the UUID from the first bytes of an encoded entry.
     * Entry data starts with: tag (1 byte) + uuid byte length (2 bytes, uint16 LE) + uuid UTF-8 bytes.
     *
     * @param pBlob - The source blob.
     * @param pDataOffset - Byte offset of the entry data in the blob.
     *
     * @returns the UUID string.
     */
    private static async readEntryUuid(pBlob: Blob, pDataOffset: number): Promise<string> {
        // Read tag (1 byte) + uuid byte length (2 bytes).
        const lHeader: Uint8Array = await BlobSerializer.sliceToUint8Array(pBlob, pDataOffset, 3);
        const lUuidByteLength: number = new DataView(lHeader.buffer).getUint16(1, true);

        // Read uuid string bytes.
        const lUuidBytes: Uint8Array = await BlobSerializer.sliceToUint8Array(pBlob, pDataOffset + 3, lUuidByteLength);
        return new TextDecoder().decode(lUuidBytes);
    }

    /**
     * Read the file header from a Blob.
     *
     * @param pBlob - The blob to read from.
     *
     * @returns parsed header data.
     */
    private static async readHeader(pBlob: Blob): Promise<BlobSerializerFileHeader> {
        const lBytes: Uint8Array = await BlobSerializer.sliceToUint8Array(pBlob, 0, BlobSerializer.HEADER_BYTE_SIZE);
        const lView: DataView = new DataView(lBytes.buffer);

        return {
            entryCount: lView.getUint32(12, true),
            flags: lView.getUint16(6, true),
            magicNumber: lView.getUint32(0, true),
            tableOfContentOffset: lView.getUint32(8, true),
            version: lView.getUint16(4, true),
        };
    }

    /**
     * Read and parse the table of content section from a Blob.
     *
     * @param pBlob - The blob.
     * @param pTableOfContentOffset - Byte offset to the table of content.
     * @param pEntryCount - Number of entries to read.
     *
     * @returns parsed table of content entries.
     */
    private static async readTableOfContent(pBlob: Blob, pTableOfContentOffset: number, pEntryCount: number): Promise<BlobSerializerTableOfContent> {
        const lTableOfContentSize: number = pBlob.size - pTableOfContentOffset;
        const lTableOfContentBytes: Uint8Array = await BlobSerializer.sliceToUint8Array(pBlob, pTableOfContentOffset, lTableOfContentSize);
        const lTableOfContentByteView: DataView = new DataView(lTableOfContentBytes.buffer);
        const lTextDecoder: TextDecoder = new TextDecoder();

        const lEntries: BlobSerializerTableOfContent = new Array<BlobSerializerTableOfContentEntry>();
        let lOffset: number = 0;

        for (let lIndex: number = 0; lIndex < pEntryCount; lIndex++) {
            // Path length.
            const lPathByteLength: number = lTableOfContentByteView.getUint16(lOffset, true);
            lOffset += 2;

            // Path string (normalized to lowercase for case-insensitive matching).
            const lPathBytes: Uint8Array = lTableOfContentBytes.subarray(lOffset, lOffset + lPathByteLength);
            const lPath: string = lTextDecoder.decode(lPathBytes).toLowerCase();
            lOffset += lPathByteLength;

            // Data offset.
            const lDataOffset: number = lTableOfContentByteView.getUint32(lOffset, true);
            lOffset += 4;

            // Data size.
            const lDataSize: number = lTableOfContentByteView.getUint32(lOffset, true);
            lOffset += 4;

            lEntries.push({ dataOffset: lDataOffset, dataSize: lDataSize, path: lPath, uuid: '' });
        }

        return lEntries;
    }

    /**
     * Slice a section of a Blob and return it as a Uint8Array.
     *
     * @param pBlob - The source blob.
     * @param pOffset - Start byte offset.
     * @param pLength - Number of bytes.
     *
     * @returns Uint8Array of the sliced data.
     */
    private static async sliceToUint8Array(pBlob: Blob, pOffset: number, pLength: number): Promise<Uint8Array> {
        const lSlice: Blob = pBlob.slice(pOffset, pOffset + pLength);
        const lBuffer: ArrayBuffer = await lSlice.arrayBuffer();
        return new Uint8Array(lBuffer);
    }

    private mBlob: Blob | null;
    private readonly mEntries: Map<string, object>;
    private mTableOfContent: BlobSerializerTableOfContent | null;

    /**
     * Get the list of available contents in the loaded blob.
     * Each entry contains the path, byte length, and class type (constructor).
     *
     * @returns array of content entries. Empty when no blob is loaded.
     */
    public get contents(): Array<BlobContentEntry> {
        if (this.mTableOfContent === null) {
            return [];
        }

        return this.mTableOfContent.map((pEntry: BlobSerializerTableOfContentEntry) => ({
            byteLength: pEntry.dataSize,
            classType: Serializer.classOfUuid(pEntry.uuid),
            path: pEntry.path,
        }));
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mBlob = null;
        this.mTableOfContent = null;
        this.mEntries = new Map<string, object>();
    }

    /**
     * Load a blob for reading.
     * Reads the header, table of content, and entry UUIDs.
     * Entry data is not loaded until `read()` is called.
     *
     * @param pBlob - The blob to load.
     *
     * @throws Exception if the blob has invalid magic number bytes or unsupported version.
     */
    public async load(pBlob: Blob): Promise<void> {
        // Validate minimum size.
        if (pBlob.size < BlobSerializer.HEADER_BYTE_SIZE) {
            throw new Exception('Blob is too small to contain a valid serializer header.', this);
        }

        // Read header.
        const lHeader: BlobSerializerFileHeader = await BlobSerializer.readHeader(pBlob);

        // Validate magic number bytes.
        if (lHeader.magicNumber !== BlobSerializer.MAGIC_NUMBER) {
            throw new Exception(`Invalid blob magic number bytes: expected 0x${BlobSerializer.MAGIC_NUMBER.toString(16)}, got 0x${lHeader.magicNumber.toString(16)}.`, this);
        }

        // Validate version.
        if (lHeader.version !== BlobSerializer.FORMAT_VERSION) {
            throw new Exception(`Unsupported blob format version: ${lHeader.version}. Expected: ${BlobSerializer.FORMAT_VERSION}.`, this);
        }

        // Read table of content.
        this.mTableOfContent = await BlobSerializer.readTableOfContent(pBlob, lHeader.tableOfContentOffset, lHeader.entryCount);

        // Read UUID for each entry.
        for (const lEntry of this.mTableOfContent) {
            lEntry.uuid = await BlobSerializer.readEntryUuid(pBlob, lEntry.dataOffset);
        }

        this.mBlob = pBlob;
    }

    /**
     * Read a class instance from the loaded blob by path.
     * Path matching is case-insensitive.
     * Uses Blob.slice() to read only the needed bytes.
     *
     * @param pPath - The path of the entry to read.
     *
     * @returns the deserialized object.
     *
     * @throws Exception if no blob is loaded or the path is not found.
     */
    public async read<T>(pPath: string): Promise<T> {
        if (this.mBlob === null || this.mTableOfContent === null) {
            throw new Exception('No blob loaded. Call load() first.', this);
        }

        // Find the table of content entry for this path (case-insensitive).
        const lNormalizedPath: string = pPath.toLowerCase();
        const lEntry: BlobSerializerTableOfContentEntry | undefined = this.mTableOfContent.find((pEntry: BlobSerializerTableOfContentEntry) => pEntry.path === lNormalizedPath);
        if (lEntry === undefined) {
            throw new Exception(`Path "${pPath}" not found in blob.`, this);
        }

        // Slice only the entry's data from the blob.
        const lEntryData: Uint8Array = await BlobSerializer.sliceToUint8Array(this.mBlob, lEntry.dataOffset, lEntry.dataSize);

        // Decode.
        const lDecoder: BlobSerializerValueDecoder = new BlobSerializerValueDecoder(lEntryData);
        return lDecoder.decode() as T;
    }

    /**
     * Save all stored and loaded entries into a new Blob.
     * When a blob is loaded, its entries are included unless overridden by a `store()` call.
     *
     * @returns a Blob containing the complete binary file.
     */
    public async save(): Promise<Blob> {
        const lTextEncoder: TextEncoder = new TextEncoder();

        // Collect all encoded entries: loaded blob entries (not overridden) + stored entries.
        const lEncodedEntries: Array<{ data: Uint8Array; path: string }> = new Array<{ data: Uint8Array; path: string }>();

        // Include loaded blob entries that are not overridden by stored entries.
        if (this.mBlob !== null && this.mTableOfContent !== null) {
            for (const lTocEntry of this.mTableOfContent) {
                if (this.mEntries.has(lTocEntry.path)) {
                    continue;
                }

                const lData: Uint8Array = await BlobSerializer.sliceToUint8Array(this.mBlob, lTocEntry.dataOffset, lTocEntry.dataSize);
                lEncodedEntries.push({ data: lData, path: lTocEntry.path });
            }
        }

        // Encode and add stored entries.
        for (const [lPath, lObject] of this.mEntries) {
            const lEncoder: BlobSerializerValueEncoder = new BlobSerializerValueEncoder();
            const lData: Uint8Array = lEncoder.encode(lObject);
            lEncodedEntries.push({ data: lData, path: lPath });
        }

        // Calculate data section size and offsets.
        let lDataOffset: number = BlobSerializer.HEADER_BYTE_SIZE;
        const lTableOfContentEntries: BlobSerializerTableOfContent = new Array<BlobSerializerTableOfContentEntry>();

        for (const lEntry of lEncodedEntries) {
            lTableOfContentEntries.push({
                dataOffset: lDataOffset,
                dataSize: lEntry.data.byteLength,
                path: lEntry.path,
                uuid: '',
            });
            lDataOffset += lEntry.data.byteLength;
        }

        const lTableOfContentOffset: number = lDataOffset;

        // Build table of content bytes.
        const lTableOfContentParts: Array<Uint8Array> = new Array<Uint8Array>();
        for (const lTableOfContentEntry of lTableOfContentEntries) {
            const lPathBytes: Uint8Array = lTextEncoder.encode(lTableOfContentEntry.path);
            const lEntryBuffer: ArrayBuffer = new ArrayBuffer(2 + lPathBytes.byteLength + 4 + 4);
            const lEntryView: DataView = new DataView(lEntryBuffer);
            let lOffset: number = 0;

            // Path length.
            lEntryView.setUint16(lOffset, lPathBytes.byteLength, true);
            lOffset += 2;

            // Path bytes.
            new Uint8Array(lEntryBuffer, lOffset, lPathBytes.byteLength).set(lPathBytes);
            lOffset += lPathBytes.byteLength;

            // Data offset.
            lEntryView.setUint32(lOffset, lTableOfContentEntry.dataOffset, true);
            lOffset += 4;

            // Data size.
            lEntryView.setUint32(lOffset, lTableOfContentEntry.dataSize, true);

            lTableOfContentParts.push(new Uint8Array(lEntryBuffer));
        }

        // Build header.
        const lHeaderBuffer: ArrayBuffer = new ArrayBuffer(BlobSerializer.HEADER_BYTE_SIZE);
        const lHeaderView: DataView = new DataView(lHeaderBuffer);
        lHeaderView.setUint32(0, BlobSerializer.MAGIC_NUMBER, true);
        lHeaderView.setUint16(4, BlobSerializer.FORMAT_VERSION, true);
        lHeaderView.setUint16(6, 0, true); // reserved flags
        lHeaderView.setUint32(8, lTableOfContentOffset, true);
        lHeaderView.setUint32(12, lEncodedEntries.length, true);

        // Concatenate all parts: header + data entries + table of content.
        const lParts: Array<Uint8Array> = [new Uint8Array(lHeaderBuffer)];

        for (const lEntry of lEncodedEntries) {
            lParts.push(lEntry.data);
        }

        for (const lTableOfContentPart of lTableOfContentParts) {
            lParts.push(lTableOfContentPart);
        }

        // Calculate total size.
        let lTotalSize: number = 0;
        for (const lPart of lParts) {
            lTotalSize += lPart.byteLength;
        }

        // Combine into single buffer.
        const lCombined: Uint8Array = new Uint8Array(lTotalSize);
        let lCombinedOffset: number = 0;
        for (const lPart of lParts) {
            lCombined.set(lPart, lCombinedOffset);
            lCombinedOffset += lPart.byteLength;
        }

        return new Blob([lCombined.buffer as ArrayBuffer]);
    }

    /**
     * Store a serializable object at a path.
     * Path is normalized to lowercase for case-insensitive matching.
     *
     * @param pPath - The path to store the object at.
     * @param pObject - The serializable object to store.
     */
    public store(pPath: string, pObject: object): void {
        this.mEntries.set(pPath.toLowerCase(), pObject);
    }
}

/**
 * Entry describing available content in a loaded blob.
 */
export type BlobContentEntry = {
    byteLength: number;
    classType: IVoidParameterConstructor<object>;
    path: string;
};

/**
 * Parsed file header from a serializer blob.
 */
type BlobSerializerFileHeader = {
    entryCount: number;
    flags: number;
    magicNumber: number;
    tableOfContentOffset: number;
    version: number;
};

/**
 * Parsed table of contents entry.
 */
type BlobSerializerTableOfContent = Array<BlobSerializerTableOfContentEntry>;

type BlobSerializerTableOfContentEntry = {
    dataOffset: number;
    dataSize: number;
    path: string;
    uuid: string;
};
