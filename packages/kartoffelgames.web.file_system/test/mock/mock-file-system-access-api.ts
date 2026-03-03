/**
 * Mock implementation of the File System Access API for testing.
 * Simulates FileSystemDirectoryHandle, FileSystemFileHandle, and FileSystemWritableFileStream
 * using in-memory storage.
 */

/**
 * Mock writable stream that collects written data into a Blob.
 */
class MockWritableFileStream {
    private readonly mChunks: Array<BlobPart>;
    private readonly mOnClose: (pBlob: Blob) => void;

    public constructor(pOnClose: (pBlob: Blob) => void) {
        this.mChunks = [];
        this.mOnClose = pOnClose;
    }

    public async close(): Promise<void> {
        const lBlob: Blob = new Blob(this.mChunks);
        this.mOnClose(lBlob);
    }

    public async write(pData: BlobPart): Promise<void> {
        this.mChunks.push(pData);
    }
}

/**
 * Mock file handle that stores a single file's data.
 */
class MockFileHandle {
    private mData: Blob;
    public readonly name: string;

    public constructor(pName: string) {
        this.name = pName;
        this.mData = new Blob([]);
    }

    public async createWritable(): Promise<MockWritableFileStream> {
        return new MockWritableFileStream((pBlob: Blob) => {
            this.mData = pBlob;
        });
    }

    public async getFile(): Promise<File> {
        return new File([this.mData], this.name);
    }
}

/**
 * Mock directory handle that stores files in memory.
 */
export class MockDirectoryHandle {
    private readonly mFiles: Map<string, MockFileHandle>;
    public readonly name: string;

    public constructor(pName: string = 'mock-root') {
        this.name = pName;
        this.mFiles = new Map();
    }

    public async getFileHandle(pName: string, pOptions?: { create?: boolean }): Promise<MockFileHandle> {
        const lExisting: MockFileHandle | undefined = this.mFiles.get(pName);

        if (lExisting !== undefined) {
            return lExisting;
        }

        if (pOptions?.create) {
            const lHandle: MockFileHandle = new MockFileHandle(pName);
            this.mFiles.set(pName, lHandle);
            return lHandle;
        }

        throw new DOMException(`File not found: ${pName}`, 'NotFoundError');
    }

    public async removeEntry(pName: string): Promise<void> {
        if (!this.mFiles.has(pName)) {
            throw new DOMException(`Entry not found: ${pName}`, 'NotFoundError');
        }
        this.mFiles.delete(pName);
    }
}
