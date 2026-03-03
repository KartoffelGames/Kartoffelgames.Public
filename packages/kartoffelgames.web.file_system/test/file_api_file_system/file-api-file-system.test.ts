import { expect } from '@kartoffelgames/core-test';
import '../mock/structured-clone-blob-support.ts';
import { FileSystem, FileSystemReferenceType } from '../../source/file-system.ts';
import { FileApiFileSystem } from '../../source/file_api_file_system/file-api-file-system.ts';
import { MockDirectoryHandle } from '../mock/mock-file-system-access-api.ts';
import type { IFileSystem } from '../../source/i-file-system.ts';

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

Deno.test('FileApiFileSystem.store()', async (pContext) => {
    await pContext.step('Store and read a single-class object', async () => {
        // Setup.
        const lDirectoryHandle: MockDirectoryHandle = new MockDirectoryHandle();
        const lFileSystem: IFileSystem = new FileApiFileSystem(lDirectoryHandle as unknown as FileSystemDirectoryHandle);

        const lObject: SimpleTestObject = new SimpleTestObject();
        lObject.name = 'TestName';
        lObject.value = 42;

        // Process.
        await lFileSystem.store('my/path/class', lObject);

        // Evaluation. Read it back to verify it was stored.
        const lResult: SimpleTestObject = await lFileSystem.read<SimpleTestObject>('my/path/class');
        expect(lResult.name).toBe('TestName');
        expect(lResult.value).toBe(42);
    });

    await pContext.step('Store overwrites existing entry at same path', async () => {
        // Setup.
        const lDirectoryHandle: MockDirectoryHandle = new MockDirectoryHandle();
        const lFileSystem: IFileSystem = new FileApiFileSystem(lDirectoryHandle as unknown as FileSystemDirectoryHandle);

        const lFirst: SimpleTestObject = new SimpleTestObject();
        lFirst.name = 'First';
        lFirst.value = 1;

        const lSecond: SimpleTestObject = new SimpleTestObject();
        lSecond.name = 'Second';
        lSecond.value = 2;

        // Process. Store then overwrite.
        await lFileSystem.store('same/path', lFirst);
        await lFileSystem.store('same/path', lSecond);

        // Evaluation. Should return the second object.
        const lResult: SimpleTestObject = await lFileSystem.read<SimpleTestObject>('same/path');
        expect(lResult.name).toBe('Second');
        expect(lResult.value).toBe(2);
    });

    await pContext.step('Store is case-insensitive', async () => {
        // Setup.
        const lDirectoryHandle: MockDirectoryHandle = new MockDirectoryHandle();
        const lFileSystem: IFileSystem = new FileApiFileSystem(lDirectoryHandle as unknown as FileSystemDirectoryHandle);

        const lObject: SimpleTestObject = new SimpleTestObject();
        lObject.name = 'CaseTest';
        lObject.value = 7;

        // Process. Store with mixed case.
        await lFileSystem.store('My/Path/Class', lObject);

        // Evaluation. Read with lowercase.
        const lResult: SimpleTestObject = await lFileSystem.read<SimpleTestObject>('my/path/class');
        expect(lResult.name).toBe('CaseTest');
        expect(lResult.value).toBe(7);
    });
});

Deno.test('FileApiFileSystem.storeMulti()', async (pContext) => {
    await pContext.step('Store a simple object', async () => {
        // Setup.
        const lDirectoryHandle: MockDirectoryHandle = new MockDirectoryHandle();
        const lFileSystem: IFileSystem = new FileApiFileSystem(lDirectoryHandle as unknown as FileSystemDirectoryHandle);

        const lObject: SimpleTestObject = new SimpleTestObject();
        lObject.name = 'TestName';
        lObject.value = 42;

        // Process.
        await lFileSystem.storeMulti('path/to', 'object', lObject);

        // Evaluation. Read it back to verify it was stored.
        const lResult: SimpleTestObject = await lFileSystem.read<SimpleTestObject>('path/to/object');
        expect(lResult.name).toBe('TestName');
        expect(lResult.value).toBe(42);
    });

    await pContext.step('Store overwrites existing entry at same path', async () => {
        // Setup.
        const lDirectoryHandle: MockDirectoryHandle = new MockDirectoryHandle();
        const lFileSystem: IFileSystem = new FileApiFileSystem(lDirectoryHandle as unknown as FileSystemDirectoryHandle);

        const lFirst: SimpleTestObject = new SimpleTestObject();
        lFirst.name = 'First';
        lFirst.value = 1;

        const lSecond: SimpleTestObject = new SimpleTestObject();
        lSecond.name = 'Second';
        lSecond.value = 2;

        // Process. Store then overwrite.
        await lFileSystem.storeMulti('same', 'path', lFirst);
        await lFileSystem.storeMulti('same', 'path', lSecond);

        // Evaluation. Should return the second object.
        const lResult: SimpleTestObject = await lFileSystem.read<SimpleTestObject>('same/path');
        expect(lResult.name).toBe('Second');
        expect(lResult.value).toBe(2);
    });

    await pContext.step('Store nested object', async () => {
        // Setup.
        const lDirectoryHandle: MockDirectoryHandle = new MockDirectoryHandle();
        const lFileSystem: IFileSystem = new FileApiFileSystem(lDirectoryHandle as unknown as FileSystemDirectoryHandle);

        const lChild: SimpleTestObject = new SimpleTestObject();
        lChild.name = 'ChildName';
        lChild.value = 99;

        const lParent: NestedTestObject = new NestedTestObject();
        lParent.label = 'ParentLabel';
        lParent.child = lChild;

        // Process.
        await lFileSystem.storeMulti('nested', 'object', lParent);

        // Evaluation.
        const lResult: NestedTestObject = await lFileSystem.read<NestedTestObject>('nested/object');
        expect(lResult.label).toBe('ParentLabel');
        expect(lResult.child).not.toBeNull();
        expect(lResult.child!.name).toBe('ChildName');
        expect(lResult.child!.value).toBe(99);
    });

    await pContext.step('Store multiple objects in same blob', async () => {
        // Setup.
        const lDirectoryHandle: MockDirectoryHandle = new MockDirectoryHandle();
        const lFileSystem: IFileSystem = new FileApiFileSystem(lDirectoryHandle as unknown as FileSystemDirectoryHandle);

        const lFirst: SimpleTestObject = new SimpleTestObject();
        lFirst.name = 'First';
        lFirst.value = 1;

        const lSecond: SimpleTestObject = new SimpleTestObject();
        lSecond.name = 'Second';
        lSecond.value = 2;

        // Process. Store two objects in the same file path with different sub-paths.
        await lFileSystem.storeMulti('shared/file', 'alpha', lFirst);
        await lFileSystem.storeMulti('shared/file', 'beta', lSecond);

        // Evaluation. Both should be readable by their full read paths.
        const lResultAlpha: SimpleTestObject = await lFileSystem.read<SimpleTestObject>('shared/file/alpha');
        const lResultBeta: SimpleTestObject = await lFileSystem.read<SimpleTestObject>('shared/file/beta');

        expect(lResultAlpha.name).toBe('First');
        expect(lResultAlpha.value).toBe(1);
        expect(lResultBeta.name).toBe('Second');
        expect(lResultBeta.value).toBe(2);
    });

    await pContext.step('Overwrite one sub-path preserves others in same blob', async () => {
        // Setup.
        const lDirectoryHandle: MockDirectoryHandle = new MockDirectoryHandle();
        const lFileSystem: IFileSystem = new FileApiFileSystem(lDirectoryHandle as unknown as FileSystemDirectoryHandle);

        const lFirst: SimpleTestObject = new SimpleTestObject();
        lFirst.name = 'Original';
        lFirst.value = 1;

        const lSecond: SimpleTestObject = new SimpleTestObject();
        lSecond.name = 'Sibling';
        lSecond.value = 2;

        const lReplacement: SimpleTestObject = new SimpleTestObject();
        lReplacement.name = 'Replaced';
        lReplacement.value = 3;

        // Process. Store two objects, then overwrite one.
        await lFileSystem.storeMulti('pack', 'first', lFirst);
        await lFileSystem.storeMulti('pack', 'second', lSecond);
        await lFileSystem.storeMulti('pack', 'first', lReplacement);

        // Evaluation. First should be replaced, second untouched.
        const lResultFirst: SimpleTestObject = await lFileSystem.read<SimpleTestObject>('pack/first');
        const lResultSecond: SimpleTestObject = await lFileSystem.read<SimpleTestObject>('pack/second');

        expect(lResultFirst.name).toBe('Replaced');
        expect(lResultFirst.value).toBe(3);
        expect(lResultSecond.name).toBe('Sibling');
        expect(lResultSecond.value).toBe(2);
    });
});

Deno.test('FileApiFileSystem.read()', async (pContext) => {
    await pContext.step('Read stored object', async () => {
        // Setup.
        const lDirectoryHandle: MockDirectoryHandle = new MockDirectoryHandle();
        const lFileSystem: IFileSystem = new FileApiFileSystem(lDirectoryHandle as unknown as FileSystemDirectoryHandle);

        const lObject: SimpleTestObject = new SimpleTestObject();
        lObject.name = 'ReadTest';
        lObject.value = 7;
        await lFileSystem.storeMulti('read', 'test', lObject);

        // Process.
        const lResult: SimpleTestObject = await lFileSystem.read<SimpleTestObject>('read/test');

        // Evaluation.
        expect(lResult).toBeInstanceOf(SimpleTestObject);
        expect(lResult.name).toBe('ReadTest');
        expect(lResult.value).toBe(7);
    });

    await pContext.step('Read is case-insensitive', async () => {
        // Setup.
        const lDirectoryHandle: MockDirectoryHandle = new MockDirectoryHandle();
        const lFileSystem: IFileSystem = new FileApiFileSystem(lDirectoryHandle as unknown as FileSystemDirectoryHandle);

        const lObject: SimpleTestObject = new SimpleTestObject();
        lObject.name = 'CaseTest';
        lObject.value = 3;
        await lFileSystem.storeMulti('My', 'Path', lObject);

        // Process.
        const lResult: SimpleTestObject = await lFileSystem.read<SimpleTestObject>('my/path');

        // Evaluation.
        expect(lResult.name).toBe('CaseTest');
    });

    await pContext.step('Read non-existent path throws', async () => {
        // Setup.
        const lDirectoryHandle: MockDirectoryHandle = new MockDirectoryHandle();
        const lFileSystem: IFileSystem = new FileApiFileSystem(lDirectoryHandle as unknown as FileSystemDirectoryHandle);

        // Process & Evaluation.
        let lError: Error | null = null;
        try {
            await lFileSystem.read<SimpleTestObject>('does/not/exist');
        } catch (pError) {
            lError = pError as Error;
        }

        expect(lError).not.toBeNull();
    });

    await pContext.step('Read multiple different paths', async () => {
        // Setup.
        const lDirectoryHandle: MockDirectoryHandle = new MockDirectoryHandle();
        const lFileSystem: IFileSystem = new FileApiFileSystem(lDirectoryHandle as unknown as FileSystemDirectoryHandle);

        const lFirst: SimpleTestObject = new SimpleTestObject();
        lFirst.name = 'First';
        lFirst.value = 1;

        const lSecond: SimpleTestObject = new SimpleTestObject();
        lSecond.name = 'Second';
        lSecond.value = 2;

        await lFileSystem.storeMulti('path', 'one', lFirst);
        await lFileSystem.storeMulti('path', 'two', lSecond);

        // Process.
        const lResultOne: SimpleTestObject = await lFileSystem.read<SimpleTestObject>('path/one');
        const lResultTwo: SimpleTestObject = await lFileSystem.read<SimpleTestObject>('path/two');

        // Evaluation.
        expect(lResultOne.name).toBe('First');
        expect(lResultOne.value).toBe(1);
        expect(lResultTwo.name).toBe('Second');
        expect(lResultTwo.value).toBe(2);
    });
});

Deno.test('FileApiFileSystem singleton caching', async (pContext) => {
    await pContext.step('Singleton: reading same path twice returns same instance', async () => {
        // Setup.
        const lDirectoryHandle: MockDirectoryHandle = new MockDirectoryHandle();
        const lFileSystem: IFileSystem = new FileApiFileSystem(lDirectoryHandle as unknown as FileSystemDirectoryHandle);

        const lObject: SingletonTestObject = new SingletonTestObject();
        lObject.name = 'Singleton';
        lObject.value = 1;

        await lFileSystem.store('singleton/path', lObject);

        // Process.
        const lFirst: SingletonTestObject = await lFileSystem.read<SingletonTestObject>('singleton/path');
        const lSecond: SingletonTestObject = await lFileSystem.read<SingletonTestObject>('singleton/path');

        // Evaluation. Both reads should return the exact same object reference.
        expect(lFirst).toBe(lSecond);
    });

    await pContext.step('Singleton: different paths return different instances', async () => {
        // Setup.
        const lDirectoryHandle: MockDirectoryHandle = new MockDirectoryHandle();
        const lFileSystem: IFileSystem = new FileApiFileSystem(lDirectoryHandle as unknown as FileSystemDirectoryHandle);

        const lObjectA: SingletonTestObject = new SingletonTestObject();
        lObjectA.name = 'A';
        lObjectA.value = 1;

        const lObjectB: SingletonTestObject = new SingletonTestObject();
        lObjectB.name = 'B';
        lObjectB.value = 2;

        await lFileSystem.store('singleton/a', lObjectA);
        await lFileSystem.store('singleton/b', lObjectB);

        // Process.
        const lResultA: SingletonTestObject = await lFileSystem.read<SingletonTestObject>('singleton/a');
        const lResultB: SingletonTestObject = await lFileSystem.read<SingletonTestObject>('singleton/b');

        // Evaluation. Different paths should yield different instances.
        expect(lResultA).not.toBe(lResultB);
        expect(lResultA.name).toBe('A');
        expect(lResultB.name).toBe('B');
    });

    await pContext.step('Singleton: cache is case-insensitive', async () => {
        // Setup.
        const lDirectoryHandle: MockDirectoryHandle = new MockDirectoryHandle();
        const lFileSystem: IFileSystem = new FileApiFileSystem(lDirectoryHandle as unknown as FileSystemDirectoryHandle);

        const lObject: SingletonTestObject = new SingletonTestObject();
        lObject.name = 'CaseSingleton';
        lObject.value = 7;

        await lFileSystem.store('Singleton/Case', lObject);

        // Process. Read with different casings.
        const lFirst: SingletonTestObject = await lFileSystem.read<SingletonTestObject>('singleton/case');
        const lSecond: SingletonTestObject = await lFileSystem.read<SingletonTestObject>('SINGLETON/CASE');

        // Evaluation. Both should be the same cached instance.
        expect(lFirst).toBe(lSecond);
    });

    await pContext.step('Singleton: cache is per FileApiFileSystem instance', async () => {
        // Setup.
        const lDirectoryHandle: MockDirectoryHandle = new MockDirectoryHandle();
        const lFileSystemA: IFileSystem = new FileApiFileSystem(lDirectoryHandle as unknown as FileSystemDirectoryHandle);
        const lFileSystemB: IFileSystem = new FileApiFileSystem(lDirectoryHandle as unknown as FileSystemDirectoryHandle);

        const lObject: SingletonTestObject = new SingletonTestObject();
        lObject.name = 'PerInstance';
        lObject.value = 3;

        await lFileSystemA.store('singleton/instance', lObject);

        // Process.
        const lResultA: SingletonTestObject = await lFileSystemA.read<SingletonTestObject>('singleton/instance');
        const lResultB: SingletonTestObject = await lFileSystemB.read<SingletonTestObject>('singleton/instance');

        // Evaluation. Different FileApiFileSystem instances should have independent caches.
        expect(lResultA).not.toBe(lResultB);
        expect(lResultA.name).toBe('PerInstance');
        expect(lResultB.name).toBe('PerInstance');
    });

    await pContext.step('Instanced: reading same path twice returns different instances', async () => {
        // Setup.
        const lDirectoryHandle: MockDirectoryHandle = new MockDirectoryHandle();
        const lFileSystem: IFileSystem = new FileApiFileSystem(lDirectoryHandle as unknown as FileSystemDirectoryHandle);

        const lObject: SimpleTestObject = new SimpleTestObject();
        lObject.name = 'Instanced';
        lObject.value = 5;

        await lFileSystem.store('instanced/path', lObject);

        // Process.
        const lFirst: SimpleTestObject = await lFileSystem.read<SimpleTestObject>('instanced/path');
        const lSecond: SimpleTestObject = await lFileSystem.read<SimpleTestObject>('instanced/path');

        // Evaluation. Instanced classes should return different object references.
        expect(lFirst).not.toBe(lSecond);
        expect(lFirst.name).toBe('Instanced');
        expect(lSecond.name).toBe('Instanced');
    });

    await pContext.step('Singleton: storeMulti with singleton class caches on read', async () => {
        // Setup.
        const lDirectoryHandle: MockDirectoryHandle = new MockDirectoryHandle();
        const lFileSystem: IFileSystem = new FileApiFileSystem(lDirectoryHandle as unknown as FileSystemDirectoryHandle);

        const lObject: SingletonTestObject = new SingletonTestObject();
        lObject.name = 'MultiSingleton';
        lObject.value = 10;

        await lFileSystem.storeMulti('multi', 'singleton', lObject);

        // Process.
        const lFirst: SingletonTestObject = await lFileSystem.read<SingletonTestObject>('multi/singleton');
        const lSecond: SingletonTestObject = await lFileSystem.read<SingletonTestObject>('multi/singleton');

        // Evaluation. Both reads should return the same cached instance.
        expect(lFirst).toBe(lSecond);
    });
});

Deno.test('FileApiFileSystem.delete()', async (pContext) => {
    await pContext.step('Delete single class by read path', async () => {
        // Setup.
        const lDirectoryHandle: MockDirectoryHandle = new MockDirectoryHandle();
        const lFileSystem: IFileSystem = new FileApiFileSystem(lDirectoryHandle as unknown as FileSystemDirectoryHandle);

        const lObject: SimpleTestObject = new SimpleTestObject();
        lObject.name = 'ToDelete';
        lObject.value = 1;
        await lFileSystem.storeMulti('file', 'entry', lObject);

        // Process.
        await lFileSystem.delete('file/entry');

        // Evaluation. Reading should throw.
        let lError: Error | null = null;
        try {
            await lFileSystem.read<SimpleTestObject>('file/entry');
        } catch (pError) {
            lError = pError as Error;
        }

        expect(lError).not.toBeNull();
    });

    await pContext.step('Delete one sub-path preserves others in same blob', async () => {
        // Setup.
        const lDirectoryHandle: MockDirectoryHandle = new MockDirectoryHandle();
        const lFileSystem: IFileSystem = new FileApiFileSystem(lDirectoryHandle as unknown as FileSystemDirectoryHandle);

        const lFirst: SimpleTestObject = new SimpleTestObject();
        lFirst.name = 'Keep';
        lFirst.value = 1;

        const lSecond: SimpleTestObject = new SimpleTestObject();
        lSecond.name = 'Remove';
        lSecond.value = 2;

        await lFileSystem.storeMulti('pack', 'keep', lFirst);
        await lFileSystem.storeMulti('pack', 'remove', lSecond);

        // Process.
        await lFileSystem.delete('pack/remove');

        // Evaluation. Kept entry should still be readable.
        const lResult: SimpleTestObject = await lFileSystem.read<SimpleTestObject>('pack/keep');
        expect(lResult.name).toBe('Keep');
        expect(lResult.value).toBe(1);

        // Deleted entry should throw.
        let lError: Error | null = null;
        try {
            await lFileSystem.read<SimpleTestObject>('pack/remove');
        } catch (pError) {
            lError = pError as Error;
        }

        expect(lError).not.toBeNull();
    });

    await pContext.step('Delete entire file by file path', async () => {
        // Setup.
        const lDirectoryHandle: MockDirectoryHandle = new MockDirectoryHandle();
        const lFileSystem: IFileSystem = new FileApiFileSystem(lDirectoryHandle as unknown as FileSystemDirectoryHandle);

        const lFirst: SimpleTestObject = new SimpleTestObject();
        lFirst.name = 'First';
        lFirst.value = 1;

        const lSecond: SimpleTestObject = new SimpleTestObject();
        lSecond.name = 'Second';
        lSecond.value = 2;

        await lFileSystem.storeMulti('whole-file', 'alpha', lFirst);
        await lFileSystem.storeMulti('whole-file', 'beta', lSecond);

        // Process. Delete by file path.
        await lFileSystem.delete('whole-file');

        // Evaluation. Both entries should be gone.
        let lErrorAlpha: Error | null = null;
        try {
            await lFileSystem.read<SimpleTestObject>('whole-file/alpha');
        } catch (pError) {
            lErrorAlpha = pError as Error;
        }

        let lErrorBeta: Error | null = null;
        try {
            await lFileSystem.read<SimpleTestObject>('whole-file/beta');
        } catch (pError) {
            lErrorBeta = pError as Error;
        }

        expect(lErrorAlpha).not.toBeNull();
        expect(lErrorBeta).not.toBeNull();
    });

    await pContext.step('Delete non-existent path throws', async () => {
        // Setup.
        const lDirectoryHandle: MockDirectoryHandle = new MockDirectoryHandle();
        const lFileSystem: IFileSystem = new FileApiFileSystem(lDirectoryHandle as unknown as FileSystemDirectoryHandle);

        // Process & Evaluation.
        let lError: Error | null = null;
        try {
            await lFileSystem.delete('does/not/exist');
        } catch (pError) {
            lError = pError as Error;
        }

        expect(lError).not.toBeNull();
    });

    await pContext.step('Delete is case-insensitive', async () => {
        // Setup.
        const lDirectoryHandle: MockDirectoryHandle = new MockDirectoryHandle();
        const lFileSystem: IFileSystem = new FileApiFileSystem(lDirectoryHandle as unknown as FileSystemDirectoryHandle);

        const lObject: SimpleTestObject = new SimpleTestObject();
        lObject.name = 'CaseDelete';
        lObject.value = 5;
        await lFileSystem.storeMulti('Case', 'Path', lObject);

        // Process. Delete with different casing.
        await lFileSystem.delete('case/path');

        // Evaluation.
        let lError: Error | null = null;
        try {
            await lFileSystem.read<SimpleTestObject>('case/path');
        } catch (pError) {
            lError = pError as Error;
        }

        expect(lError).not.toBeNull();
    });
});


Deno.test('FileApiFileSystem.fileClass()', async (pContext) => {
    await pContext.step('Classes decorated with fileClass are serializable', async () => {
        // Setup.
        const lDirectoryHandle: MockDirectoryHandle = new MockDirectoryHandle();
        const lFileSystem: IFileSystem = new FileApiFileSystem(lDirectoryHandle as unknown as FileSystemDirectoryHandle);

        const lObject: SimpleTestObject = new SimpleTestObject();
        lObject.name = 'DecoratorTest';
        lObject.value = 42;

        // Process. Store and read back.
        await lFileSystem.store('decorator/test', lObject);
        const lResult: SimpleTestObject = await lFileSystem.read<SimpleTestObject>('decorator/test');

        // Evaluation.
        expect(lResult).toBeInstanceOf(SimpleTestObject);
        expect(lResult.name).toBe('DecoratorTest');
        expect(lResult.value).toBe(42);
    });
});
