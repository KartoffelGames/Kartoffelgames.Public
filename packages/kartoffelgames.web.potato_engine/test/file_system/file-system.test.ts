import { Serializer } from '@kartoffelgames/core-serializer';
import { expect } from '@kartoffelgames/core-test';
import '../mock/structured-clone-blob-support.ts';
import 'npm:fake-indexeddb/auto';
import { FileSystem } from '../../source/file_system/file-system.ts';

// Simple serializable test class.
@Serializer.serializeableClass('b5931480-24c6-44cc-8479-f8c6883ba20f')
class SimpleTestObject {
    @Serializer.property()
    public name: string = '';

    @Serializer.property()
    public value: number = 0;
}

// Nested serializable test class.
@Serializer.serializeableClass('a8cf87b1-0877-4089-858a-ab297eb76d85')
class NestedTestObject {
    @Serializer.property()
    public child: SimpleTestObject | null = null;

    @Serializer.property()
    public label: string = '';
}

// Sanitize disabled because timers are started outside of the test in fake-indexeddb.
Deno.test('FileSystem.store()', { sanitizeResources: false, sanitizeOps: false }, async (pContext) => {
    await pContext.step('Store and read a single-class object', async () => {
        // Setup.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lFileSystem: FileSystem = new FileSystem(lDatabaseName);

        const lObject: SimpleTestObject = new SimpleTestObject();
        lObject.name = 'TestName';
        lObject.value = 42;

        // Process.
        await lFileSystem.store('my/path/class', lObject);

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
        const lFileSystem: FileSystem = new FileSystem(lDatabaseName);

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

        // Cleanup.
        lFileSystem.close();
    });

    await pContext.step('Store is case-insensitive', async () => {
        // Setup.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lFileSystem: FileSystem = new FileSystem(lDatabaseName);

        const lObject: SimpleTestObject = new SimpleTestObject();
        lObject.name = 'CaseTest';
        lObject.value = 7;

        // Process. Store with mixed case.
        await lFileSystem.store('My/Path/Class', lObject);

        // Evaluation. Read with lowercase.
        const lResult: SimpleTestObject = await lFileSystem.read<SimpleTestObject>('my/path/class');
        expect(lResult.name).toBe('CaseTest');
        expect(lResult.value).toBe(7);

        // Cleanup.
        lFileSystem.close();
    });
});

// Sanitize disabled because timers are started outside of the test in fake-indexeddb.
Deno.test('FileSystem.storeMulti()', { sanitizeResources: false, sanitizeOps: false }, async (pContext) => {
    await pContext.step('Store a simple object', async () => {
        // Setup.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lFileSystem: FileSystem = new FileSystem(lDatabaseName);

        const lObject: SimpleTestObject = new SimpleTestObject();
        lObject.name = 'TestName';
        lObject.value = 42;

        // Process.
        await lFileSystem.storeMulti('path/to', 'object', lObject);

        // Evaluation. Read it back to verify it was stored.
        const lResult: SimpleTestObject = await lFileSystem.read<SimpleTestObject>('path/to/object');
        expect(lResult.name).toBe('TestName');
        expect(lResult.value).toBe(42);

        // Cleanup.
        lFileSystem.close();
    });

    await pContext.step('Store overwrites existing entry at same path', async () => {
        // Setup.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lFileSystem: FileSystem = new FileSystem(lDatabaseName);

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

        // Cleanup.
        lFileSystem.close();
    });

    await pContext.step('Store nested object', async () => {
        // Setup.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lFileSystem: FileSystem = new FileSystem(lDatabaseName);

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

        // Cleanup.
        lFileSystem.close();
    });

    await pContext.step('Store multiple objects in same blob', async () => {
        // Setup.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lFileSystem: FileSystem = new FileSystem(lDatabaseName);

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

        // Cleanup.
        lFileSystem.close();
    });

    await pContext.step('Overwrite one sub-path preserves others in same blob', async () => {
        // Setup.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lFileSystem: FileSystem = new FileSystem(lDatabaseName);

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

        // Cleanup.
        lFileSystem.close();
    });
});

Deno.test('FileSystem.read()', { sanitizeResources: false, sanitizeOps: false }, async (pContext) => {
    await pContext.step('Read stored object', async () => {
        // Setup.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lFileSystem: FileSystem = new FileSystem(lDatabaseName);

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

        // Cleanup.
        lFileSystem.close();
    });

    await pContext.step('Read is case-insensitive', async () => {
        // Setup.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lFileSystem: FileSystem = new FileSystem(lDatabaseName);

        const lObject: SimpleTestObject = new SimpleTestObject();
        lObject.name = 'CaseTest';
        lObject.value = 3;
        await lFileSystem.storeMulti('My', 'Path', lObject);

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
        const lFileSystem: FileSystem = new FileSystem(lDatabaseName);

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
        const lFileSystem: FileSystem = new FileSystem(lDatabaseName);

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

        // Cleanup.
        lFileSystem.close();
    });
});

Deno.test('FileSystem.delete()', { sanitizeResources: false, sanitizeOps: false }, async (pContext) => {
    await pContext.step('Delete single class by read path', async () => {
        // Setup.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lFileSystem: FileSystem = new FileSystem(lDatabaseName);

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

        // Cleanup.
        lFileSystem.close();
    });

    await pContext.step('Delete one sub-path preserves others in same blob', async () => {
        // Setup.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lFileSystem: FileSystem = new FileSystem(lDatabaseName);

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

        // Cleanup.
        lFileSystem.close();
    });

    await pContext.step('Delete entire file by file path', async () => {
        // Setup.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lFileSystem: FileSystem = new FileSystem(lDatabaseName);

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

        // Cleanup.
        lFileSystem.close();
    });

    await pContext.step('Delete non-existent path throws', async () => {
        // Setup.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lFileSystem: FileSystem = new FileSystem(lDatabaseName);

        // Process & Evaluation.
        let lError: Error | null = null;
        try {
            await lFileSystem.delete('does/not/exist');
        } catch (pError) {
            lError = pError as Error;
        }

        expect(lError).not.toBeNull();

        // Cleanup.
        lFileSystem.close();
    });

    await pContext.step('Delete is case-insensitive', async () => {
        // Setup.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lFileSystem: FileSystem = new FileSystem(lDatabaseName);

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

        // Cleanup.
        lFileSystem.close();
    });
});
