import { expect } from '@kartoffelgames/core-test';
import 'npm:fake-indexeddb/auto';
import { WebDatabase } from '../source/index.ts';

// TODO: Test: Update a table from non unique index to unique index with unique data.
// TODO: Test: Update a table from non unique index to unique index with data where the key is not unique.

const gEmptyIdentityValidate = (pTable: IDBObjectStore): void => {
    expect(pTable.keyPath).toBe('__id__');
    expect(pTable.autoIncrement).toBeTruthy();
};

// Sanitize disabled because timers are started outside of the test in fake-indexeddb.
Deno.test('WebDatabase.open()', { sanitizeResources: false, sanitizeOps: false }, async (pContext) => {
    await pContext.step('Create Table - Identity-Autoincrement', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableName: string = 'TestTable';
        const lTableIdentityPropertyName: string = 'id';
        const lTableIdentityAutoincrement: boolean = true;

        // Setup. Table
        @WebDatabase.table(lTableName)
        class TestTable {
            @WebDatabase.field({ as: { identity: lTableIdentityAutoincrement ? 'auto' : 'manual' } })
            public [lTableIdentityPropertyName]!: number;
        }

        // Process.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Evaluation. 
        const lIndexDb: IDBDatabase = await lWebDatabase.open();
        expect(lIndexDb.name).toEqual(lDatabaseName);
        expect(lIndexDb.objectStoreNames).toHaveLength(1);
        expect(lIndexDb.objectStoreNames).toContain(lTableName);

        // Evaluation. Validate table layout.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lWebDbTransaction: IDBTransaction = pTransaction.transaction;

            // Validate object lStore.
            const lTestTableObjectStore: IDBObjectStore = lWebDbTransaction.objectStore(TestTable.name);
            expect(lTestTableObjectStore.name).toEqual(lTableName);

            // Validate identity field.
            expect(lTestTableObjectStore.keyPath).toEqual(lTableIdentityPropertyName);
            expect(lTestTableObjectStore.autoIncrement).toEqual(lTableIdentityAutoincrement);

            expect(lTestTableObjectStore.indexNames).toHaveLength(0);
        });

        // Cleanup. Close the database.
        lWebDatabase.close();
    });

    await pContext.step('Create Table - Index-Unique', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableName: string = 'TestTable';
        const lTableIndexPropertyName: string = 'indexOne';

        // Setup. Table
        @WebDatabase.table(lTableName)
        class TestTable {
            @WebDatabase.field({ as: { index: { unique: true } } })
            public [lTableIndexPropertyName]!: string;
        }

        // Process.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Evaluation. 
        const lIndexDb: IDBDatabase = await lWebDatabase.open();
        expect(lIndexDb.name).toEqual(lDatabaseName);
        expect(lIndexDb.objectStoreNames).toHaveLength(1);
        expect(lIndexDb.objectStoreNames).toContain(lTableName);

        // Evaluation. Validate table layout.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lWebDbTransaction: IDBTransaction = pTransaction.transaction;

            // Validate object lStore.
            const lTestTableObjectStore: IDBObjectStore = lWebDbTransaction.objectStore(lTableName);
            expect(lTestTableObjectStore.name).toEqual(lTableName);

            // Validate identity field.
            gEmptyIdentityValidate(lTestTableObjectStore);

            // Validate index list.
            expect(lTestTableObjectStore.indexNames).toHaveLength(1);
            expect(lTestTableObjectStore.indexNames).toContain(lTableIndexPropertyName);

            // Validate index.
            const lIndex: IDBIndex = lTestTableObjectStore.index(lTableIndexPropertyName);
            expect(lIndex.name).toEqual(lTableIndexPropertyName);
            expect(lIndex.unique).toBeTruthy();
            expect(lIndex.keyPath).toEqual(lTableIndexPropertyName);
            expect(lIndex.multiEntry).toBeFalsy();
        });

        // Cleanup. Close the database.
        lWebDatabase.close();
    });

    await pContext.step('Create Table - Identity', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableName: string = 'TestTable';
        const lTableIdentityPropertyName: string = 'id';
        const lTableIdentityAutoincrement: boolean = false;

        // Setup. Table
        @WebDatabase.table(lTableName)
        class TestTable {
            @WebDatabase.field({ as: { identity: 'manual' } })
            public [lTableIdentityPropertyName]!: string;
        }

        // Process.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Evaluation. 
        const lIndexDb: IDBDatabase = await lWebDatabase.open();
        expect(lIndexDb.name).toEqual(lDatabaseName);
        expect(lIndexDb.objectStoreNames).toHaveLength(1);
        expect(lIndexDb.objectStoreNames).toContain(lTableName);

        // Evaluation. Validate table layout.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lWebDbTransaction: IDBTransaction = pTransaction.transaction;

            // Validate object lStore.
            const lTestTableObjectStore: IDBObjectStore = lWebDbTransaction.objectStore(TestTable.name);
            expect(lTestTableObjectStore.name).toEqual(lTableName);

            // Validate identity field.
            expect(lTestTableObjectStore.keyPath).toEqual(lTableIdentityPropertyName);
            expect(lTestTableObjectStore.autoIncrement).toEqual(lTableIdentityAutoincrement);

            expect(lTestTableObjectStore.indexNames).toHaveLength(0);
        });

        // Cleanup. Close the database.
        lWebDatabase.close();
    });

    await pContext.step('Create Table - Index-Multi-Unique', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableName: string = 'TestTable';
        const lTableIndexPropertyName: string = 'indexOne';
        const lTableIndexUnique: boolean = true;
        const lTableIndexMulti: boolean = true;

        // Setup. Table
        @WebDatabase.table(lTableName)
        class TestTable {
            @WebDatabase.field({ as: { index: { multiEntry: lTableIndexMulti, unique: lTableIndexUnique } } })
            public [lTableIndexPropertyName]!: Array<string>;
        }

        // Process.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Evaluation. 
        const lIndexDb: IDBDatabase = await lWebDatabase.open();
        expect(lIndexDb.name).toEqual(lDatabaseName);
        expect(lIndexDb.objectStoreNames).toHaveLength(1);
        expect(lIndexDb.objectStoreNames).toContain(lTableName);

        // Evaluation. Validate table layout.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lWebDbTransaction: IDBTransaction = pTransaction.transaction;

            // Validate object lStore.
            const lTestTableObjectStore: IDBObjectStore = lWebDbTransaction.objectStore(TestTable.name);
            expect(lTestTableObjectStore.name).toEqual(lTableName);

            // Validate identity field.
            gEmptyIdentityValidate(lTestTableObjectStore);
            // Validate index list.
            expect(lTestTableObjectStore.indexNames).toHaveLength(1);
            expect(lTestTableObjectStore.indexNames).toContain(lTableIndexPropertyName);

            // Validate index.
            const lIndex: IDBIndex = lTestTableObjectStore.index(lTableIndexPropertyName);
            expect(lIndex.name).toEqual(lTableIndexPropertyName);
            expect(lIndex.unique).toBe(lTableIndexUnique);
            expect(lIndex.keyPath).toEqual(lTableIndexPropertyName);
            expect(lIndex.multiEntry).toBe(lTableIndexMulti);
        });

        // Cleanup. Close the database.
        lWebDatabase.close();
    });

    await pContext.step('Create Table - Index', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableName: string = 'TestTable';
        const lTableIndexPropertyName: string = 'indexOne';

        // Setup. Table
        @WebDatabase.table(lTableName)
        class TestTable {
            @WebDatabase.field({ as: { index: {} } })
            public [lTableIndexPropertyName]!: string;
        }

        // Process.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Evaluation. 
        const lIndexDb: IDBDatabase = await lWebDatabase.open();
        expect(lIndexDb.name).toEqual(lDatabaseName);
        expect(lIndexDb.objectStoreNames).toHaveLength(1);
        expect(lIndexDb.objectStoreNames).toContain(lTableName);

        // Evaluation. Validate table layout.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lWebDbTransaction: IDBTransaction = pTransaction.transaction;

            // Validate object lStore.
            const lTestTableObjectStore: IDBObjectStore = lWebDbTransaction.objectStore(TestTable.name);
            expect(lTestTableObjectStore.name).toEqual(lTableName);

            // Validate identity field.
            gEmptyIdentityValidate(lTestTableObjectStore);

            // Validate index list.
            expect(lTestTableObjectStore.indexNames).toHaveLength(1);
            expect(lTestTableObjectStore.indexNames).toContain(lTableIndexPropertyName);

            // Validate index.
            const lIndex: IDBIndex = lTestTableObjectStore.index(lTableIndexPropertyName);
            expect(lIndex.name).toEqual(lTableIndexPropertyName);
            expect(lIndex.unique).toBeFalsy();
            expect(lIndex.keyPath).toEqual(lTableIndexPropertyName);
            expect(lIndex.multiEntry).toBeFalsy();
        });

        // Cleanup. Close the database.
        lWebDatabase.close();
    });

    await pContext.step('Create Table - Index-Compound', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableName: string = 'TestTable';
        const lTableIndexProperty1Name: string = 'indexOne';
        const lTableIndexProperty2Name: string = 'indexTwo';

        // Setup. Table
        @WebDatabase.table(lTableName, {
            with: [{
                properties: [lTableIndexProperty1Name, lTableIndexProperty2Name]
            }]
        })
        class TestTable {
            @WebDatabase.field()
            public [lTableIndexProperty1Name]!: string;

            @WebDatabase.field()
            public [lTableIndexProperty2Name]!: string;
        }

        // Process.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Evaluation. 
        const lIndexDb: IDBDatabase = await lWebDatabase.open();
        expect(lIndexDb.name).toEqual(lDatabaseName);
        expect(lIndexDb.objectStoreNames).toHaveLength(1);
        expect(lIndexDb.objectStoreNames).toContain(lTableName);

        // Evaluation. Validate table layout.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lWebDbTransaction: IDBTransaction = pTransaction.transaction;

            // Validate object lStore.
            const lTestTableObjectStore: IDBObjectStore = lWebDbTransaction.objectStore(TestTable.name);
            expect(lTestTableObjectStore.name).toEqual(lTableName);

            // Validate identity field.
            gEmptyIdentityValidate(lTestTableObjectStore);

            // Validate index list.
            expect(lTestTableObjectStore.indexNames).toHaveLength(1);
            expect(lTestTableObjectStore.indexNames).toContain(`${lTableIndexProperty1Name}+${lTableIndexProperty2Name}`);

            // Validate compound index.
            const lIndex: IDBIndex = lTestTableObjectStore.index(`${lTableIndexProperty1Name}+${lTableIndexProperty2Name}`);
            expect(lIndex.name).toEqual(`${lTableIndexProperty1Name}+${lTableIndexProperty2Name}`);
            expect(lIndex.unique).toBeFalsy();
            expect(lIndex.keyPath).toEqual([lTableIndexProperty1Name, lTableIndexProperty2Name]);
            expect(lIndex.multiEntry).toBeFalsy();
        });

        // Cleanup. Close the database.
        lWebDatabase.close();
    });

    await pContext.step('Create Table - Index-Compound-Unique', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableName: string = 'TestTable';
        const lTableIndexProperty1Name: string = 'indexOne';
        const lTableIndexProperty2Name: string = 'indexTwo';
        const lTableIndexUnique: boolean = true;

        // Setup. Table
        @WebDatabase.table(lTableName, {
            with: [{
                properties: [lTableIndexProperty1Name, lTableIndexProperty2Name],
                unique: lTableIndexUnique
            }]
        })
        class TestTable {
            @WebDatabase.field()
            public [lTableIndexProperty1Name]!: string;

            @WebDatabase.field()
            public [lTableIndexProperty2Name]!: string;
        }

        // Process.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Evaluation. 
        const lIndexDb: IDBDatabase = await lWebDatabase.open();
        expect(lIndexDb.name).toEqual(lDatabaseName);
        expect(lIndexDb.objectStoreNames).toHaveLength(1);
        expect(lIndexDb.objectStoreNames).toContain(lTableName);

        // Evaluation. Validate table layout.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lWebDbTransaction: IDBTransaction = pTransaction.transaction;

            // Validate object lStore.
            const lTestTableObjectStore: IDBObjectStore = lWebDbTransaction.objectStore(TestTable.name);
            expect(lTestTableObjectStore.name).toEqual(lTableName);

            // Validate identity field.
            gEmptyIdentityValidate(lTestTableObjectStore);

            // Validate index list.
            expect(lTestTableObjectStore.indexNames).toHaveLength(1);
            expect(lTestTableObjectStore.indexNames).toContain(`${lTableIndexProperty1Name}+${lTableIndexProperty2Name}`);

            // Validate compound unique index.
            const lIndex: IDBIndex = lTestTableObjectStore.index(`${lTableIndexProperty1Name}+${lTableIndexProperty2Name}`);
            expect(lIndex.name).toEqual(`${lTableIndexProperty1Name}+${lTableIndexProperty2Name}`);
            expect(lIndex.unique).toBe(lTableIndexUnique);
            expect(lIndex.keyPath).toEqual([lTableIndexProperty1Name, lTableIndexProperty2Name]);
            expect(lIndex.multiEntry).toBeFalsy();
        });

        // Cleanup. Close the database.
        lWebDatabase.close();
    });

    await pContext.step('Create Table - Index-Multi-Unique', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableName: string = 'TestTable';
        const lTableIndexPropertyName: string = 'indexOne';
        const lTableIndexUnique: boolean = true;
        const lTableIndexMulti: boolean = true;

        // Setup. Table
        @WebDatabase.table(lTableName)
        class TestTable {
            @WebDatabase.field({ as: { index: { unique: lTableIndexUnique, multiEntry: lTableIndexMulti } } })
            public [lTableIndexPropertyName]!: Array<string>;
        }

        // Process.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Evaluation. 
        const lIndexDb: IDBDatabase = await lWebDatabase.open();
        expect(lIndexDb.name).toEqual(lDatabaseName);
        expect(lIndexDb.objectStoreNames).toHaveLength(1);
        expect(lIndexDb.objectStoreNames).toContain(lTableName);

        // Evaluation. Validate table layout.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lWebDbTransaction: IDBTransaction = pTransaction.transaction;

            // Validate object lStore.
            const lTestTableObjectStore: IDBObjectStore = lWebDbTransaction.objectStore(TestTable.name);
            expect(lTestTableObjectStore.name).toEqual(lTableName);

            // Validate identity field.
            gEmptyIdentityValidate(lTestTableObjectStore);

            // Validate index list.
            expect(lTestTableObjectStore.indexNames).toHaveLength(1);
            expect(lTestTableObjectStore.indexNames).toContain(lTableIndexPropertyName);

            // Validate multi-entry unique index.
            const lIndex: IDBIndex = lTestTableObjectStore.index(lTableIndexPropertyName);
            expect(lIndex.name).toEqual(lTableIndexPropertyName);
            expect(lIndex.unique).toBe(lTableIndexUnique);
            expect(lIndex.keyPath).toEqual(lTableIndexPropertyName);
            expect(lIndex.multiEntry).toBe(lTableIndexMulti);
        });

        // Cleanup. Close the database.
        lWebDatabase.close();
    });

    await pContext.step('Create Table - Read name by table name', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableName: string = 'CustomTableName';

        // Setup. Table
        @WebDatabase.table(lTableName)
        class TestTable {
        }

        // Process.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Evaluation. 
        const lIndexDb: IDBDatabase = await lWebDatabase.open();
        expect(lIndexDb.name).toEqual(lDatabaseName);
        expect(lIndexDb.objectStoreNames).toHaveLength(1);
        expect(lIndexDb.objectStoreNames).toContain(lTableName);

        // Evaluation. Validate table layout.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lWebDbTransaction: IDBTransaction = pTransaction.transaction;

            // Validate object lStore.
            const lTestTableObjectStore: IDBObjectStore = lWebDbTransaction.objectStore(lTableName);
            expect(lTestTableObjectStore.name).toEqual(lTableName);
        });

        // Cleanup. Close the database.
        lWebDatabase.close();
    });

    await pContext.step('Update database - Add Table', async () => {
        // Setup. Database configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lInitialTableName: string = 'InitialTable';
        const lNewTableName: string = 'NewTable';
        const lInitialTableIndexPropertyName: string = 'name';
        const lNewTableIdentityPropertyName: string = 'id';
        const lNewTableIndexPropertyName: string = 'value';

        // Setup. Create initial database with native IndexedDB API.
        const lInitialDb: IDBDatabase = await new Promise<IDBDatabase>((pResolve, pReject) => {
            const lRequest = indexedDB.open(lDatabaseName, 1);
            lRequest.onerror = () => pReject(lRequest.error);
            lRequest.onsuccess = () => pResolve(lRequest.result);
            lRequest.onupgradeneeded = () => {
                lRequest.result.createObjectStore(lInitialTableName);
            };
        });
        lInitialDb.close();

        // Setup. Table definitions for WebDatabase.
        @WebDatabase.table(lInitialTableName)
        class InitialTable {
            @WebDatabase.field({ as: { index: {} } })
            public [lInitialTableIndexPropertyName]!: string;
        }

        @WebDatabase.table(lNewTableName)
        class NewTable {
            @WebDatabase.field({ as: { identity: 'auto' } })
            public [lNewTableIdentityPropertyName]!: number;

            @WebDatabase.field({ as: { index: {} } })
            public [lNewTableIndexPropertyName]!: string;
        }

        // Process. Update database with WebDatabase.
        const lWebDatabase = new WebDatabase(lDatabaseName, [InitialTable, NewTable]);
        const lUpdatedDb: IDBDatabase = await lWebDatabase.open();

        // Evaluation. Verify both tables exist.
        expect(lUpdatedDb.objectStoreNames).toHaveLength(2);
        expect(lUpdatedDb.objectStoreNames).toContain(lInitialTableName);
        expect(lUpdatedDb.objectStoreNames).toContain(lNewTableName);

        // Evaluation. Verify existing table is unchanged.
        await lWebDatabase.transaction([InitialTable], 'readonly', async (pTransaction) => {
            const lInitialTableStore: IDBObjectStore = pTransaction.transaction.objectStore(lInitialTableName);
            gEmptyIdentityValidate(lInitialTableStore);
            expect(lInitialTableStore.indexNames).toHaveLength(1);
            expect(lInitialTableStore.indexNames).toContain(lInitialTableIndexPropertyName);
        });

        // Evaluation. Verify new table is created correctly.
        await lWebDatabase.transaction([NewTable], 'readonly', async (pTransaction) => {
            const lNewTableStore: IDBObjectStore = pTransaction.transaction.objectStore(lNewTableName);
            expect(lNewTableStore.name).toEqual(lNewTableName);
            expect(lNewTableStore.keyPath).toEqual(lNewTableIdentityPropertyName);
            expect(lNewTableStore.autoIncrement).toBeTruthy();
            expect(lNewTableStore.indexNames).toHaveLength(1);
            expect(lNewTableStore.indexNames).toContain(lNewTableIndexPropertyName);
        });

        // Cleanup. Close the database.
        lWebDatabase.close();
    });

    await pContext.step('Update database - Remove Table', async () => {
        // Setup. Database configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableToKeepName: string = 'TableToKeep';
        const lTableToRemoveName: string = 'TableToRemove';
        const lKeepIndexPropertyName: string = 'indexOne';
        const lTableIdentityPropertyName: string = 'id';

        // Setup. Create initial database with two tables using native IndexedDB API.
        const lInitialDb: IDBDatabase = await new Promise<IDBDatabase>((pResolve, pReject) => {
            const lRequest = indexedDB.open(lDatabaseName, 1);
            lRequest.onerror = () => pReject(lRequest.error);
            lRequest.onsuccess = () => pResolve(lRequest.result);
            lRequest.onupgradeneeded = () => {
                // Create table to keep.
                const lKeepStore = lRequest.result.createObjectStore(lTableToKeepName, { keyPath: lTableIdentityPropertyName, autoIncrement: true });
                lKeepStore.createIndex(lKeepIndexPropertyName, lKeepIndexPropertyName, { unique: false });

                // Create table to remove.
                const lRemoveStore = lRequest.result.createObjectStore(lTableToRemoveName);
                lRemoveStore.createIndex('removeIndex', 'value', { unique: true });
            };
        });
        lInitialDb.close();

        // Setup. Table definition for WebDatabase (only the table to keep).
        @WebDatabase.table(lTableToKeepName)
        class TableToKeep {
            @WebDatabase.field({ as: { index: {} } })
            public [lKeepIndexPropertyName]!: string;

            @WebDatabase.field({ as: { identity: 'auto' } })
            public [lTableIdentityPropertyName]!: number;
        }

        // Process. Update database with WebDatabase (without the table to remove).
        const lWebDatabase = new WebDatabase(lDatabaseName, [TableToKeep]);
        const lUpdatedDb: IDBDatabase = await lWebDatabase.open();

        // Evaluation. Verify only the kept table exists.
        expect(lUpdatedDb.objectStoreNames).toHaveLength(1);
        expect(lUpdatedDb.objectStoreNames).toContain(lTableToKeepName);
        expect(lUpdatedDb.objectStoreNames).not.toContain(lTableToRemoveName);

        // Evaluation. Verify kept table is unchanged.
        await lWebDatabase.transaction([TableToKeep], 'readonly', async (pTransaction) => {
            const lKeptTableStore: IDBObjectStore = pTransaction.transaction.objectStore(lTableToKeepName);
            expect(lKeptTableStore.name).toEqual(lTableToKeepName);
            expect(lKeptTableStore.keyPath).toEqual(lTableIdentityPropertyName);
            expect(lKeptTableStore.autoIncrement).toBeTruthy();
            expect(lKeptTableStore.indexNames).toHaveLength(1);
            expect(lKeptTableStore.indexNames).toContain(lKeepIndexPropertyName);

            const lKeepIndex: IDBIndex = lKeptTableStore.index(lKeepIndexPropertyName);
            expect(lKeepIndex.unique).toBeFalsy();
            expect(lKeepIndex.keyPath).toEqual(lKeepIndexPropertyName);
        });

        // Cleanup. Close the database.
        lWebDatabase.close();
    });

    await pContext.step('Update database - Add table identity', async () => {
        // Setup. Database configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableName: string = 'TestTable';
        const lTableIndexPropertyName: string = 'indexOne';
        const lTableIdentityPropertyName: string = 'id';

        // Setup. Create initial database without identity using native IndexedDB API.
        const lInitialDb: IDBDatabase = await new Promise<IDBDatabase>((pResolve, pReject) => {
            const lRequest = indexedDB.open(lDatabaseName, 1);
            lRequest.onerror = () => pReject(lRequest.error);
            lRequest.onsuccess = () => pResolve(lRequest.result);
            lRequest.onupgradeneeded = () => {
                const lStore = lRequest.result.createObjectStore(lTableName);
                lStore.createIndex(lTableIndexPropertyName, lTableIndexPropertyName, { unique: false });
            };
        });
        lInitialDb.close();

        // Setup. Table definition with identity for WebDatabase.
        @WebDatabase.table(lTableName)
        class TestTable {
            @WebDatabase.field({ as: { identity: 'auto' } })
            public [lTableIdentityPropertyName]!: number;

            @WebDatabase.field({ as: { index: {} } })
            public [lTableIndexPropertyName]!: string;
        }

        // Process. Update database with WebDatabase.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);
        await lWebDatabase.open();

        // Evaluation. Verify table has identity.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTableStore: IDBObjectStore = pTransaction.transaction.objectStore(lTableName);
            expect(lTableStore.keyPath).toEqual(lTableIdentityPropertyName);
            expect(lTableStore.autoIncrement).toBeTruthy();
            expect(lTableStore.indexNames).toHaveLength(1);
            expect(lTableStore.indexNames).toContain(lTableIndexPropertyName);
        });

        // Cleanup. Close the database.
        lWebDatabase.close();
    });

    await pContext.step('Update database - Remove table identity', async () => {
        // Setup. Database configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableName: string = 'TestTable';
        const lTableIndexPropertyName: string = 'indexOne';
        const lTableIdentityPropertyName: string = 'id';

        // Setup. Create initial database with identity using native IndexedDB API.
        const lInitialDb: IDBDatabase = await new Promise<IDBDatabase>((pResolve, pReject) => {
            const lRequest = indexedDB.open(lDatabaseName, 1);
            lRequest.onerror = () => pReject(lRequest.error);
            lRequest.onsuccess = () => pResolve(lRequest.result);
            lRequest.onupgradeneeded = () => {
                const lStore = lRequest.result.createObjectStore(lTableName, { keyPath: lTableIdentityPropertyName, autoIncrement: true });
                lStore.createIndex(lTableIndexPropertyName, lTableIndexPropertyName, { unique: false });
            };
        });
        lInitialDb.close();

        // Setup. Table definition without identity for WebDatabase.
        @WebDatabase.table(lTableName)
        class TestTable {
            @WebDatabase.field({ as: { index: {} } })
            public [lTableIndexPropertyName]!: string;
        }

        // Process. Update database with WebDatabase.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);
        await lWebDatabase.open();

        // Evaluation. Verify table has no identity.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTableStore: IDBObjectStore = pTransaction.transaction.objectStore(lTableName);
            gEmptyIdentityValidate(lTableStore)
            expect(lTableStore.indexNames).toHaveLength(1);
            expect(lTableStore.indexNames).toContain(lTableIndexPropertyName);
        });

        // Cleanup. Close the database.
        lWebDatabase.close();
    });

    await pContext.step('Update database - Update table identity, add auto increment', async () => {
        // Setup. Database configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableName: string = 'TestTable';
        const lTableIndexPropertyName: string = 'indexOne';
        const lTableIdentityPropertyName: string = 'id';

        // Setup. Create initial database with non-auto-increment identity using native IndexedDB API.
        const lInitialDb: IDBDatabase = await new Promise<IDBDatabase>((pResolve, pReject) => {
            const lRequest = indexedDB.open(lDatabaseName, 1);
            lRequest.onerror = () => pReject(lRequest.error);
            lRequest.onsuccess = () => pResolve(lRequest.result);
            lRequest.onupgradeneeded = () => {
                const lStore = lRequest.result.createObjectStore(lTableName, { keyPath: lTableIdentityPropertyName, autoIncrement: false });
                lStore.createIndex(lTableIndexPropertyName, lTableIndexPropertyName, { unique: false });
            };
        });
        lInitialDb.close();

        // Setup. Table definition with auto-increment identity for WebDatabase.
        @WebDatabase.table(lTableName)
        class TestTable {
            @WebDatabase.field({ as: { identity: 'auto' } })
            public [lTableIdentityPropertyName]!: number;

            @WebDatabase.field({ as: { index: {} } })
            public [lTableIndexPropertyName]!: string;
        }

        // Process. Update database with WebDatabase.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);
        await lWebDatabase.open();

        // Evaluation. Verify table has auto-increment identity.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTableStore: IDBObjectStore = pTransaction.transaction.objectStore(lTableName);
            expect(lTableStore.keyPath).toEqual(lTableIdentityPropertyName);
            expect(lTableStore.autoIncrement).toBeTruthy();
            expect(lTableStore.indexNames).toHaveLength(1);
            expect(lTableStore.indexNames).toContain(lTableIndexPropertyName);
        });

        // Cleanup. Close the database.
        lWebDatabase.close();
    });

    await pContext.step('Update database - Update table identity, remove auto increment', async () => {
        // Setup. Database configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableName: string = 'TestTable';
        const lTableIdentityPropertyName: string = 'id';

        // Setup. Create initial database with auto-increment identity using native IndexedDB API.
        const lInitialDb: IDBDatabase = await new Promise<IDBDatabase>((pResolve, pReject) => {
            const lRequest = indexedDB.open(lDatabaseName, 1);
            lRequest.onerror = () => pReject(lRequest.error);
            lRequest.onsuccess = () => pResolve(lRequest.result);
            lRequest.onupgradeneeded = () => {
                lRequest.result.createObjectStore(lTableName, { keyPath: lTableIdentityPropertyName, autoIncrement: true });
            };
        });
        lInitialDb.close();

        // Setup. Table definition with non-auto-increment identity for WebDatabase.
        @WebDatabase.table(lTableName)
        class TestTable {
            @WebDatabase.field({ as: { identity: 'manual' } })
            public [lTableIdentityPropertyName]!: string;
        }

        // Process. Update database with WebDatabase.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);
        await lWebDatabase.open();

        // Evaluation. Verify table has non-auto-increment identity.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTableStore: IDBObjectStore = pTransaction.transaction.objectStore(lTableName);
            expect(lTableStore.keyPath).toEqual(lTableIdentityPropertyName);
            expect(lTableStore.autoIncrement).toBeFalsy();
            expect(lTableStore.indexNames).toHaveLength(0);
        });

        // Cleanup. Close the database.
        lWebDatabase.close();
    });

    await pContext.step('Update database - Add table index', async () => {
        // Setup. Database configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableName: string = 'TestTable';
        const lNewIndexPropertyName: string = 'indexOne';
        const lExistingIndexName: string = 'indexTwo';
        const lTableIdentityPropertyName: string = 'id';

        // Setup. Create initial database without the new index using native IndexedDB API.
        const lInitialDb: IDBDatabase = await new Promise<IDBDatabase>((pResolve, pReject) => {
            const lRequest = indexedDB.open(lDatabaseName, 1);
            lRequest.onerror = () => pReject(lRequest.error);
            lRequest.onsuccess = () => pResolve(lRequest.result);
            lRequest.onupgradeneeded = () => {
                const lStore = lRequest.result.createObjectStore(lTableName, { keyPath: lTableIdentityPropertyName, autoIncrement: true });
                lStore.createIndex(lExistingIndexName, lExistingIndexName, { unique: false });
            };
        });
        lInitialDb.close();

        // Setup. Table definition with new index for WebDatabase.
        @WebDatabase.table(lTableName)
        class TestTable {
            @WebDatabase.field({ as: { index: {} } })
            public [lExistingIndexName]!: string;

            @WebDatabase.field({ as: { index: {} } })
            public [lNewIndexPropertyName]!: string;

            @WebDatabase.field({ as: { identity: 'auto' } })
            public [lTableIdentityPropertyName]!: number;
        }

        // Process. Update database with WebDatabase.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);
        await lWebDatabase.open();

        // Evaluation. Verify both indices exist.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTableStore: IDBObjectStore = pTransaction.transaction.objectStore(lTableName);
            expect(lTableStore.indexNames).toHaveLength(2);
            expect(lTableStore.indexNames).toContain(lExistingIndexName);
            expect(lTableStore.indexNames).toContain(lNewIndexPropertyName);

            const lNewIndex: IDBIndex = lTableStore.index(lNewIndexPropertyName);
            expect(lNewIndex.keyPath).toEqual(lNewIndexPropertyName);
            expect(lNewIndex.unique).toBeFalsy();
            expect(lNewIndex.multiEntry).toBeFalsy();
        });

        // Cleanup. Close the database.
        lWebDatabase.close();
    });

    await pContext.step('Update database - Remove table index', async () => {
        // Setup. Database configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableName: string = 'TestTable';
        const lIndexToRemove: string = 'indexToRemove';
        const lIndexToKeep: string = 'indexToKeep';
        const lTableIdentityPropertyName: string = 'id';

        // Setup. Create initial database with index to remove using native IndexedDB API.
        const lInitialDb: IDBDatabase = await new Promise<IDBDatabase>((pResolve, pReject) => {
            const lRequest = indexedDB.open(lDatabaseName, 1);
            lRequest.onerror = () => pReject(lRequest.error);
            lRequest.onsuccess = () => pResolve(lRequest.result);
            lRequest.onupgradeneeded = () => {
                const lStore = lRequest.result.createObjectStore(lTableName, { keyPath: lTableIdentityPropertyName, autoIncrement: true });
                lStore.createIndex(lIndexToKeep, lIndexToKeep, { unique: false });
                lStore.createIndex(lIndexToRemove, 'category', { unique: true });
            };
        });
        lInitialDb.close();

        // Setup. Table definition without the index to remove for WebDatabase.
        @WebDatabase.table(lTableName)
        class TestTable {
            @WebDatabase.field({ as: { index: {} } })
            public [lIndexToKeep]!: string;

            @WebDatabase.field({ as: { identity: 'auto' } })
            public [lTableIdentityPropertyName]!: number;
        }

        // Process. Update database with WebDatabase.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);
        await lWebDatabase.open();

        // Evaluation. Verify only the kept index exists.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTableStore: IDBObjectStore = pTransaction.transaction.objectStore(lTableName);
            expect(lTableStore.indexNames).toHaveLength(1);
            expect(lTableStore.indexNames).toContain(lIndexToKeep);
            expect(lTableStore.indexNames).not.toContain(lIndexToRemove);
        });

        // Cleanup. Close the database.
        lWebDatabase.close();
    });

    await pContext.step('Update database - Update table index, add unique', async () => {
        // Setup. Database configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableName: string = 'TestTable';
        const lIndexPropertyName: string = 'indexOne';
        const lTableIdentityPropertyName: string = 'id';

        // Setup. Create initial database with non-unique index using native IndexedDB API.
        const lInitialDb: IDBDatabase = await new Promise<IDBDatabase>((pResolve, pReject) => {
            const lRequest = indexedDB.open(lDatabaseName, 1);
            lRequest.onerror = () => pReject(lRequest.error);
            lRequest.onsuccess = () => pResolve(lRequest.result);
            lRequest.onupgradeneeded = () => {
                const lStore = lRequest.result.createObjectStore(lTableName, { keyPath: lTableIdentityPropertyName, autoIncrement: true });
                lStore.createIndex(lIndexPropertyName, lIndexPropertyName, { unique: false });
            };
        });
        lInitialDb.close();

        // Setup. Table definition with unique index for WebDatabase.
        @WebDatabase.table(lTableName)
        class TestTable {
            @WebDatabase.field({ as: { index: { unique: true } } })
            public [lIndexPropertyName]!: string;

            @WebDatabase.field({ as: { identity: 'auto' } })
            public [lTableIdentityPropertyName]!: number;
        }

        // Process. Update database with WebDatabase.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);
        await lWebDatabase.open();

        // Evaluation. Verify index is now unique.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTableStore: IDBObjectStore = pTransaction.transaction.objectStore(lTableName);
            const lIndex: IDBIndex = lTableStore.index(lIndexPropertyName);
            expect(lIndex.unique).toBeTruthy();
            expect(lIndex.keyPath).toEqual(lIndexPropertyName);
            expect(lIndex.multiEntry).toBeFalsy();
        });

        // Cleanup. Close the database.
        lWebDatabase.close();
    });

    await pContext.step('Update database - Update table index, remove unique', async () => {
        // Setup. Database configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableName: string = 'TestTable';
        const lIndexPropertyName: string = 'indexOne';
        const lTableIdentityPropertyName: string = 'id';

        // Setup. Create initial database with unique index using native IndexedDB API.
        const lInitialDb: IDBDatabase = await new Promise<IDBDatabase>((pResolve, pReject) => {
            const lRequest = indexedDB.open(lDatabaseName, 1);
            lRequest.onerror = () => pReject(lRequest.error);
            lRequest.onsuccess = () => pResolve(lRequest.result);
            lRequest.onupgradeneeded = () => {
                const lStore = lRequest.result.createObjectStore(lTableName, { keyPath: lTableIdentityPropertyName, autoIncrement: true });
                lStore.createIndex(lIndexPropertyName, lIndexPropertyName, { unique: true });
            };
        });
        lInitialDb.close();

        // Setup. Table definition with non-unique index for WebDatabase.
        @WebDatabase.table(lTableName)
        class TestTable {
            @WebDatabase.field({ as: { index: { unique: false } } })
            public [lIndexPropertyName]!: string;

            @WebDatabase.field({ as: { identity: 'auto' } })
            public [lTableIdentityPropertyName]!: number;
        }

        // Process. Update database with WebDatabase.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);
        await lWebDatabase.open();

        // Evaluation. Verify index is no longer unique.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTableStore: IDBObjectStore = pTransaction.transaction.objectStore(lTableName);
            const lIndex: IDBIndex = lTableStore.index(lIndexPropertyName);
            expect(lIndex.unique).toBeFalsy();
            expect(lIndex.keyPath).toEqual(lIndexPropertyName);
            expect(lIndex.multiEntry).toBeFalsy();
        });

        // Cleanup. Close the database.
        lWebDatabase.close();
    });

    await pContext.step('Update database - Update table index, add multi entry', async () => {
        // Setup. Database configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableName: string = 'TestTable';
        const lIndexPropertyName: string = 'indexOne';
        const lTableIdentityPropertyName: string = 'id';

        // Setup. Create initial database with non-multi-entry index using native IndexedDB API.
        const lInitialDb: IDBDatabase = await new Promise<IDBDatabase>((pResolve, pReject) => {
            const lRequest = indexedDB.open(lDatabaseName, 1);
            lRequest.onerror = () => pReject(lRequest.error);
            lRequest.onsuccess = () => pResolve(lRequest.result);
            lRequest.onupgradeneeded = () => {
                const lStore = lRequest.result.createObjectStore(lTableName, { keyPath: lTableIdentityPropertyName, autoIncrement: true });
                lStore.createIndex(lIndexPropertyName, lIndexPropertyName, { unique: false, multiEntry: false });
            };
        });
        lInitialDb.close();

        // Setup. Table definition with multi-entry index for WebDatabase.
        @WebDatabase.table(lTableName)
        class TestTable {
            @WebDatabase.field({ as: { index: { multiEntry: true } } })
            public [lIndexPropertyName]!: Array<string>;

            @WebDatabase.field({ as: { identity: 'auto' } })
            public [lTableIdentityPropertyName]!: number;
        }

        // Process. Update database with WebDatabase.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);
        await lWebDatabase.open();

        // Evaluation. Verify index is now multi-entry.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTableStore: IDBObjectStore = pTransaction.transaction.objectStore(lTableName);
            const lIndex: IDBIndex = lTableStore.index(lIndexPropertyName);
            expect(lIndex.unique).toBeFalsy();
            expect(lIndex.keyPath).toEqual(lIndexPropertyName);
            expect(lIndex.multiEntry).toBeTruthy();
        });

        // Cleanup. Close the database.
        lWebDatabase.close();
    });

    await pContext.step('Update database - Update table index, remove multi entry', async () => {
        // Setup. Database configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableName: string = 'TestTable';
        const lIndexPropertyName: string = 'indexOne';
        const lTableIdentityPropertyName: string = 'id';

        // Setup. Create initial database with multi-entry index using native IndexedDB API.
        const lInitialDb: IDBDatabase = await new Promise<IDBDatabase>((pResolve, pReject) => {
            const lRequest = indexedDB.open(lDatabaseName, 1);
            lRequest.onerror = () => pReject(lRequest.error);
            lRequest.onsuccess = () => pResolve(lRequest.result);
            lRequest.onupgradeneeded = () => {
                const lStore = lRequest.result.createObjectStore(lTableName, { keyPath: lTableIdentityPropertyName, autoIncrement: true });
                lStore.createIndex(lIndexPropertyName, lIndexPropertyName, { unique: false, multiEntry: true });
            };
        });
        lInitialDb.close();

        // Setup. Table definition with non-multi-entry index for WebDatabase.
        @WebDatabase.table(lTableName)
        class TestTable {
            @WebDatabase.field({ as: { index: { multiEntry: false } } })
            public [lIndexPropertyName]!: string;

            @WebDatabase.field({ as: { identity: 'auto' } })
            public [lTableIdentityPropertyName]!: number;
        }

        // Process. Update database with WebDatabase.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);
        await lWebDatabase.open();

        // Evaluation. Verify index is no longer multi-entry.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTableStore: IDBObjectStore = pTransaction.transaction.objectStore(lTableName);
            const lIndex: IDBIndex = lTableStore.index(lIndexPropertyName);
            expect(lIndex.unique).toBeFalsy();
            expect(lIndex.keyPath).toEqual(lIndexPropertyName);
            expect(lIndex.multiEntry).toBeFalsy();
        });

        // Cleanup. Close the database.
        lWebDatabase.close();
    });

    await pContext.step('Update database - Update table index, change default index to compound index', async () => {
        // Setup. Database configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableName: string = 'TestTable';
        const lTableIndexProperty1Name: string = 'indexOne';
        const lTableIndexProperty2Name: string = 'indexTwo';
        const lTableIdentityPropertyName: string = 'id';

        // Setup. Create initial database with single-property index using native IndexedDB API.
        const lInitialDb: IDBDatabase = await new Promise<IDBDatabase>((pResolve, pReject) => {
            const lRequest = indexedDB.open(lDatabaseName, 1);
            lRequest.onerror = () => pReject(lRequest.error);
            lRequest.onsuccess = () => pResolve(lRequest.result);
            lRequest.onupgradeneeded = () => {
                const lStore = lRequest.result.createObjectStore(lTableName, { keyPath: lTableIdentityPropertyName, autoIncrement: true });
                lStore.createIndex(`${lTableIndexProperty1Name}+${lTableIndexProperty2Name}`, lTableIndexProperty1Name, { unique: false });
            };
        });
        lInitialDb.close();

        // Setup. Table definition with compound index for WebDatabase.
        @WebDatabase.table(lTableName, {
            with: [{
                properties: [lTableIndexProperty1Name, lTableIndexProperty2Name],
                unique: false
            }]
        })
        class TestTable {
            @WebDatabase.field({ as: { identity: 'auto' } })
            public [lTableIdentityPropertyName]!: number;

            @WebDatabase.field()
            public [lTableIndexProperty1Name]!: string;

            @WebDatabase.field()
            public [lTableIndexProperty2Name]!: string;
        }

        // Process. Update database with WebDatabase.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);
        await lWebDatabase.open();

        // Evaluation. Verify index is now compound.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTableStore: IDBObjectStore = pTransaction.transaction.objectStore(lTableName);
            const lIndex: IDBIndex = lTableStore.index(`${lTableIndexProperty1Name}+${lTableIndexProperty2Name}`);
            expect(lIndex.unique).toBeFalsy();
            expect(lIndex.keyPath).toEqual([lTableIndexProperty1Name, lTableIndexProperty2Name]);
            expect(lIndex.multiEntry).toBeFalsy();
        });

        // Cleanup. Close the database.
        lWebDatabase.close();
    });

    await pContext.step('Update database - Update table index, change compound index to default index', async () => {
        // Setup. Database configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableName: string = 'TestTable';
        const lIndexPropertyName: string = 'indexOne';
        const lTableIdentityPropertyName: string = 'id';

        // Setup. Create initial database with compound index using native IndexedDB API.
        const lInitialDb: IDBDatabase = await new Promise<IDBDatabase>((pResolve, pReject) => {
            const lRequest = indexedDB.open(lDatabaseName, 1);
            lRequest.onerror = () => pReject(lRequest.error);
            lRequest.onsuccess = () => pResolve(lRequest.result);
            lRequest.onupgradeneeded = () => {
                const lStore = lRequest.result.createObjectStore(lTableName, { keyPath: lTableIdentityPropertyName, autoIncrement: true });
                lStore.createIndex(lIndexPropertyName, ['one', 'two'], { unique: false });
            };
        });
        lInitialDb.close();

        // Setup. Table definition with single-property index for WebDatabase.
        @WebDatabase.table(lTableName)
        class TestTable {
            @WebDatabase.field({ as: { index: {} } })
            public [lIndexPropertyName]!: string;

            @WebDatabase.field({ as: { identity: 'auto' } })
            public [lTableIdentityPropertyName]!: number;
        }

        // Process. Update database with WebDatabase.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);
        await lWebDatabase.open();

        // Evaluation. Verify index is now single-property.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTableStore: IDBObjectStore = pTransaction.transaction.objectStore(lTableName);
            const lIndex: IDBIndex = lTableStore.index(lIndexPropertyName);
            expect(lIndex.unique).toBeFalsy();
            expect(lIndex.keyPath).toEqual(lIndexPropertyName);
            expect(lIndex.multiEntry).toBeFalsy();
        });

        // Cleanup. Close the database.
        lWebDatabase.close();
    });

    await pContext.step('Update database - Update table index, add property to compound index', async () => {
        // Setup. Database configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableName: string = 'TestTable';
        const lTableIndexProperty1Name: string = 'indexOne';
        const lTableIndexProperty2Name: string = 'indexTwo';
        const lTableIndexProperty3Name: string = 'indexThree';
        const lTableIdentityPropertyName: string = 'id';

        // Setup. Create initial database with two-property compound index using native IndexedDB API.
        const lInitialDb: IDBDatabase = await new Promise<IDBDatabase>((pResolve, pReject) => {
            const lRequest = indexedDB.open(lDatabaseName, 1);
            lRequest.onerror = () => pReject(lRequest.error);
            lRequest.onsuccess = () => pResolve(lRequest.result);
            lRequest.onupgradeneeded = () => {
                const lStore = lRequest.result.createObjectStore(lTableName, { keyPath: lTableIdentityPropertyName, autoIncrement: true });
                lStore.createIndex(`${lTableIndexProperty1Name}+${lTableIndexProperty2Name}+${lTableIndexProperty3Name}`, [lTableIndexProperty1Name, lTableIndexProperty2Name], { unique: false });
            };
        });
        lInitialDb.close();

        // Setup. Table definition with three-property compound index for WebDatabase.
        @WebDatabase.table(lTableName, {
            with: [{
                properties: [lTableIndexProperty1Name, lTableIndexProperty2Name, lTableIndexProperty3Name],
                unique: false
            }]
        })
        class TestTable {
            @WebDatabase.field({ as: { identity: 'auto' } })
            public [lTableIdentityPropertyName]!: number;

            @WebDatabase.field()
            public [lTableIndexProperty1Name]!: string;

            @WebDatabase.field()
            public [lTableIndexProperty2Name]!: string;

            @WebDatabase.field()
            public [lTableIndexProperty3Name]!: string;
        }

        // Process. Update database with WebDatabase.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);
        await lWebDatabase.open();

        // Evaluation. Verify index now includes three properties.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTableStore: IDBObjectStore = pTransaction.transaction.objectStore(lTableName);
            const lIndex: IDBIndex = lTableStore.index(`${lTableIndexProperty1Name}+${lTableIndexProperty2Name}+${lTableIndexProperty3Name}`);
            expect(lIndex.unique).toBeFalsy();
            expect(lIndex.keyPath).toEqual([lTableIndexProperty1Name, lTableIndexProperty2Name, lTableIndexProperty3Name]);
            expect(lIndex.multiEntry).toBeFalsy();
        });

        // Cleanup. Close the database.
        lWebDatabase.close();
    });

    await pContext.step('Update database - Update table index, remove property from compound index', async () => {
        // Setup. Database configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableName: string = 'TestTable';
        const lTableIndexProperty1Name: string = 'indexOne';
        const lTableIndexProperty2Name: string = 'indexTwo';
        const lTableIndexProperty3Name: string = 'indexThree';
        const lTableIdentityPropertyName: string = 'id';

        // Setup. Create initial database with three-property compound index using native IndexedDB API.
        const lInitialDb: IDBDatabase = await new Promise<IDBDatabase>((pResolve, pReject) => {
            const lRequest = indexedDB.open(lDatabaseName, 1);
            lRequest.onerror = () => pReject(lRequest.error);
            lRequest.onsuccess = () => pResolve(lRequest.result);
            lRequest.onupgradeneeded = () => {
                const lStore = lRequest.result.createObjectStore(lTableName, { keyPath: lTableIdentityPropertyName, autoIncrement: true });
                lStore.createIndex(`${lTableIndexProperty1Name}+${lTableIndexProperty2Name}`, [lTableIndexProperty1Name, lTableIndexProperty2Name, lTableIndexProperty3Name], { unique: false });
            };
        });
        lInitialDb.close();

        // Setup. Table definition with two-property compound index for WebDatabase.
        @WebDatabase.table(lTableName, {
            with: [{
                properties: [lTableIndexProperty1Name, lTableIndexProperty2Name],
                unique: false
            }]
        })
        class TestTable {
            @WebDatabase.field({ as: { identity: 'auto' } })
            public [lTableIdentityPropertyName]!: number;

            @WebDatabase.field()
            public [lTableIndexProperty1Name]!: string;

            @WebDatabase.field()
            public [lTableIndexProperty2Name]!: string;
        }

        // Process. Update database with WebDatabase.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);
        await lWebDatabase.open();

        // Evaluation. Verify index now includes only two properties.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTableStore: IDBObjectStore = pTransaction.transaction.objectStore(lTableName);
            const lIndex: IDBIndex = lTableStore.index(`${lTableIndexProperty1Name}+${lTableIndexProperty2Name}`);
            expect(lIndex.unique).toBeFalsy();
            expect(lIndex.keyPath).toEqual([lTableIndexProperty1Name, lTableIndexProperty2Name]);
            expect(lIndex.multiEntry).toBeFalsy();
        });

        // Cleanup. Close the database.
        lWebDatabase.close();
    });
});


Deno.test('WebDatabase.table()', async (pContext) => {
    await pContext.step('Valid table name', () => {
        // Process
        const lDecoratorFunction = () => {
            @WebDatabase.table('ValidTable')
            class TestTable { } // eslint-disable-line @typescript-eslint/no-unused-vars
        };

        // Evaluation - should not throw an error
        expect(lDecoratorFunction).not.toThrow();
    });

    await pContext.step('Empty table name', () => {
        // Process
        const lDecoratorFunction = () => {
            @WebDatabase.table('')
            class TestTable { } // eslint-disable-line @typescript-eslint/no-unused-vars
        };

        // Evaluation - should not throw an error (empty string is a valid string)
        expect(lDecoratorFunction).not.toThrow();
    });

    await pContext.step('Special characters in table name', () => {
        // Process
        const lDecoratorFunction = () => {
            @WebDatabase.table('Test-Table_123$')
            class TestTable { } // eslint-disable-line @typescript-eslint/no-unused-vars
        };

        // Evaluation - should not throw an error
        expect(lDecoratorFunction).not.toThrow();
    });
});

Deno.test('WebDatabase.field()', async (pContext) => {
    await pContext.step('Valid identity with autoIncrement true', () => {
        // Process
        const lDecoratorFunction = () => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            class TestTable {
                @WebDatabase.field({ as: { identity: 'auto' } })
                public id!: number;
            }
        };

        // Evaluation - should not throw an error
        expect(lDecoratorFunction).not.toThrow();
    });

    await pContext.step('Valid identity with autoIncrement false', () => {
        // Process
        const lDecoratorFunction = () => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            class TestTable {
                @WebDatabase.field({ as: { identity: 'manual' } })
                public id!: string;
            }
        };

        // Evaluation - should not throw an error
        expect(lDecoratorFunction).not.toThrow();
    });

    await pContext.step('Error: field on static property', () => {
        // Process
        const lDecoratorFunction = () => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            class TestTable {
                @WebDatabase.field()
                static id: number;
            }
        };

        // Evaluation - should throw an error about static properties
        expect(lDecoratorFunction).toThrow('Field property can not be a static property.');
    });

    await pContext.step('Error: field with symbol property name', () => {
        // Process
        const lDecoratorFunction = () => {
            const lSymbolProp = Symbol('id');

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            class TestTable {
                @WebDatabase.field()
                [lSymbolProp]!: number;
            }
        };

        // Evaluation - should throw an error about non-string property name
        expect(lDecoratorFunction).toThrow('Field name must be a string.');
    });

    await pContext.step('Error: field with number property name', () => {
        // Process
        const lDecoratorFunction = () => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            class TestTable {
                @WebDatabase.field()
                [123]!: number;
            }
        };

        // Evaluation - should throw an error about non-string property name
        expect(lDecoratorFunction).toThrow('Field name must be a string.');
    });

    await pContext.step('Error: multiple identity decorators on same class', () => {
        // Process
        const lDecoratorFunction = () => {
            @WebDatabase.table('MultipleIdentityTable')
            class TestTable {
                @WebDatabase.field({ as: { identity: 'auto' } })
                public id1!: number;

                @WebDatabase.field({ as: { identity: 'manual' } })
                public id2!: string;
            }

            // Create database instance to trigger validation
            new WebDatabase('test-db', [TestTable]);
        };

        // Evaluation - should throw an error about multiple identities
        expect(lDecoratorFunction).toThrow('A table type can only have one identifier.');
    });

    await pContext.step('Valid field with default parameters', () => {
        // Process
        const lDecoratorFunction = () => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            class TestTable {
                @WebDatabase.field()
                public name!: string;
            }
        };

        // Evaluation - should not throw an error
        expect(lDecoratorFunction).not.toThrow();
    });

    await pContext.step('Valid field with index name', () => {
        // Process
        const lDecoratorFunction = () => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            class TestTable {
                @WebDatabase.field({ as: { index: {} } })
                public name!: string;
            }
        };

        // Evaluation - should not throw an error
        expect(lDecoratorFunction).not.toThrow();
    });

    await pContext.step('Valid field with unique index', () => {
        // Process
        const lDecoratorFunction = () => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            class TestTable {
                @WebDatabase.field({ as: { index: { unique: true } } })
                public name!: string;
            }
        };

        // Evaluation - should not throw an error
        expect(lDecoratorFunction).not.toThrow();
    });

    await pContext.step('Valid field with multiEntry index', () => {
        // Process
        const lDecoratorFunction = () => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            class TestTable {
                @WebDatabase.field({ as: { index: { multiEntry: true } } })
                public tags!: Array<string>;
            }
        };

        // Evaluation - should not throw an error
        expect(lDecoratorFunction).not.toThrow();
    });

    await pContext.step('Valid field with unique and multiEntry index', () => {
        // Process
        const lDecoratorFunction = () => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            class TestTable {
                @WebDatabase.field({ as: { index: { multiEntry: true, unique: true } } })
                public uniqueTags!: Array<string>;
            }
        };

        // Evaluation - should not throw an error
        expect(lDecoratorFunction).not.toThrow();
    });
});