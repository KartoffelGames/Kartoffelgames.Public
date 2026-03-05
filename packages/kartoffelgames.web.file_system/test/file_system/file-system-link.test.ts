import { BlobSerializer } from '@kartoffelgames/core-serializer';
import { expect } from '@kartoffelgames/core-test';
import { IndexDbFileSystem } from '@kartoffelgames/web-file-system';
import 'npm:fake-indexeddb/auto';
import { FileSystemLink } from '../../source/file-system-link.ts';
import { FileSystem, FileSystemReferenceType } from '../../source/file-system.ts';
import '../mock/structured-clone-blob-support.ts';

// Simple serializable test class.
@FileSystem.fileClass('b5931480-24c6-44cc-8479-f8c6883ba20f', FileSystemReferenceType.Instanced)
class SimpleTestObject {
    @FileSystem.fileProperty()
    public name: string = '';

    @FileSystem.fileProperty()
    public value: number = 0;
}

Deno.test('FileSystemLink', { sanitizeResources: false, sanitizeOps: false }, async (pContext) => {
    await pContext.step('Resolve link with path', async () => {
        // Setup.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lFileSystem: IndexDbFileSystem = new IndexDbFileSystem(lDatabaseName);

        const lObject: SimpleTestObject = new SimpleTestObject();
        lObject.name = 'LinkedObject';
        lObject.value = 55;
        await lFileSystem.writeFile('link/target', lObject);

        const lLink: FileSystemLink<SimpleTestObject> = FileSystemLink.fromPath<SimpleTestObject>('link/target');

        // Process.
        const lResult: SimpleTestObject = await lLink.resolve(lFileSystem);

        // Evaluation.
        expect(lResult).toBeInstanceOf(SimpleTestObject);
        expect(lResult.name).toBe('LinkedObject');
        expect(lResult.value).toBe(55);

        // Cleanup.
        lFileSystem.close();
    });

    await pContext.step('Resolve link with direct instance', async () => {
        // Setup.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lFileSystem: IndexDbFileSystem = new IndexDbFileSystem(lDatabaseName);

        const lObject: SimpleTestObject = new SimpleTestObject();
        lObject.name = 'DirectInstance';
        lObject.value = 77;

        const lLink: FileSystemLink<SimpleTestObject> = FileSystemLink.fromInstance<SimpleTestObject>(lObject);

        // Process.
        const lResult: SimpleTestObject = await lLink.resolve(lFileSystem);

        // Evaluation. Should return the exact same instance.
        expect(lResult).toBe(lObject);
        expect(lResult.name).toBe('DirectInstance');
        expect(lResult.value).toBe(77);

        // Cleanup.
        lFileSystem.close();
    });

    await pContext.step('Resolve link with path caches result', async () => {
        // Setup.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lFileSystem: IndexDbFileSystem = new IndexDbFileSystem(lDatabaseName);

        const lObject: SimpleTestObject = new SimpleTestObject();
        lObject.name = 'Cached';
        lObject.value = 10;
        await lFileSystem.writeFile('cache/test', lObject);

        const lLink: FileSystemLink<SimpleTestObject> = FileSystemLink.fromPath<SimpleTestObject>('cache/test');

        // Process. Resolve twice.
        const lFirst: SimpleTestObject = await lLink.resolve(lFileSystem);
        const lSecond: SimpleTestObject = await lLink.resolve(lFileSystem);

        // Evaluation. Both should be the same instance (cached).
        expect(lFirst).toBe(lSecond);

        // Cleanup.
        lFileSystem.close();
    });

    await pContext.step('Serialization round-trip preserves path', async () => {
        // Setup.
        const lLink: FileSystemLink<SimpleTestObject> = FileSystemLink.fromPath<SimpleTestObject>('my/stored/path');

        // Process. Serialize and deserialize.
        const lSerializer: BlobSerializer = new BlobSerializer();
        lSerializer.store('link', lLink);
        const lBlob: Blob = await lSerializer.save();

        const lDeserializer: BlobSerializer = new BlobSerializer();
        await lDeserializer.load(lBlob);
        const lRestoredLink: FileSystemLink<SimpleTestObject> = await lDeserializer.read<FileSystemLink<SimpleTestObject>>('link');

        // Evaluation.
        expect(lRestoredLink).toBeInstanceOf(FileSystemLink);
        expect(lRestoredLink.path).toBe('my/stored/path');
    });
});
