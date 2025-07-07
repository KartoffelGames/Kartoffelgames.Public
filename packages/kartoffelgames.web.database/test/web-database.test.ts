import 'npm:fake-indexeddb/auto';
import { expect } from '@kartoffelgames/core-test';
import { WebDatabase, WebDatabaseTable } from '../source/index.ts';

// Test table class
@WebDatabase.table('TestTable')
class TestTable {
    @WebDatabase.identity(true)
    public identity!: number;

    @WebDatabase.field('name', true)
    public name!: string;

    @WebDatabase.field('multi', true, true)
    public multi!: Array<string>;

    @WebDatabase.field()
    public someValue!: string;
}

@WebDatabase.table('SimpleTable')
class SimpleTable {
    @WebDatabase.identity(false)
    public id!: string;

    @WebDatabase.field()
    public data!: string;
}

Deno.test('WebDatabase.constructor', async (pContext) => {
    await pContext.step('Table - Identity-Autoincrement', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableIdentityPropertyName: string = 'myIdentity';
        const lTableIdentityAutoincrement: boolean = true;

        // Setup. Table
        @WebDatabase.table('TestTable')
        class TestTable {
            @WebDatabase.identity(lTableIdentityAutoincrement)
            public [lTableIdentityPropertyName]!: number;
        }

        // Process.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Evaluation. 
        const lIndexDb: IDBDatabase = await lWebDatabase.open();
        expect(lIndexDb.name).toEqual(lDatabaseName);
        expect(lIndexDb.objectStoreNames).toHaveLength(1);
        expect(lIndexDb.objectStoreNames).toContain('TestTable');

        // Evaluation. Validate table layout.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lWebDbTransaction: IDBTransaction = pTransaction.transaction;

            // Validate object store.
            const lTestTableObjectStore: IDBObjectStore = lWebDbTransaction.objectStore(TestTable.name);
            expect(lTestTableObjectStore.name).toEqual('TestTable');

            // Validate identity field.
            expect(lTestTableObjectStore.keyPath).toEqual(lTableIdentityPropertyName);
            expect(lTestTableObjectStore.autoIncrement).toEqual(lTableIdentityAutoincrement);

            expect(lTestTableObjectStore.indexNames).toHaveLength(0);
        });
    });

    await pContext.step('Table - Index-Unique', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);  
        const lTableIndexPropertyName: string = 'myName';
        const lTableIndexName: string = 'indexName';

        // Setup. Table
        @WebDatabase.table('TestTable')
        class TestTable {
            @WebDatabase.field(lTableIndexName, true)
            public [lTableIndexPropertyName]!: string;
        }

        // Process.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Evaluation. 
        const lIndexDb: IDBDatabase = await lWebDatabase.open();
        expect(lIndexDb.name).toEqual(lDatabaseName);
        expect(lIndexDb.objectStoreNames).toHaveLength(1);
        expect(lIndexDb.objectStoreNames).toContain('TestTable');

        // Evaluation. Validate table layout.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lWebDbTransaction: IDBTransaction = pTransaction.transaction;

            // Validate object store.
            const lTestTableObjectStore: IDBObjectStore = lWebDbTransaction.objectStore(TestTable.name);
            expect(lTestTableObjectStore.name).toEqual('TestTable');

            // Validate identity field.
            expect(lTestTableObjectStore.keyPath).toBeNull();

            // Validate index list.
            expect(lTestTableObjectStore.indexNames).toHaveLength(1);
            expect(lTestTableObjectStore.indexNames).toContain(lTableIndexName);

            // Validate index.
            const lIndex: IDBIndex = lTestTableObjectStore.index(lTableIndexName);
            expect(lIndex.name).toEqual(lTableIndexName);
            expect(lIndex.unique).toBeTruthy();
            expect(lIndex.keyPath).toEqual(lTableIndexPropertyName);
            expect(lIndex.multiEntry).toBeFalsy();
        });
    });

    await pContext.step('Table - Identity', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableIdentityPropertyName: string = 'myId';
        const lTableIdentityAutoincrement: boolean = false;

        // Setup. Table
        @WebDatabase.table('TestTable')
        class TestTable {
            @WebDatabase.identity(lTableIdentityAutoincrement)
            public [lTableIdentityPropertyName]!: string;
        }

        // Process.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Evaluation. 
        const lIndexDb: IDBDatabase = await lWebDatabase.open();
        expect(lIndexDb.name).toEqual(lDatabaseName);
        expect(lIndexDb.objectStoreNames).toHaveLength(1);
        expect(lIndexDb.objectStoreNames).toContain('TestTable');

        // Evaluation. Validate table layout.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lWebDbTransaction: IDBTransaction = pTransaction.transaction;

            // Validate object store.
            const lTestTableObjectStore: IDBObjectStore = lWebDbTransaction.objectStore(TestTable.name);
            expect(lTestTableObjectStore.name).toEqual('TestTable');

            // Validate identity field.
            expect(lTestTableObjectStore.keyPath).toEqual(lTableIdentityPropertyName);
            expect(lTestTableObjectStore.autoIncrement).toEqual(lTableIdentityAutoincrement);

            expect(lTestTableObjectStore.indexNames).toHaveLength(0);
        });
    });

    await pContext.step('Table - Index-Multi-Unique', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableIndexPropertyName: string = 'myTags';
        const lTableIndexName: string = 'tagsIndex';

        // Setup. Table
        @WebDatabase.table('TestTable')
        class TestTable {
            @WebDatabase.field(lTableIndexName, false, true)
            public [lTableIndexPropertyName]!: Array<string>;
        }

        // Process.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Evaluation. 
        const lIndexDb: IDBDatabase = await lWebDatabase.open();
        expect(lIndexDb.name).toEqual(lDatabaseName);
        expect(lIndexDb.objectStoreNames).toHaveLength(1);
        expect(lIndexDb.objectStoreNames).toContain('TestTable');

        // Evaluation. Validate table layout.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lWebDbTransaction: IDBTransaction = pTransaction.transaction;

            // Validate object store.
            const lTestTableObjectStore: IDBObjectStore = lWebDbTransaction.objectStore(TestTable.name);
            expect(lTestTableObjectStore.name).toEqual('TestTable');

            // Validate identity field.
            expect(lTestTableObjectStore.keyPath).toBeNull();

            // Validate index list.
            expect(lTestTableObjectStore.indexNames).toHaveLength(1);
            expect(lTestTableObjectStore.indexNames).toContain(lTableIndexName);

            // Validate index.
            const lIndex: IDBIndex = lTestTableObjectStore.index(lTableIndexName);
            expect(lIndex.name).toEqual(lTableIndexName);
            expect(lIndex.unique).toBeFalsy();
            expect(lIndex.keyPath).toEqual(lTableIndexPropertyName);
            expect(lIndex.multiEntry).toBeTruthy();
        });
    });

    await pContext.step('Table - Index', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableIndexPropertyName: string = 'myCategory';
        const lTableIndexName: string = 'categoryIndex';

        // Setup. Table
        @WebDatabase.table('TestTable')
        class TestTable {
            @WebDatabase.field(lTableIndexName)
            public [lTableIndexPropertyName]!: string;
        }

        // Process.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Evaluation. 
        const lIndexDb: IDBDatabase = await lWebDatabase.open();
        expect(lIndexDb.name).toEqual(lDatabaseName);
        expect(lIndexDb.objectStoreNames).toHaveLength(1);
        expect(lIndexDb.objectStoreNames).toContain('TestTable');

        // Evaluation. Validate table layout.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lWebDbTransaction: IDBTransaction = pTransaction.transaction;

            // Validate object store.
            const lTestTableObjectStore: IDBObjectStore = lWebDbTransaction.objectStore(TestTable.name);
            expect(lTestTableObjectStore.name).toEqual('TestTable');

            // Validate identity field.
            expect(lTestTableObjectStore.keyPath).toBeNull();

            // Validate index list.
            expect(lTestTableObjectStore.indexNames).toHaveLength(1);
            expect(lTestTableObjectStore.indexNames).toContain(lTableIndexName);

            // Validate index.
            const lIndex: IDBIndex = lTestTableObjectStore.index(lTableIndexName);
            expect(lIndex.name).toEqual(lTableIndexName);
            expect(lIndex.unique).toBeFalsy();
            expect(lIndex.keyPath).toEqual(lTableIndexPropertyName);
            expect(lIndex.multiEntry).toBeFalsy();
        });
    });

    await pContext.step('Table - Index-Compound', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableIndexProperty1Name: string = 'firstName';
        const lTableIndexProperty2Name: string = 'lastName';
        const lTableIndexName: string = 'fullNameIndex';

        // Setup. Table
        @WebDatabase.table('TestTable')
        class TestTable {
            @WebDatabase.field(lTableIndexName, false, false)
            public [lTableIndexProperty1Name]!: string;

            @WebDatabase.field(lTableIndexName, false, false)
            public [lTableIndexProperty2Name]!: string;
        }

        // Process.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Evaluation. 
        const lIndexDb: IDBDatabase = await lWebDatabase.open();
        expect(lIndexDb.name).toEqual(lDatabaseName);
        expect(lIndexDb.objectStoreNames).toHaveLength(1);
        expect(lIndexDb.objectStoreNames).toContain('TestTable');

        // Evaluation. Validate table layout.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lWebDbTransaction: IDBTransaction = pTransaction.transaction;

            // Validate object store.
            const lTestTableObjectStore: IDBObjectStore = lWebDbTransaction.objectStore(TestTable.name);
            expect(lTestTableObjectStore.name).toEqual('TestTable');

            // Validate identity field.
            expect(lTestTableObjectStore.keyPath).toBeNull();

            // Validate index list.
            expect(lTestTableObjectStore.indexNames).toHaveLength(1);
            expect(lTestTableObjectStore.indexNames).toContain(lTableIndexName);

            // Validate compound index.
            const lIndex: IDBIndex = lTestTableObjectStore.index(lTableIndexName);
            expect(lIndex.name).toEqual(lTableIndexName);
            expect(lIndex.unique).toBeFalsy();
            expect(lIndex.keyPath).toEqual([lTableIndexProperty1Name, lTableIndexProperty2Name]);
            expect(lIndex.multiEntry).toBeFalsy();
        });
    });

    await pContext.step('Table - Index-Compound-Unique', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableIndexProperty1Name: string = 'firstName';
        const lTableIndexProperty2Name: string = 'lastName';
        const lTableIndexName: string = 'uniqueFullNameIndex';

        // Setup. Table
        @WebDatabase.table('TestTable')
        class TestTable {
            @WebDatabase.field(lTableIndexName, true, false)
            public [lTableIndexProperty1Name]!: string;

            @WebDatabase.field(lTableIndexName, true, false)
            public [lTableIndexProperty2Name]!: string;
        }

        // Process.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Evaluation. 
        const lIndexDb: IDBDatabase = await lWebDatabase.open();
        expect(lIndexDb.name).toEqual(lDatabaseName);
        expect(lIndexDb.objectStoreNames).toHaveLength(1);
        expect(lIndexDb.objectStoreNames).toContain('TestTable');

        // Evaluation. Validate table layout.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lWebDbTransaction: IDBTransaction = pTransaction.transaction;

            // Validate object store.
            const lTestTableObjectStore: IDBObjectStore = lWebDbTransaction.objectStore(TestTable.name);
            expect(lTestTableObjectStore.name).toEqual('TestTable');

            // Validate identity field.
            expect(lTestTableObjectStore.keyPath).toBeNull();

            // Validate index list.
            expect(lTestTableObjectStore.indexNames).toHaveLength(1);
            expect(lTestTableObjectStore.indexNames).toContain(lTableIndexName);

            // Validate compound unique index.
            const lIndex: IDBIndex = lTestTableObjectStore.index(lTableIndexName);
            expect(lIndex.name).toEqual(lTableIndexName);
            expect(lIndex.unique).toBeTruthy();
            expect(lIndex.keyPath).toEqual([lTableIndexProperty1Name, lTableIndexProperty2Name]);
            expect(lIndex.multiEntry).toBeFalsy();
        });
    });

    await pContext.step('Table - Index-Multi-Unique', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableIndexPropertyName: string = 'uniqueTags';
        const lTableIndexName: string = 'uniqueTagsIndex';

        // Setup. Table
        @WebDatabase.table('TestTable')
        class TestTable {
            @WebDatabase.field(lTableIndexName, true, true)
            public [lTableIndexPropertyName]!: Array<string>;
        }

        // Process.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Evaluation. 
        const lIndexDb: IDBDatabase = await lWebDatabase.open();
        expect(lIndexDb.name).toEqual(lDatabaseName);
        expect(lIndexDb.objectStoreNames).toHaveLength(1);
        expect(lIndexDb.objectStoreNames).toContain('TestTable');

        // Evaluation. Validate table layout.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lWebDbTransaction: IDBTransaction = pTransaction.transaction;

            // Validate object store.
            const lTestTableObjectStore: IDBObjectStore = lWebDbTransaction.objectStore(TestTable.name);
            expect(lTestTableObjectStore.name).toEqual('TestTable');

            // Validate identity field.
            expect(lTestTableObjectStore.keyPath).toBeNull();

            // Validate index list.
            expect(lTestTableObjectStore.indexNames).toHaveLength(1);
            expect(lTestTableObjectStore.indexNames).toContain(lTableIndexName);

            // Validate multi-entry unique index.
            const lIndex: IDBIndex = lTestTableObjectStore.index(lTableIndexName);
            expect(lIndex.name).toEqual(lTableIndexName);
            expect(lIndex.unique).toBeTruthy();
            expect(lIndex.keyPath).toEqual(lTableIndexPropertyName);
            expect(lIndex.multiEntry).toBeTruthy();
        });
    });

    await pContext.step('Table - Index-Multi-Compound', async () => {
        // Setup. Table configuration.
        const lTableIndexProperty1Name: string = 'categories';
        const lTableIndexProperty2Name: string = 'status';
        const lTableIndexName: string = 'categoriesStatusIndex';

        // Process.
        const lFailFunction = () => {
            @WebDatabase.table('TestTable')
            class TestTable {
                @WebDatabase.field(lTableIndexName, false, true)
                public [lTableIndexProperty1Name]!: Array<string>;

                @WebDatabase.field(lTableIndexName, false, true)
                public [lTableIndexProperty2Name]!: string;
            }
        }

        //Evaluation.
        expect(lFailFunction).toThrow('Multientity index can only have one property.');
    });

    await pContext.step('Table - Index-Multi-Compound-Unique', async () => {
        // Setup. Table configuration.
        const lTableIndexProperty1Name: string = 'uniqueCategories';
        const lTableIndexProperty2Name: string = 'uniqueStatus';
        const lTableIndexName: string = 'uniqueCategoriesStatusIndex';

        // Process.
        const lFailFunction = () => {
            @WebDatabase.table('TestTable')
            class TestTable {
                @WebDatabase.field(lTableIndexName, true, true)
                public [lTableIndexProperty1Name]!: Array<string>;

                @WebDatabase.field(lTableIndexName, true, true)
                public [lTableIndexProperty2Name]!: string;
            }
        }

        //Evaluation.
        expect(lFailFunction).toThrow('Multientity index can only have one property.');
    });
});
