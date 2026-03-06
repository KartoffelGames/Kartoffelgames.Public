import { expect } from '@kartoffelgames/core-test';
import { IndexDbFileSystem } from '@kartoffelgames/web-file-system';
import 'npm:fake-indexeddb/auto';
import { FileSystem, FileSystemFileType, FileSystemReferenceType, type FileSystemItem } from '../../source/file-system.ts';
import '../mock/structured-clone-blob-support.ts';

// Simple serializable test class (Instanced).
@FileSystem.fileClass('b5931480-24c6-44cc-8479-f8c6883ba20f', FileSystemReferenceType.Instanced)
class SimpleTestObject {
    @FileSystem.fileProperty()
    public name: string = '';

    @FileSystem.fileProperty()
    public value: number = 0;
}

// Nested serializable test class (Instanced).
@FileSystem.fileClass('a8cf87b1-0877-4089-858a-ab297eb76d85', FileSystemReferenceType.Instanced)
class NestedTestObject {
    @FileSystem.fileProperty()
    public child: SimpleTestObject | null = null;

    @FileSystem.fileProperty()
    public label: string = '';
}

// Singleton serializable test class.
@FileSystem.fileClass('c3d4e5f6-7890-1234-abcd-ef0123456789', FileSystemReferenceType.Singleton)
class SingletonTestObject {
    @FileSystem.fileProperty()
    public name: string = '';

    @FileSystem.fileProperty()
    public value: number = 0;
}

// Sanitize disabled because timers are started outside of the test in fake-indexeddb.
Deno.test('IndexDbFileSystem.writeFile()', { sanitizeResources: false, sanitizeOps: false }, async (pContext) => {
    await pContext.step('Store and read a single object', async () => {
        // Setup.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lFileSystem: IndexDbFileSystem = new IndexDbFileSystem(lDatabaseName);

        const lObject: SimpleTestObject = new SimpleTestObject();
        lObject.name = 'TestName';
        lObject.value = 42;

        // Process.
        await lFileSystem.writeFile('my/path/class', lObject);

        // Evaluation. Read it back to verify it was stored.
        const lResult: SimpleTestObject = await lFileSystem.read<SimpleTestObject>('my/path/class');
        expect(lResult.name).toBe('TestName');
        expect(lResult.value).toBe(42);

        // Cleanup.
        lFileSystem.close();
    });

    await pContext.step('Store overwrites existing entry at same path', async () => {
        // Setup.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lFileSystem: IndexDbFileSystem = new IndexDbFileSystem(lDatabaseName);

        const lFirst: SimpleTestObject = new SimpleTestObject();
        lFirst.name = 'First';
        lFirst.value = 1;

        const lSecond: SimpleTestObject = new SimpleTestObject();
        lSecond.name = 'Second';
        lSecond.value = 2;

        // Process. Store then overwrite.
        await lFileSystem.writeFile('same/path', lFirst);
        await lFileSystem.writeFile('same/path', lSecond);

        // Evaluation. Should return the second object.
        const lResult: SimpleTestObject = await lFileSystem.read<SimpleTestObject>('same/path');
        expect(lResult.name).toBe('Second');
        expect(lResult.value).toBe(2);

        // Cleanup.
        lFileSystem.close();
    });

    await pContext.step('Store is case-insensitive', async () => {
        // Setup.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lFileSystem: IndexDbFileSystem = new IndexDbFileSystem(lDatabaseName);

        const lObject: SimpleTestObject = new SimpleTestObject();
        lObject.name = 'CaseTest';
        lObject.value = 7;

        // Process. Store with mixed case.
        await lFileSystem.writeFile('My/Path/Class', lObject);

        // Evaluation. Read with lowercase.
        const lResult: SimpleTestObject = await lFileSystem.read<SimpleTestObject>('my/path/class');
        expect(lResult.name).toBe('CaseTest');
        expect(lResult.value).toBe(7);

        // Cleanup.
        lFileSystem.close();
    });

    await pContext.step('Store nested object', async () => {
        // Setup.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lFileSystem: IndexDbFileSystem = new IndexDbFileSystem(lDatabaseName);

        const lChild: SimpleTestObject = new SimpleTestObject();
        lChild.name = 'ChildName';
        lChild.value = 99;

        const lParent: NestedTestObject = new NestedTestObject();
        lParent.label = 'ParentLabel';
        lParent.child = lChild;

        // Process.
        await lFileSystem.writeFile('nested/object', lParent);

        // Evaluation.
        const lResult: NestedTestObject = await lFileSystem.read<NestedTestObject>('nested/object');
        expect(lResult.label).toBe('ParentLabel');
        expect(lResult.child).not.toBeNull();
        expect(lResult.child!.name).toBe('ChildName');
        expect(lResult.child!.value).toBe(99);

        // Cleanup.
        lFileSystem.close();
    });
});

// Sanitize disabled because timers are started outside of the test in fake-indexeddb.
Deno.test('IndexDbFileSystem.read()', { sanitizeResources: false, sanitizeOps: false }, async (pContext) => {
    await pContext.step('Read stored object', async () => {
        // Setup.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lFileSystem: IndexDbFileSystem = new IndexDbFileSystem(lDatabaseName);

        const lObject: SimpleTestObject = new SimpleTestObject();
        lObject.name = 'ReadTest';
        lObject.value = 7;
        await lFileSystem.writeFile('read/test', lObject);

        // Process.
        const lResult: SimpleTestObject = await lFileSystem.read<SimpleTestObject>('read/test');

        // Evaluation.
        expect(lResult).toBeInstanceOf(SimpleTestObject);
        expect(lResult.name).toBe('ReadTest');
        expect(lResult.value).toBe(7);

        // Cleanup.
        lFileSystem.close();
    });

    await pContext.step('Read is case-insensitive', async () => {
        // Setup.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lFileSystem: IndexDbFileSystem = new IndexDbFileSystem(lDatabaseName);

        const lObject: SimpleTestObject = new SimpleTestObject();
        lObject.name = 'CaseTest';
        lObject.value = 3;
        await lFileSystem.writeFile('My/Path', lObject);

        // Process.
        const lResult: SimpleTestObject = await lFileSystem.read<SimpleTestObject>('my/path');

        // Evaluation.
        expect(lResult.name).toBe('CaseTest');

        // Cleanup.
        lFileSystem.close();
    });

    await pContext.step('Read non-existent path throws', async () => {
        // Setup.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lFileSystem: IndexDbFileSystem = new IndexDbFileSystem(lDatabaseName);

        // Process & Evaluation.
        let lError: Error | null = null;
        try {
            await lFileSystem.read<SimpleTestObject>('does/not/exist');
        } catch (pError) {
            lError = pError as Error;
        }

        expect(lError).not.toBeNull();

        // Cleanup.
        lFileSystem.close();
    });

    await pContext.step('Read multiple different paths', async () => {
        // Setup.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lFileSystem: IndexDbFileSystem = new IndexDbFileSystem(lDatabaseName);

        const lFirst: SimpleTestObject = new SimpleTestObject();
        lFirst.name = 'First';
        lFirst.value = 1;

        const lSecond: SimpleTestObject = new SimpleTestObject();
        lSecond.name = 'Second';
        lSecond.value = 2;

        await lFileSystem.writeFile('path/one', lFirst);
        await lFileSystem.writeFile('path/two', lSecond);

        // Process.
        const lResultOne: SimpleTestObject = await lFileSystem.read<SimpleTestObject>('path/one');
        const lResultTwo: SimpleTestObject = await lFileSystem.read<SimpleTestObject>('path/two');

        // Evaluation.
        expect(lResultOne.name).toBe('First');
        expect(lResultOne.value).toBe(1);
        expect(lResultTwo.name).toBe('Second');
        expect(lResultTwo.value).toBe(2);

        // Cleanup.
        lFileSystem.close();
    });
});

// Sanitize disabled because timers are started outside of the test in fake-indexeddb.
Deno.test('IndexDbFileSystem singleton caching', { sanitizeResources: false, sanitizeOps: false }, async (pContext) => {
    await pContext.step('Singleton: reading same path twice returns same instance', async () => {
        // Setup.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lFileSystem: IndexDbFileSystem = new IndexDbFileSystem(lDatabaseName);

        const lObject: SingletonTestObject = new SingletonTestObject();
        lObject.name = 'Singleton';
        lObject.value = 1;

        await lFileSystem.writeFile('singleton/path', lObject);

        // Process.
        const lFirst: SingletonTestObject = await lFileSystem.read<SingletonTestObject>('singleton/path');
        const lSecond: SingletonTestObject = await lFileSystem.read<SingletonTestObject>('singleton/path');

        // Evaluation. Both reads should return the exact same object reference.
        expect(lFirst).toBe(lSecond);

        // Cleanup.
        lFileSystem.close();
    });

    await pContext.step('Singleton: different paths return different instances', async () => {
        // Setup.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lFileSystem: IndexDbFileSystem = new IndexDbFileSystem(lDatabaseName);

        const lObjectA: SingletonTestObject = new SingletonTestObject();
        lObjectA.name = 'A';
        lObjectA.value = 1;

        const lObjectB: SingletonTestObject = new SingletonTestObject();
        lObjectB.name = 'B';
        lObjectB.value = 2;

        await lFileSystem.writeFile('singleton/a', lObjectA);
        await lFileSystem.writeFile('singleton/b', lObjectB);

        // Process.
        const lResultA: SingletonTestObject = await lFileSystem.read<SingletonTestObject>('singleton/a');
        const lResultB: SingletonTestObject = await lFileSystem.read<SingletonTestObject>('singleton/b');

        // Evaluation. Different paths should yield different instances.
        expect(lResultA).not.toBe(lResultB);
        expect(lResultA.name).toBe('A');
        expect(lResultB.name).toBe('B');

        // Cleanup.
        lFileSystem.close();
    });

    await pContext.step('Singleton: cache is case-insensitive', async () => {
        // Setup.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lFileSystem: IndexDbFileSystem = new IndexDbFileSystem(lDatabaseName);

        const lObject: SingletonTestObject = new SingletonTestObject();
        lObject.name = 'CaseSingleton';
        lObject.value = 7;

        await lFileSystem.writeFile('Singleton/Case', lObject);

        // Process. Read with different casings.
        const lFirst: SingletonTestObject = await lFileSystem.read<SingletonTestObject>('singleton/case');
        const lSecond: SingletonTestObject = await lFileSystem.read<SingletonTestObject>('SINGLETON/CASE');

        // Evaluation. Both should be the same cached instance.
        expect(lFirst).toBe(lSecond);

        // Cleanup.
        lFileSystem.close();
    });

    await pContext.step('Singleton: cache is per IndexDbFileSystem instance', async () => {
        // Setup.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lFileSystemA: IndexDbFileSystem = new IndexDbFileSystem(lDatabaseName);
        const lFileSystemB: IndexDbFileSystem = new IndexDbFileSystem(lDatabaseName);

        const lObject: SingletonTestObject = new SingletonTestObject();
        lObject.name = 'PerInstance';
        lObject.value = 3;

        await lFileSystemA.writeFile('singleton/instance', lObject);

        // Process.
        const lResultA: SingletonTestObject = await lFileSystemA.read<SingletonTestObject>('singleton/instance');
        const lResultB: SingletonTestObject = await lFileSystemB.read<SingletonTestObject>('singleton/instance');

        // Evaluation. Different IndexDbFileSystem instances should have independent caches.
        expect(lResultA).not.toBe(lResultB);
        expect(lResultA.name).toBe('PerInstance');
        expect(lResultB.name).toBe('PerInstance');

        // Cleanup.
        lFileSystemA.close();
        lFileSystemB.close();
    });

    await pContext.step('Instanced: reading same path twice returns different instances', async () => {
        // Setup.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lFileSystem: IndexDbFileSystem = new IndexDbFileSystem(lDatabaseName);

        const lObject: SimpleTestObject = new SimpleTestObject();
        lObject.name = 'Instanced';
        lObject.value = 5;

        await lFileSystem.writeFile('instanced/path', lObject);

        // Process.
        const lFirst: SimpleTestObject = await lFileSystem.read<SimpleTestObject>('instanced/path');
        const lSecond: SimpleTestObject = await lFileSystem.read<SimpleTestObject>('instanced/path');

        // Evaluation. Instanced classes should return different object references.
        expect(lFirst).not.toBe(lSecond);
        expect(lFirst.name).toBe('Instanced');
        expect(lSecond.name).toBe('Instanced');

        // Cleanup.
        lFileSystem.close();
    });
});

// Sanitize disabled because timers are started outside of the test in fake-indexeddb.
Deno.test('IndexDbFileSystem.delete()', { sanitizeResources: false, sanitizeOps: false }, async (pContext) => {
    await pContext.step('Delete file by path', async () => {
        // Setup.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lFileSystem: IndexDbFileSystem = new IndexDbFileSystem(lDatabaseName);

        const lObject: SimpleTestObject = new SimpleTestObject();
        lObject.name = 'ToDelete';
        lObject.value = 1;
        await lFileSystem.writeFile('file/entry', lObject);

        // Process.
        const lResult: boolean = await lFileSystem.delete('file/entry');

        // Evaluation.
        expect(lResult).toBe(true);

        let lError: Error | null = null;
        try {
            await lFileSystem.read<SimpleTestObject>('file/entry');
        } catch (pError) {
            lError = pError as Error;
        }
        expect(lError).not.toBeNull();

        // Cleanup.
        lFileSystem.close();
    });

    await pContext.step('Delete non-existent path returns false', async () => {
        // Setup.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lFileSystem: IndexDbFileSystem = new IndexDbFileSystem(lDatabaseName);

        // Process.
        const lResult: boolean = await lFileSystem.delete('does/not/exist');

        // Evaluation.
        expect(lResult).toBe(false);

        // Cleanup.
        lFileSystem.close();
    });

    await pContext.step('Delete is case-insensitive', async () => {
        // Setup.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lFileSystem: IndexDbFileSystem = new IndexDbFileSystem(lDatabaseName);

        const lObject: SimpleTestObject = new SimpleTestObject();
        lObject.name = 'CaseDelete';
        lObject.value = 5;
        await lFileSystem.writeFile('Case/Path', lObject);

        // Process. Delete with different casing.
        const lResult: boolean = await lFileSystem.delete('case/path');

        // Evaluation.
        expect(lResult).toBe(true);
        expect(await lFileSystem.has('case/path')).toBe(false);

        // Cleanup.
        lFileSystem.close();
    });

    await pContext.step('Delete file leaves empty parent directories intact', async () => {
        // Setup.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lFileSystem: IndexDbFileSystem = new IndexDbFileSystem(lDatabaseName);

        const lObject: SimpleTestObject = new SimpleTestObject();
        lObject.name = 'Nested';
        lObject.value = 1;
        await lFileSystem.writeFile('a/b/c', lObject);

        // Process. Delete the only file in the tree.
        await lFileSystem.delete('a/b/c');

        // Evaluation. Parent directories should still exist as empty directories.
        expect(await lFileSystem.has('a/b')).toBe(true);
        expect(await lFileSystem.has('a')).toBe(true);

        // Cleanup.
        lFileSystem.close();
    });

    await pContext.step('Delete file preserves sibling files', async () => {
        // Setup.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lFileSystem: IndexDbFileSystem = new IndexDbFileSystem(lDatabaseName);

        const lFirst: SimpleTestObject = new SimpleTestObject();
        lFirst.name = 'Keep';
        lFirst.value = 1;

        const lSecond: SimpleTestObject = new SimpleTestObject();
        lSecond.name = 'Remove';
        lSecond.value = 2;

        await lFileSystem.writeFile('dir/keep', lFirst);
        await lFileSystem.writeFile('dir/remove', lSecond);

        // Process.
        await lFileSystem.delete('dir/remove');

        // Evaluation. Sibling should be intact.
        const lResult: SimpleTestObject = await lFileSystem.read<SimpleTestObject>('dir/keep');
        expect(lResult.name).toBe('Keep');

        // Cleanup.
        lFileSystem.close();
    });
});

// Sanitize disabled because timers are started outside of the test in fake-indexeddb.
Deno.test('IndexDbFileSystem.delete() directories', { sanitizeResources: false, sanitizeOps: false }, async (pContext) => {
    await pContext.step('Delete directory and all its contents', async () => {
        // Setup.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lFileSystem: IndexDbFileSystem = new IndexDbFileSystem(lDatabaseName);

        const lObj1: SimpleTestObject = new SimpleTestObject();
        lObj1.name = 'One';
        lObj1.value = 1;

        const lObj2: SimpleTestObject = new SimpleTestObject();
        lObj2.name = 'Two';
        lObj2.value = 2;

        await lFileSystem.writeFile('dir/file1', lObj1);
        await lFileSystem.writeFile('dir/sub/file2', lObj2);

        // Process.
        const lResult: boolean = await lFileSystem.delete('dir');

        // Evaluation.
        expect(lResult).toBe(true);
        expect(await lFileSystem.has('dir/file1')).toBe(false);
        expect(await lFileSystem.has('dir/sub/file2')).toBe(false);
        expect(await lFileSystem.has('dir')).toBe(false);

        // Cleanup.
        lFileSystem.close();
    });

    await pContext.step('Delete non-existent directory returns false', async () => {
        // Setup.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lFileSystem: IndexDbFileSystem = new IndexDbFileSystem(lDatabaseName);

        // Process.
        const lResult: boolean = await lFileSystem.delete('does/not/exist');

        // Evaluation.
        expect(lResult).toBe(false);

        // Cleanup.
        lFileSystem.close();
    });

    await pContext.step('Delete directory is case-insensitive', async () => {
        // Setup.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lFileSystem: IndexDbFileSystem = new IndexDbFileSystem(lDatabaseName);

        const lObject: SimpleTestObject = new SimpleTestObject();
        lObject.name = 'CaseDir';
        lObject.value = 1;
        await lFileSystem.writeFile('MyDir/file', lObject);

        // Process. Delete with different casing.
        const lResult: boolean = await lFileSystem.delete('mydir');

        // Evaluation.
        expect(lResult).toBe(true);
        expect(await lFileSystem.has('mydir/file')).toBe(false);

        // Cleanup.
        lFileSystem.close();
    });

    await pContext.step('Delete directory preserves sibling directories', async () => {
        // Setup.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lFileSystem: IndexDbFileSystem = new IndexDbFileSystem(lDatabaseName);

        const lObj1: SimpleTestObject = new SimpleTestObject();
        lObj1.name = 'Keep';
        lObj1.value = 1;

        const lObj2: SimpleTestObject = new SimpleTestObject();
        lObj2.name = 'Remove';
        lObj2.value = 2;

        await lFileSystem.writeFile('keep/file', lObj1);
        await lFileSystem.writeFile('remove/file', lObj2);

        // Process.
        await lFileSystem.delete('remove');

        // Evaluation.
        const lResult: SimpleTestObject = await lFileSystem.read<SimpleTestObject>('keep/file');
        expect(lResult.name).toBe('Keep');

        // Cleanup.
        lFileSystem.close();
    });

    await pContext.step('Delete directory leaves empty parent directories intact', async () => {
        // Setup.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lFileSystem: IndexDbFileSystem = new IndexDbFileSystem(lDatabaseName);

        const lObject: SimpleTestObject = new SimpleTestObject();
        lObject.name = 'Deep';
        lObject.value = 1;
        await lFileSystem.writeFile('a/b/c/d', lObject);

        // Process. Delete the 'b' directory.
        await lFileSystem.delete('a/b');

        // Evaluation. 'a' should still exist as an empty directory.
        expect(await lFileSystem.has('a')).toBe(true);

        // Cleanup.
        lFileSystem.close();
    });
});

// Sanitize disabled because timers are started outside of the test in fake-indexeddb.
Deno.test('IndexDbFileSystem.has()', { sanitizeResources: false, sanitizeOps: false }, async (pContext) => {
    await pContext.step('Returns true for existing file path', async () => {
        // Setup.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lFileSystem: IndexDbFileSystem = new IndexDbFileSystem(lDatabaseName);

        const lObject: SimpleTestObject = new SimpleTestObject();
        lObject.name = 'HasTest';
        lObject.value = 1;
        await lFileSystem.writeFile('my/path', lObject);

        // Process.
        const lResult: boolean = await lFileSystem.has('my/path');

        // Evaluation.
        expect(lResult).toBe(true);

        // Cleanup.
        lFileSystem.close();
    });

    await pContext.step('Returns true for existing directory path', async () => {
        // Setup.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lFileSystem: IndexDbFileSystem = new IndexDbFileSystem(lDatabaseName);

        const lObject: SimpleTestObject = new SimpleTestObject();
        lObject.name = 'HasDir';
        lObject.value = 1;
        await lFileSystem.writeFile('parent/child', lObject);

        // Process.
        const lResult: boolean = await lFileSystem.has('parent');

        // Evaluation.
        expect(lResult).toBe(true);

        // Cleanup.
        lFileSystem.close();
    });

    await pContext.step('Returns false for non-existent path', async () => {
        // Setup.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lFileSystem: IndexDbFileSystem = new IndexDbFileSystem(lDatabaseName);

        // Process.
        const lResult: boolean = await lFileSystem.has('does/not/exist');

        // Evaluation.
        expect(lResult).toBe(false);

        // Cleanup.
        lFileSystem.close();
    });

    await pContext.step('Is case-insensitive', async () => {
        // Setup.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lFileSystem: IndexDbFileSystem = new IndexDbFileSystem(lDatabaseName);

        const lObject: SimpleTestObject = new SimpleTestObject();
        lObject.name = 'CaseHas';
        lObject.value = 4;
        await lFileSystem.writeFile('My/Path', lObject);

        // Process.
        const lResult: boolean = await lFileSystem.has('my/path');

        // Evaluation.
        expect(lResult).toBe(true);

        // Cleanup.
        lFileSystem.close();
    });
});

// Sanitize disabled because timers are started outside of the test in fake-indexeddb.
Deno.test('IndexDbFileSystem.readDirectory()', { sanitizeResources: false, sanitizeOps: false }, async (pContext) => {
    await pContext.step('Lists immediate children as files', async () => {
        // Setup.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lFileSystem: IndexDbFileSystem = new IndexDbFileSystem(lDatabaseName);

        const lFirst: SimpleTestObject = new SimpleTestObject();
        lFirst.name = 'Alpha';
        lFirst.value = 1;

        const lSecond: SimpleTestObject = new SimpleTestObject();
        lSecond.name = 'Beta';
        lSecond.value = 2;

        await lFileSystem.writeFile('parent/alpha', lFirst);
        await lFileSystem.writeFile('parent/beta', lSecond);

        // Process.
        const lResult: Array<FileSystemItem> = await lFileSystem.readDirectory('parent');

        // Evaluation.
        expect(lResult.length).toBe(2);

        const lAlpha: FileSystemItem | undefined = lResult.find((pItem) => pItem.name === 'alpha');
        const lBeta: FileSystemItem | undefined = lResult.find((pItem) => pItem.name === 'beta');

        expect(lAlpha).not.toBeUndefined();
        expect(lAlpha!.type).toBe(FileSystemFileType.File);
        expect(lAlpha!.path).toBe('parent/alpha');

        expect(lBeta).not.toBeUndefined();
        expect(lBeta!.type).toBe(FileSystemFileType.File);
        expect(lBeta!.path).toBe('parent/beta');

        // Cleanup.
        lFileSystem.close();
    });

    await pContext.step('Lists intermediate segments as directories', async () => {
        // Setup.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lFileSystem: IndexDbFileSystem = new IndexDbFileSystem(lDatabaseName);

        const lObject: SimpleTestObject = new SimpleTestObject();
        lObject.name = 'Deep';
        lObject.value = 1;
        await lFileSystem.writeFile('root/middle/leaf', lObject);

        // Process.
        const lResult: Array<FileSystemItem> = await lFileSystem.readDirectory('root');

        // Evaluation.
        expect(lResult.length).toBe(1);
        expect(lResult[0].name).toBe('middle');
        expect(lResult[0].type).toBe(FileSystemFileType.Directory);
        expect(lResult[0].path).toBe('root/middle');
        expect(lResult[0].classType).toBeNull();

        // Cleanup.
        lFileSystem.close();
    });

    await pContext.step('File items have correct classType', async () => {
        // Setup.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lFileSystem: IndexDbFileSystem = new IndexDbFileSystem(lDatabaseName);

        const lObject: SimpleTestObject = new SimpleTestObject();
        lObject.name = 'ClassType';
        lObject.value = 1;
        await lFileSystem.writeFile('typed/item', lObject);

        // Process.
        const lResult: Array<FileSystemItem> = await lFileSystem.readDirectory('typed');

        // Evaluation.
        expect(lResult.length).toBe(1);
        expect(lResult[0].type).toBe(FileSystemFileType.File);
        expect(lResult[0].classType).toBe(SimpleTestObject);

        // Cleanup.
        lFileSystem.close();
    });

    await pContext.step('Directory items have null classType', async () => {
        // Setup.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lFileSystem: IndexDbFileSystem = new IndexDbFileSystem(lDatabaseName);

        const lObject: SimpleTestObject = new SimpleTestObject();
        lObject.name = 'Nested';
        lObject.value = 1;
        await lFileSystem.writeFile('a/b/c', lObject);

        // Process.
        const lResult: Array<FileSystemItem> = await lFileSystem.readDirectory('a');

        // Evaluation.
        expect(lResult.length).toBe(1);
        expect(lResult[0].type).toBe(FileSystemFileType.Directory);
        expect(lResult[0].classType).toBeNull();

        // Cleanup.
        lFileSystem.close();
    });

    await pContext.step('Returns empty array for non-existent prefix', async () => {
        // Setup.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lFileSystem: IndexDbFileSystem = new IndexDbFileSystem(lDatabaseName);

        // Process.
        const lResult: Array<FileSystemItem> = await lFileSystem.readDirectory('does/not/exist');

        // Evaluation.
        expect(lResult.length).toBe(0);

        // Cleanup.
        lFileSystem.close();
    });

    await pContext.step('Is case-insensitive', async () => {
        // Setup.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lFileSystem: IndexDbFileSystem = new IndexDbFileSystem(lDatabaseName);

        const lObject: SimpleTestObject = new SimpleTestObject();
        lObject.name = 'CaseContent';
        lObject.value = 1;
        await lFileSystem.writeFile('Parent/Child', lObject);

        // Process. Query with different casing.
        const lResult: Array<FileSystemItem> = await lFileSystem.readDirectory('parent');

        // Evaluation.
        expect(lResult.length).toBe(1);
        expect(lResult[0].name).toBe('Child');

        // Cleanup.
        lFileSystem.close();
    });

    await pContext.step('Writing to a path through a file segment throws', async () => {
        // Setup.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lFileSystem: IndexDbFileSystem = new IndexDbFileSystem(lDatabaseName);

        const lFileObject: SimpleTestObject = new SimpleTestObject();
        lFileObject.name = 'FileAtPath';
        lFileObject.value = 1;

        // Store an object directly at 'a/b'.
        await lFileSystem.writeFile('a/b', lFileObject);

        // Process & Evaluation. Storing at 'a/b/c' should throw because 'b' is a file, not a directory.
        let lError: Error | null = null;
        try {
            const lChildObject: SimpleTestObject = new SimpleTestObject();
            lChildObject.name = 'ChildOfPath';
            lChildObject.value = 2;
            await lFileSystem.writeFile('a/b/c', lChildObject);
        } catch (pError) {
            lError = pError as Error;
        }

        expect(lError).not.toBeNull();

        // Cleanup.
        lFileSystem.close();
    });

    await pContext.step('Works at root level with empty string', async () => {
        // Setup.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lFileSystem: IndexDbFileSystem = new IndexDbFileSystem(lDatabaseName);

        const lObject: SimpleTestObject = new SimpleTestObject();
        lObject.name = 'Root';
        lObject.value = 1;
        await lFileSystem.writeFile('top/level/item', lObject);

        // Process.
        const lResult: Array<FileSystemItem> = await lFileSystem.readDirectory('');

        // Evaluation. 'top' should be a directory at the root.
        expect(lResult.length).toBe(1);
        expect(lResult[0].name).toBe('top');
        expect(lResult[0].type).toBe(FileSystemFileType.Directory);
        expect(lResult[0].path).toBe('top');

        // Cleanup.
        lFileSystem.close();
    });

    await pContext.step('Handles multiple items under same prefix', async () => {
        // Setup.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lFileSystem: IndexDbFileSystem = new IndexDbFileSystem(lDatabaseName);

        const lObject1: SimpleTestObject = new SimpleTestObject();
        lObject1.name = 'One';
        lObject1.value = 1;

        const lObject2: SimpleTestObject = new SimpleTestObject();
        lObject2.name = 'Two';
        lObject2.value = 2;

        const lObject3: SimpleTestObject = new SimpleTestObject();
        lObject3.name = 'Three';
        lObject3.value = 3;

        await lFileSystem.writeFile('root/file1', lObject1);
        await lFileSystem.writeFile('root/file2', lObject2);
        await lFileSystem.writeFile('root/dir/nested', lObject3);

        // Process.
        const lResult: Array<FileSystemItem> = await lFileSystem.readDirectory('root');

        // Evaluation. Should have file1, file2 as Files and dir as Directory.
        expect(lResult.length).toBe(3);

        const lFile1: FileSystemItem | undefined = lResult.find((pItem) => pItem.name === 'file1');
        const lFile2: FileSystemItem | undefined = lResult.find((pItem) => pItem.name === 'file2');
        const lDir: FileSystemItem | undefined = lResult.find((pItem) => pItem.name === 'dir');

        expect(lFile1).not.toBeUndefined();
        expect(lFile1!.type).toBe(FileSystemFileType.File);

        expect(lFile2).not.toBeUndefined();
        expect(lFile2!.type).toBe(FileSystemFileType.File);

        expect(lDir).not.toBeUndefined();
        expect(lDir!.type).toBe(FileSystemFileType.Directory);

        // Cleanup.
        lFileSystem.close();
    });
});

// Sanitize disabled because timers are started outside of the test in fake-indexeddb.
Deno.test('IndexDbFileSystem.fileClass()', { sanitizeResources: false, sanitizeOps: false }, async (pContext) => {
    await pContext.step('Classes decorated with fileClass are serializable', async () => {
        // Setup.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lFileSystem: IndexDbFileSystem = new IndexDbFileSystem(lDatabaseName);

        const lObject: SimpleTestObject = new SimpleTestObject();
        lObject.name = 'DecoratorTest';
        lObject.value = 42;

        // Process. Store and read back.
        await lFileSystem.writeFile('decorator/test', lObject);
        const lResult: SimpleTestObject = await lFileSystem.read<SimpleTestObject>('decorator/test');

        // Evaluation.
        expect(lResult).toBeInstanceOf(SimpleTestObject);
        expect(lResult.name).toBe('DecoratorTest');
        expect(lResult.value).toBe(42);

        // Cleanup.
        lFileSystem.close();
    });
});
