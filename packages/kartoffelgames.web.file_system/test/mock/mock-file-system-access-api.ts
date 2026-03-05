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
    public readonly kind: 'file' = 'file';
    public readonly name: string;
    private mData: Blob;

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
 * Mock directory handle that stores files and subdirectories in memory.
 */
export class MockDirectoryHandle {
    public readonly kind: 'directory' = 'directory';
    public readonly name: string;
    private readonly mDirectories: Map<string, MockDirectoryHandle>;
    private readonly mFiles: Map<string, MockFileHandle>;

    public constructor(pName: string = 'mock-root') {
        this.name = pName;
        this.mFiles = new Map();
        this.mDirectories = new Map();
    }

    public async getDirectoryHandle(pName: string, pOptions?: { create?: boolean }): Promise<MockDirectoryHandle> {
        const lExisting: MockDirectoryHandle | undefined = this.mDirectories.get(pName);
        if (lExisting) {
            return lExisting;
        }

        if (pOptions?.create) {
            const lHandle: MockDirectoryHandle = new MockDirectoryHandle(pName);
            this.mDirectories.set(pName, lHandle);
            return lHandle;
        }

        throw new DOMException(`Directory not found: ${pName}`, 'NotFoundError');
    }

    public async getFileHandle(pName: string, pOptions?: { create?: boolean }): Promise<MockFileHandle> {
        const lExisting: MockFileHandle | undefined = this.mFiles.get(pName);
        if (lExisting) {
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
        if (this.mFiles.has(pName)) {
            this.mFiles.delete(pName);
            return;
        }

        if (this.mDirectories.has(pName)) {
            this.mDirectories.delete(pName);
            return;
        }

        throw new DOMException(`Entry not found: ${pName}`, 'NotFoundError');
    }

    /**
     * Async iterator that yields [name, handle] entries for all files and directories.
     */
    public entries(): AsyncIterableIterator<[string, MockFileHandle | MockDirectoryHandle]> {
        const lEntries: Array<[string, MockFileHandle | MockDirectoryHandle]> = [];

        for (const [lName, lHandle] of this.mFiles) {
            lEntries.push([lName, lHandle]);
        }

        for (const [lName, lHandle] of this.mDirectories) {
            lEntries.push([lName, lHandle]);
        }

        let lIndex: number = 0;
        return {
            next(): Promise<IteratorResult<[string, MockFileHandle | MockDirectoryHandle]>> {
                if (lIndex < lEntries.length) {
                    return Promise.resolve({ value: lEntries[lIndex++], done: false });
                }
                return Promise.resolve({ value: undefined, done: true });
            },
            [Symbol.asyncIterator]() {
                return this;
            }
        };
    }
}
