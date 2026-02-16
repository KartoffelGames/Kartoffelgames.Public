import { expect } from '@kartoffelgames/core-test';
import { type BlobContentEntry, BlobSerializer } from '../source/blob_serializer/blob-serializer.ts';
import { Serializer } from '../source/core/serializer.ts';

Deno.test('BlobSerializer.save()', async (pContext) => {
    await pContext.step('Save single entry', async () => {
        // Setup.
        const lUuid: string = 'blob-save-single';

        @Serializer.class(lUuid)
        class TestObj {
            @Serializer.property()
            public name: string = 'Test';
        }

        const lSerializer: BlobSerializer = new BlobSerializer();
        const lObj: TestObj = new TestObj();
        lSerializer.store('MyClass', lObj);

        // Process.
        const lBlob: Blob = await lSerializer.save();

        // Evaluation.
        expect(lBlob.size).toBeGreaterThan(16); // At least header size.
    });

    await pContext.step('Save multiple entries', async () => {
        // Setup.
        const lUuid: string = 'blob-save-multi';

        @Serializer.class(lUuid)
        class TestObj {
            @Serializer.property()
            public value: number = 0;
        }

        const lSerializer: BlobSerializer = new BlobSerializer();

        const lObj1: TestObj = new TestObj();
        lObj1.value = 1;
        const lObj2: TestObj = new TestObj();
        lObj2.value = 2;
        const lObj3: TestObj = new TestObj();
        lObj3.value = 3;

        lSerializer.store('path/one', lObj1);
        lSerializer.store('path/two', lObj2);
        lSerializer.store('three', lObj3);

        // Process.
        const lBlob: Blob = await lSerializer.save();

        // Evaluation.
        expect(lBlob.size).toBeGreaterThan(16);
    });

    await pContext.step('Save empty entries', async () => {
        // Setup.
        const lSerializer: BlobSerializer = new BlobSerializer();

        // Process.
        const lBlob: Blob = await lSerializer.save();

        // Evaluation.
        expect(lBlob.size).toBe(16); // Header only.
    });
});

Deno.test('BlobSerializer.load()', async (pContext) => {
    await pContext.step('Load valid blob', async () => {
        // Setup.
        const lUuid: string = 'blob-load-valid';

        @Serializer.class(lUuid)
        class TestObj {
            @Serializer.property()
            public name: string = 'Test';
        }

        const lSaveSerializer: BlobSerializer = new BlobSerializer();
        lSaveSerializer.store('test', new TestObj());
        const lBlob: Blob = await lSaveSerializer.save();

        const lLoadSerializer: BlobSerializer = new BlobSerializer();

        // Process.  Should not throw.
        await lLoadSerializer.load(lBlob);
    });

    await pContext.step('Throw on blob too small', async () => {
        // Setup.
        const lBlob: Blob = new Blob([new Uint8Array(5)]);
        const lSerializer: BlobSerializer = new BlobSerializer();

        // Process & Evaluation.
        try {
            await lSerializer.load(lBlob);
            expect(true).toBe(false); // Should not reach here.
        } catch (pError) {
            expect((pError as Error).message).toBe('Blob is too small to contain a valid serializer header.');
        }
    });

    await pContext.step('Throw on invalid magic bytes', async () => {
        // Setup. Create a 16-byte blob with wrong magic.
        const lBuffer: ArrayBuffer = new ArrayBuffer(16);
        const lView: DataView = new DataView(lBuffer);
        lView.setUint32(0, 0xDEADBEEF, true); // wrong magic
        lView.setUint16(4, 1, true); // version
        lView.setUint32(8, 16, true); // toc offset
        lView.setUint32(12, 0, true); // entry count

        const lBlob: Blob = new Blob([new Uint8Array(lBuffer)]);
        const lSerializer: BlobSerializer = new BlobSerializer();

        // Process & Evaluation.
        try {
            await lSerializer.load(lBlob);
            expect(true).toBe(false); // Should not reach here.
        } catch (pError) {
            expect((pError as Error).message).toBe('Invalid blob magic number bytes: expected 0x4b475342, got 0xdeadbeef.');
        }
    });

    await pContext.step('Throw on unsupported version', async () => {
        // Setup. Create a 16-byte blob with wrong version.
        const lBuffer: ArrayBuffer = new ArrayBuffer(16);
        const lView: DataView = new DataView(lBuffer);
        lView.setUint32(0, 0x4B475342, true); // correct magic
        lView.setUint16(4, 99, true); // wrong version
        lView.setUint32(8, 16, true); // toc offset
        lView.setUint32(12, 0, true); // entry count

        const lBlob: Blob = new Blob([new Uint8Array(lBuffer)]);
        const lSerializer: BlobSerializer = new BlobSerializer();

        // Process & Evaluation.
        try {
            await lSerializer.load(lBlob);
            expect(true).toBe(false);
        } catch (pError) {
            expect((pError as Error).message).toBe('Unsupported blob format version: 99. Expected: 1.');
        }
    });
});

Deno.test('BlobSerializer.read()', async (pContext) => {
    await pContext.step('Read single entry by path', async () => {
        // Setup.
        const lUuid: string = 'blob-read-single';

        @Serializer.class(lUuid)
        class TestObj {
            @Serializer.property()
            public name: string = '';
        }

        const lOriginal: TestObj = new TestObj();
        lOriginal.name = 'ReadTest';

        const lSaveSerializer: BlobSerializer = new BlobSerializer();
        lSaveSerializer.store('MyFolder/MyClass', lOriginal);
        const lBlob: Blob = await lSaveSerializer.save();

        const lLoadSerializer: BlobSerializer = new BlobSerializer();
        await lLoadSerializer.load(lBlob);

        // Process.
        const lResult: TestObj = await lLoadSerializer.read<TestObj>('MyFolder/MyClass');

        // Evaluation.
        expect(lResult).toBeInstanceOf(TestObj);
        expect(lResult.name).toBe('ReadTest');
    });

    await pContext.step('Read one of many entries', async () => {
        // Setup.
        const lUuid: string = 'blob-read-many';

        @Serializer.class(lUuid)
        class TestObj {
            @Serializer.property()
            public value: number = 0;
        }

        const lSaveSerializer: BlobSerializer = new BlobSerializer();

        for (let lIndex: number = 0; lIndex < 5; lIndex++) {
            const lObj: TestObj = new TestObj();
            lObj.value = lIndex * 10;
            lSaveSerializer.store(`entry/${lIndex}`, lObj);
        }

        const lBlob: Blob = await lSaveSerializer.save();
        const lLoadSerializer: BlobSerializer = new BlobSerializer();
        await lLoadSerializer.load(lBlob);

        // Process.
        const lResult: TestObj = await lLoadSerializer.read<TestObj>('entry/3');

        // Evaluation.
        expect(lResult).toBeInstanceOf(TestObj);
        expect(lResult.value).toBe(30);
    });

    await pContext.step('Throw on missing path', async () => {
        // Setup.
        const lUuid: string = 'blob-read-missing';

        @Serializer.class(lUuid)
        class TestObj {
            @Serializer.property()
            public value: number = 0;
        }

        const lSaveSerializer: BlobSerializer = new BlobSerializer();
        lSaveSerializer.store('existing', new TestObj());
        const lBlob: Blob = await lSaveSerializer.save();

        const lLoadSerializer: BlobSerializer = new BlobSerializer();
        await lLoadSerializer.load(lBlob);

        // Process & Evaluation.
        try {
            await lLoadSerializer.read('nonexistent/path');
            expect(true).toBe(false);
        } catch (pError) {
            expect((pError as Error).message).toBe('Path "nonexistent/path" not found in blob.');
        }
    });

    await pContext.step('Throw when no blob loaded', async () => {
        // Setup.
        const lSerializer: BlobSerializer = new BlobSerializer();

        // Process & Evaluation.
        try {
            await lSerializer.read('any/path');
            expect(true).toBe(false);
        } catch (pError) {
            expect((pError as Error).message).toBe('No blob loaded. Call load() first.');
        }
    });

    await pContext.step('Read string value', async () => {
        // Setup.
        const lUuid: string = 'blob-read-string-prop';

        @Serializer.class(lUuid)
        class TestObj {
            @Serializer.property()
            public text: string = '';
        }

        const lOriginal: TestObj = new TestObj();
        lOriginal.text = 'Hello Kartoffel';

        const lSaveSerializer: BlobSerializer = new BlobSerializer();
        lSaveSerializer.store('text', lOriginal);
        const lBlob: Blob = await lSaveSerializer.save();

        const lLoadSerializer: BlobSerializer = new BlobSerializer();
        await lLoadSerializer.load(lBlob);

        // Process.
        const lResult: TestObj = await lLoadSerializer.read<TestObj>('text');

        // Evaluation.
        expect(lResult.text).toBe('Hello Kartoffel');
    });

    await pContext.step('Read array value', async () => {
        // Setup.
        const lUuid: string = 'blob-read-array-prop';

        @Serializer.class(lUuid)
        class TestObj {
            @Serializer.property()
            public items: Array<number> = [];
        }

        const lOriginal: TestObj = new TestObj();
        lOriginal.items = [1, 2, 3, 4, 5];

        const lSaveSerializer: BlobSerializer = new BlobSerializer();
        lSaveSerializer.store('array', lOriginal);
        const lBlob: Blob = await lSaveSerializer.save();

        const lLoadSerializer: BlobSerializer = new BlobSerializer();
        await lLoadSerializer.load(lBlob);

        // Process.
        const lResult: TestObj = await lLoadSerializer.read<TestObj>('array');

        // Evaluation.
        expect(lResult.items).toBeDeepEqual([1, 2, 3, 4, 5]);
    });

    await pContext.step('Read nested registered object', async () => {
        // Setup.
        const lChildUuid: string = 'blob-read-nested-child';
        const lParentUuid: string = 'blob-read-nested-parent';

        @Serializer.class(lChildUuid)
        class Child {
            @Serializer.property()
            public score: number = 0;
        }

        @Serializer.class(lParentUuid)
        class Parent {
            @Serializer.property()
            public child: Child | null = null;

            @Serializer.property()
            public name: string = '';
        }

        const lChild: Child = new Child();
        lChild.score = 100;

        const lParent: Parent = new Parent();
        lParent.child = lChild;
        lParent.name = 'ParentObj';

        const lSaveSerializer: BlobSerializer = new BlobSerializer();
        lSaveSerializer.store('nested/parent', lParent);
        const lBlob: Blob = await lSaveSerializer.save();

        const lLoadSerializer: BlobSerializer = new BlobSerializer();
        await lLoadSerializer.load(lBlob);

        // Process.
        const lResult: Parent = await lLoadSerializer.read<Parent>('nested/parent');

        // Evaluation.
        expect(lResult).toBeInstanceOf(Parent);
        expect(lResult.name).toBe('ParentObj');
        expect(lResult.child).toBeInstanceOf(Child);
        expect(lResult.child!.score).toBe(100);
    });

    await pContext.step('Read ArrayBuffer value', async () => {
        // Setup.
        const lUuid: string = 'blob-read-arraybuffer';

        @Serializer.class(lUuid)
        class TestObj {
            @Serializer.property()
            public data: ArrayBuffer = new ArrayBuffer(0);
        }

        const lOriginal: TestObj = new TestObj();
        lOriginal.data = new ArrayBuffer(4);
        new Uint8Array(lOriginal.data).set([0xDE, 0xAD, 0xBE, 0xEF]);

        const lSaveSerializer: BlobSerializer = new BlobSerializer();
        lSaveSerializer.store('buffer', lOriginal);
        const lBlob: Blob = await lSaveSerializer.save();

        const lLoadSerializer: BlobSerializer = new BlobSerializer();
        await lLoadSerializer.load(lBlob);

        // Process.
        const lResult: TestObj = await lLoadSerializer.read<TestObj>('buffer');

        // Evaluation.
        const lBytes: Uint8Array = new Uint8Array(lResult.data);
        expect(lBytes[0]).toBe(0xDE);
        expect(lBytes[1]).toBe(0xAD);
        expect(lBytes[2]).toBe(0xBE);
        expect(lBytes[3]).toBe(0xEF);
    });

    await pContext.step('Read TypedArray value', async () => {
        // Setup.
        const lUuid: string = 'blob-read-typedarray';

        @Serializer.class(lUuid)
        class TestObj {
            @Serializer.property()
            public data: Float32Array = new Float32Array(0);
        }

        const lOriginal: TestObj = new TestObj();
        lOriginal.data = new Float32Array([1.5, 2.5, 3.5]);

        const lSaveSerializer: BlobSerializer = new BlobSerializer();
        lSaveSerializer.store('typed', lOriginal);
        const lBlob: Blob = await lSaveSerializer.save();

        const lLoadSerializer: BlobSerializer = new BlobSerializer();
        await lLoadSerializer.load(lBlob);

        // Process.
        const lResult: TestObj = await lLoadSerializer.read<TestObj>('typed');

        // Evaluation.
        expect(lResult.data).toBeInstanceOf(Float32Array);
        expect(lResult.data[0]).toBe(1.5);
        expect(lResult.data[1]).toBe(2.5);
        expect(lResult.data[2]).toBe(3.5);
    });
});

Deno.test('BlobSerializer end-to-end', async (pContext) => {
    await pContext.step('Round-trip complex blob with multiple paths', async () => {
        // Setup.
        const lPlayerUuid: string = 'blob-e2e-player';
        const lInventoryUuid: string = 'blob-e2e-inventory';

        @Serializer.class(lPlayerUuid)
        class Player {
            @Serializer.property()
            public active: boolean = false;

            @Serializer.property()
            public health: number = 0;

            @Serializer.property()
            public name: string = '';
        }

        @Serializer.class(lInventoryUuid)
        class Inventory {
            @Serializer.property()
            public items: Array<string> = [];

            @Serializer.property()
            public owner: Player | null = null;
        }

        const lPlayer: Player = new Player();
        lPlayer.name = 'Hero';
        lPlayer.health = 100;
        lPlayer.active = true;

        const lInventory: Inventory = new Inventory();
        lInventory.items = ['Sword', 'Shield', 'Potion'];
        lInventory.owner = lPlayer;

        const lSaveSerializer: BlobSerializer = new BlobSerializer();
        lSaveSerializer.store('game/player', lPlayer);
        lSaveSerializer.store('game/inventory', lInventory);

        // Process.
        const lBlob: Blob = await lSaveSerializer.save();
        const lLoadSerializer: BlobSerializer = new BlobSerializer();
        await lLoadSerializer.load(lBlob);

        const lLoadedPlayer: Player = await lLoadSerializer.read<Player>('game/player');
        const lLoadedInventory: Inventory = await lLoadSerializer.read<Inventory>('game/inventory');

        // Evaluation.
        expect(lLoadedPlayer).toBeInstanceOf(Player);
        expect(lLoadedPlayer.name).toBe('Hero');
        expect(lLoadedPlayer.health).toBe(100);
        expect(lLoadedPlayer.active).toBe(true);

        expect(lLoadedInventory).toBeInstanceOf(Inventory);
        expect(lLoadedInventory.items).toBeDeepEqual(['Sword', 'Shield', 'Potion']);
        expect(lLoadedInventory.owner).toBeInstanceOf(Player);
        expect(lLoadedInventory.owner!.name).toBe('Hero');
    });

    await pContext.step('Round-trip with many entries', async () => {
        // Setup.
        const lUuid: string = 'blob-e2e-many';

        @Serializer.class(lUuid)
        class TestObj {
            @Serializer.property()
            public index: number = 0;
        }

        const lSaveSerializer: BlobSerializer = new BlobSerializer();

        for (let lIndex: number = 0; lIndex < 50; lIndex++) {
            const lObj: TestObj = new TestObj();
            lObj.index = lIndex;
            lSaveSerializer.store(`items/${lIndex}`, lObj);
        }

        const lBlob: Blob = await lSaveSerializer.save();
        const lLoadSerializer: BlobSerializer = new BlobSerializer();
        await lLoadSerializer.load(lBlob);

        // Process. Read some entries at various positions.
        const lFirst: TestObj = await lLoadSerializer.read<TestObj>('items/0');
        const lMiddle: TestObj = await lLoadSerializer.read<TestObj>('items/25');
        const lLast: TestObj = await lLoadSerializer.read<TestObj>('items/49');

        // Evaluation.
        expect(lFirst.index).toBe(0);
        expect(lMiddle.index).toBe(25);
        expect(lLast.index).toBe(49);
    });

    await pContext.step('Round-trip with large ArrayBuffer', async () => {
        // Setup.
        const lUuid: string = 'blob-e2e-large';

        @Serializer.class(lUuid)
        class DataHolder {
            @Serializer.property()
            public buffer: ArrayBuffer = new ArrayBuffer(0);
        }

        const lSize: number = 1024 * 100; // 100 KB
        const lHolder: DataHolder = new DataHolder();
        lHolder.buffer = new ArrayBuffer(lSize);
        const lView: Uint8Array = new Uint8Array(lHolder.buffer);
        for (let lIndex: number = 0; lIndex < lSize; lIndex++) {
            lView[lIndex] = lIndex % 256;
        }

        const lSaveSerializer: BlobSerializer = new BlobSerializer();
        lSaveSerializer.store('large/data', lHolder);
        const lBlob: Blob = await lSaveSerializer.save();

        const lLoadSerializer: BlobSerializer = new BlobSerializer();
        await lLoadSerializer.load(lBlob);

        // Process.
        const lResult: DataHolder = await lLoadSerializer.read<DataHolder>('large/data');

        // Evaluation.
        expect(lResult.buffer.byteLength).toBe(lSize);
        const lResultView: Uint8Array = new Uint8Array(lResult.buffer);
        expect(lResultView[0]).toBe(0);
        expect(lResultView[255]).toBe(255);
        expect(lResultView[256]).toBe(0);
    });

    await pContext.step('Store overwrites existing path', async () => {
        // Setup.
        const lUuid: string = 'blob-e2e-overwrite';

        @Serializer.class(lUuid)
        class TestObj {
            @Serializer.property()
            public value: number = 0;
        }

        const lSerializer: BlobSerializer = new BlobSerializer();
        const lObj1: TestObj = new TestObj();
        lObj1.value = 1;
        lSerializer.store('test', lObj1);

        const lObj2: TestObj = new TestObj();
        lObj2.value = 2;
        lSerializer.store('test', lObj2);

        // Process.
        const lBlob: Blob = await lSerializer.save();
        const lLoadSerializer: BlobSerializer = new BlobSerializer();
        await lLoadSerializer.load(lBlob);
        const lResult: TestObj = await lLoadSerializer.read<TestObj>('test');

        // Evaluation.
        expect(lResult.value).toBe(2);
    });

    await pContext.step('Round-trip with getter/setter properties', async () => {
        // Setup.
        const lUuid: string = 'blob-e2e-accessor';

        @Serializer.class(lUuid)
        class TestObj {
            private mAge: number = 0;
            private mName: string = '';

            @Serializer.property()
            public get age(): number {
                return this.mAge;
            }

            @Serializer.property()
            public get name(): string {
                return this.mName;
            }

            public set age(pValue: number) {
                this.mAge = pValue;
            }

            public set name(pValue: string) {
                this.mName = pValue;
            }
        }

        const lOriginal: TestObj = new TestObj();
        lOriginal.name = 'GetterSetterTest';
        lOriginal.age = 25;

        const lSaveSerializer: BlobSerializer = new BlobSerializer();
        lSaveSerializer.store('accessor', lOriginal);
        const lBlob: Blob = await lSaveSerializer.save();

        const lLoadSerializer: BlobSerializer = new BlobSerializer();
        await lLoadSerializer.load(lBlob);

        // Process.
        const lResult: TestObj = await lLoadSerializer.read<TestObj>('accessor');

        // Evaluation.
        expect(lResult).toBeInstanceOf(TestObj);
        expect(lResult.name).toBe('GetterSetterTest');
        expect(lResult.age).toBe(25);
    });

    await pContext.step('Round-trip with array of registered objects', async () => {
        // Setup.
        const lItemUuid: string = 'blob-e2e-arr-item';
        const lListUuid: string = 'blob-e2e-arr-list';

        @Serializer.class(lItemUuid)
        class Item {
            @Serializer.property()
            public id: number = 0;

            @Serializer.property()
            public label: string = '';
        }

        @Serializer.class(lListUuid)
        class ItemList {
            @Serializer.property()
            public items: Array<Item> = [];
        }

        const lItem1: Item = new Item();
        lItem1.id = 1;
        lItem1.label = 'First';

        const lItem2: Item = new Item();
        lItem2.id = 2;
        lItem2.label = 'Second';

        const lList: ItemList = new ItemList();
        lList.items = [lItem1, lItem2];

        const lSaveSerializer: BlobSerializer = new BlobSerializer();
        lSaveSerializer.store('list', lList);
        const lBlob: Blob = await lSaveSerializer.save();

        const lLoadSerializer: BlobSerializer = new BlobSerializer();
        await lLoadSerializer.load(lBlob);

        // Process.
        const lResult: ItemList = await lLoadSerializer.read<ItemList>('list');

        // Evaluation.
        expect(lResult).toBeInstanceOf(ItemList);
        expect(lResult.items.length).toBe(2);
        expect(lResult.items[0]).toBeInstanceOf(Item);
        expect(lResult.items[0].id).toBe(1);
        expect(lResult.items[0].label).toBe('First');
        expect(lResult.items[1]).toBeInstanceOf(Item);
        expect(lResult.items[1].id).toBe(2);
        expect(lResult.items[1].label).toBe('Second');
    });
});

Deno.test('BlobSerializer circular reference', async (pContext) => {
    await pContext.step('Throw on circular reference during save', async () => {
        // Setup.
        const lUuid: string = 'blob-circular-throw';

        @Serializer.class(lUuid)
        class CircularObj {
            @Serializer.property()
            public self: CircularObj | null = null;
        }

        const lObj: CircularObj = new CircularObj();
        lObj.self = lObj;

        const lSerializer: BlobSerializer = new BlobSerializer();
        lSerializer.store('circular', lObj);

        // Process & Evaluation.
        try {
            await lSerializer.save();
            expect(true).toBe(false); // Should not reach here.
        } catch (pError) {
            expect((pError as Error).message).toBe('Circular reference detected during serialization.');
        }
    });
});

Deno.test('BlobSerializer.contents', async (pContext) => {
    await pContext.step('Return contents of loaded blob with single entry', async () => {
        // Setup.
        const lUuid: string = 'blob-contents-single';

        @Serializer.class(lUuid)
        class TestObj {
            @Serializer.property()
            public name: string = 'Test';
        }

        const lSaveSerializer: BlobSerializer = new BlobSerializer();
        lSaveSerializer.store('my/path', new TestObj());
        const lBlob: Blob = await lSaveSerializer.save();

        const lLoadSerializer: BlobSerializer = new BlobSerializer();
        await lLoadSerializer.load(lBlob);

        // Process.
        const lContents: Array<BlobContentEntry> = lLoadSerializer.contents;

        // Evaluation.
        expect(lContents.length).toBe(1);
        expect(lContents[0].path).toBe('my/path');
        expect(lContents[0].byteLength).toBeGreaterThan(0);
        expect(lContents[0].classType).toBe(TestObj);
    });

    await pContext.step('Return contents of loaded blob with multiple entries', async () => {
        // Setup.
        const lUuidA: string = 'blob-contents-multi-a';
        const lUuidB: string = 'blob-contents-multi-b';

        @Serializer.class(lUuidA)
        class TypeA {
            @Serializer.property()
            public value: number = 1;
        }

        @Serializer.class(lUuidB)
        class TypeB {
            @Serializer.property()
            public label: string = 'hello';
        }

        const lSaveSerializer: BlobSerializer = new BlobSerializer();
        lSaveSerializer.store('entries/a', new TypeA());
        lSaveSerializer.store('entries/b', new TypeB());
        const lBlob: Blob = await lSaveSerializer.save();

        const lLoadSerializer: BlobSerializer = new BlobSerializer();
        await lLoadSerializer.load(lBlob);

        // Process.
        const lContents: Array<BlobContentEntry> = lLoadSerializer.contents;

        // Evaluation.
        expect(lContents.length).toBe(2);

        const lEntryA: BlobContentEntry | undefined = lContents.find((pEntry: BlobContentEntry) => pEntry.path === 'entries/a');
        const lEntryB: BlobContentEntry | undefined = lContents.find((pEntry: BlobContentEntry) => pEntry.path === 'entries/b');

        expect(lEntryA).toBeDefined();
        expect(lEntryA!.classType).toBe(TypeA);
        expect(lEntryA!.byteLength).toBeGreaterThan(0);

        expect(lEntryB).toBeDefined();
        expect(lEntryB!.classType).toBe(TypeB);
        expect(lEntryB!.byteLength).toBeGreaterThan(0);
    });

    await pContext.step('Return empty array when no blob loaded', () => {
        // Setup.
        const lSerializer: BlobSerializer = new BlobSerializer();

        // Process.
        const lContents: Array<BlobContentEntry> = lSerializer.contents;

        // Evaluation.
        expect(lContents.length).toBe(0);
    });
});

Deno.test('BlobSerializer.store() without blob loaded', async (pContext) => {
    await pContext.step('Store and save without loading a blob first', async () => {
        // Setup.
        const lUuid: string = 'blob-store-no-load';

        @Serializer.class(lUuid)
        class TestObj {
            @Serializer.property()
            public value: number = 0;
        }

        const lSerializer: BlobSerializer = new BlobSerializer();
        const lObj: TestObj = new TestObj();
        lObj.value = 42;

        // Process.
        lSerializer.store('test', lObj);
        const lBlob: Blob = await lSerializer.save();

        // Evaluation.
        const lLoadSerializer: BlobSerializer = new BlobSerializer();
        await lLoadSerializer.load(lBlob);
        const lResult: TestObj = await lLoadSerializer.read<TestObj>('test');
        expect(lResult.value).toBe(42);
    });
});

Deno.test('BlobSerializer.store() into loaded blob', async (pContext) => {
    await pContext.step('Add new entry to loaded blob', async () => {
        // Setup.
        const lUuid: string = 'blob-store-into-loaded';

        @Serializer.class(lUuid)
        class TestObj {
            @Serializer.property()
            public value: number = 0;
        }

        // Create initial blob with one entry.
        const lInitialSerializer: BlobSerializer = new BlobSerializer();
        const lObj1: TestObj = new TestObj();
        lObj1.value = 1;
        lInitialSerializer.store('entry/one', lObj1);
        const lInitialBlob: Blob = await lInitialSerializer.save();

        // Load the blob and add a new entry.
        const lMergeSerializer: BlobSerializer = new BlobSerializer();
        await lMergeSerializer.load(lInitialBlob);

        const lObj2: TestObj = new TestObj();
        lObj2.value = 2;
        lMergeSerializer.store('entry/two', lObj2);

        // Process.
        const lMergedBlob: Blob = await lMergeSerializer.save();

        // Evaluation. Both entries should be present.
        const lVerifySerializer: BlobSerializer = new BlobSerializer();
        await lVerifySerializer.load(lMergedBlob);

        const lResult1: TestObj = await lVerifySerializer.read<TestObj>('entry/one');
        const lResult2: TestObj = await lVerifySerializer.read<TestObj>('entry/two');

        expect(lResult1.value).toBe(1);
        expect(lResult2.value).toBe(2);
    });

    await pContext.step('Override existing entry in loaded blob', async () => {
        // Setup.
        const lUuid: string = 'blob-store-override-loaded';

        @Serializer.class(lUuid)
        class TestObj {
            @Serializer.property()
            public value: number = 0;
        }

        // Create initial blob with one entry.
        const lInitialSerializer: BlobSerializer = new BlobSerializer();
        const lObj1: TestObj = new TestObj();
        lObj1.value = 1;
        lInitialSerializer.store('entry', lObj1);
        const lInitialBlob: Blob = await lInitialSerializer.save();

        // Load the blob and override the entry.
        const lMergeSerializer: BlobSerializer = new BlobSerializer();
        await lMergeSerializer.load(lInitialBlob);

        const lObj2: TestObj = new TestObj();
        lObj2.value = 99;
        lMergeSerializer.store('entry', lObj2);

        // Process.
        const lMergedBlob: Blob = await lMergeSerializer.save();

        // Evaluation.
        const lVerifySerializer: BlobSerializer = new BlobSerializer();
        await lVerifySerializer.load(lMergedBlob);

        const lResult: TestObj = await lVerifySerializer.read<TestObj>('entry');
        expect(lResult.value).toBe(99);

        expect(lVerifySerializer.contents.length).toBe(1);
    });

    await pContext.step('Loaded entries preserved alongside new entries', async () => {
        // Setup.
        const lUuidA: string = 'blob-store-preserve-a';
        const lUuidB: string = 'blob-store-preserve-b';

        @Serializer.class(lUuidA)
        class TypeA {
            @Serializer.property()
            public value: number = 0;
        }

        @Serializer.class(lUuidB)
        class TypeB {
            @Serializer.property()
            public label: string = '';
        }

        // Create initial blob with TypeA entry.
        const lInitialSerializer: BlobSerializer = new BlobSerializer();
        const lObjA: TypeA = new TypeA();
        lObjA.value = 10;
        lInitialSerializer.store('data/a', lObjA);
        const lInitialBlob: Blob = await lInitialSerializer.save();

        // Load and add TypeB entry.
        const lMergeSerializer: BlobSerializer = new BlobSerializer();
        await lMergeSerializer.load(lInitialBlob);

        const lObjB: TypeB = new TypeB();
        lObjB.label = 'Added';
        lMergeSerializer.store('data/b', lObjB);

        // Process.
        const lMergedBlob: Blob = await lMergeSerializer.save();

        // Evaluation.
        const lVerifySerializer: BlobSerializer = new BlobSerializer();
        await lVerifySerializer.load(lMergedBlob);

        const lResultA: TypeA = await lVerifySerializer.read<TypeA>('data/a');
        const lResultB: TypeB = await lVerifySerializer.read<TypeB>('data/b');

        expect(lResultA.value).toBe(10);
        expect(lResultB.label).toBe('Added');
        expect(lVerifySerializer.contents.length).toBe(2);
    });
});

Deno.test('BlobSerializer case-insensitive paths', async (pContext) => {
    await pContext.step('Store and read with different casing', async () => {
        // Setup.
        const lUuid: string = 'blob-case-insensitive';

        @Serializer.class(lUuid)
        class TestObj {
            @Serializer.property()
            public value: number = 0;
        }

        const lSerializer: BlobSerializer = new BlobSerializer();
        const lObj: TestObj = new TestObj();
        lObj.value = 42;
        lSerializer.store('MyFolder/MyClass', lObj);

        const lBlob: Blob = await lSerializer.save();
        const lLoadSerializer: BlobSerializer = new BlobSerializer();
        await lLoadSerializer.load(lBlob);

        // Process. Read with different casing.
        const lResult: TestObj = await lLoadSerializer.read<TestObj>('myfolder/myclass');

        // Evaluation.
        expect(lResult.value).toBe(42);
    });

    await pContext.step('Read with uppercase path matches lowercase stored path', async () => {
        // Setup.
        const lUuid: string = 'blob-case-upper';

        @Serializer.class(lUuid)
        class TestObj {
            @Serializer.property()
            public value: number = 0;
        }

        const lSerializer: BlobSerializer = new BlobSerializer();
        const lObj: TestObj = new TestObj();
        lObj.value = 7;
        lSerializer.store('lower/path', lObj);

        const lBlob: Blob = await lSerializer.save();
        const lLoadSerializer: BlobSerializer = new BlobSerializer();
        await lLoadSerializer.load(lBlob);

        // Process. Read with uppercase.
        const lResult: TestObj = await lLoadSerializer.read<TestObj>('LOWER/PATH');

        // Evaluation.
        expect(lResult.value).toBe(7);
    });

    await pContext.step('Store with different casing overwrites same path', async () => {
        // Setup.
        const lUuid: string = 'blob-case-overwrite';

        @Serializer.class(lUuid)
        class TestObj {
            @Serializer.property()
            public value: number = 0;
        }

        const lSerializer: BlobSerializer = new BlobSerializer();

        const lObj1: TestObj = new TestObj();
        lObj1.value = 1;
        lSerializer.store('Same/Path', lObj1);

        const lObj2: TestObj = new TestObj();
        lObj2.value = 2;
        lSerializer.store('same/path', lObj2);

        // Process.
        const lBlob: Blob = await lSerializer.save();
        const lLoadSerializer: BlobSerializer = new BlobSerializer();
        await lLoadSerializer.load(lBlob);

        // Evaluation. Only one entry should exist with the overwritten value.
        expect(lLoadSerializer.contents.length).toBe(1);
        const lResult: TestObj = await lLoadSerializer.read<TestObj>('SAME/PATH');
        expect(lResult.value).toBe(2);
    });

    await pContext.step('Contents paths are normalized to lowercase', async () => {
        // Setup.
        const lUuid: string = 'blob-case-contents';

        @Serializer.class(lUuid)
        class TestObj {
            @Serializer.property()
            public value: number = 0;
        }

        const lSerializer: BlobSerializer = new BlobSerializer();
        lSerializer.store('MyFolder/MyClass', new TestObj());

        const lBlob: Blob = await lSerializer.save();
        const lLoadSerializer: BlobSerializer = new BlobSerializer();
        await lLoadSerializer.load(lBlob);

        // Process.
        const lContents: Array<BlobContentEntry> = lLoadSerializer.contents;

        // Evaluation.
        expect(lContents[0].path).toBe('myfolder/myclass');
    });
});
