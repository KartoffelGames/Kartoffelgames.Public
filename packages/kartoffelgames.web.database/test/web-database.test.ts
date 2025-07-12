import { expect } from '@kartoffelgames/core-test';
import 'npm:fake-indexeddb/auto';
import { WebDatabase } from '../source/index.ts';

// Sanitize disabled because timers are started outside of the test in fake-indexeddb.
Deno.test('WebDatabase.open()', { sanitizeResources: false, sanitizeOps: false }, async (pContext) => {
    await pContext.step('Create Table - Identity-Autoincrement', async () => {
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

        // Cleanup. Close the database.
        await lWebDatabase.close();
    });

    await pContext.step('Create Table - Index-Unique', async () => {
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

        // Cleanup. Close the database.
        await lWebDatabase.close();
    });

    await pContext.step('Create Table - Identity', async () => {
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

        // Cleanup. Close the database.
        await lWebDatabase.close();
    });

    await pContext.step('Create Table - Index-Multi-Unique', async () => {
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

        // Cleanup. Close the database.
        await lWebDatabase.close();
    });

    await pContext.step('Create Table - Index', async () => {
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

        // Cleanup. Close the database.
        await lWebDatabase.close();
    });

    await pContext.step('Create Table - Index-Compound', async () => {
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

        // Cleanup. Close the database.
        await lWebDatabase.close();
    });

    await pContext.step('Create Table - Index-Compound-Unique', async () => {
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

        // Cleanup. Close the database.
        await lWebDatabase.close();
    });

    await pContext.step('Create Table - Index-Multi-Unique', async () => {
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

        // Cleanup. Close the database.
        await lWebDatabase.close();
    });

    await pContext.step('Create Table - Index-Multi-Compound', async () => {
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
        };

        //Evaluation.
        expect(lFailFunction).toThrow('Multi entity index can only have one property.');
    });

    await pContext.step('Create Table - Index-Multi-Compound-Unique', async () => {
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
        };

        //Evaluation.
        expect(lFailFunction).toThrow('Multi entity index can only have one property.');
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

            // Validate object store.
            const lTestTableObjectStore: IDBObjectStore = lWebDbTransaction.objectStore(lTableName);
            expect(lTestTableObjectStore.name).toEqual(lTableName);
        });

        // Cleanup. Close the database.
        await lWebDatabase.close();
    });

    await pContext.step('Update database - Add Table', async () => {
        // Setup. Database configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lInitialTableName: string = 'InitialTable';
        const lNewTableName: string = 'NewTable';

        // Setup. Create initial database with native IndexedDB API.
        const lInitialDb: IDBDatabase = await new Promise<IDBDatabase>((resolve, reject) => {
            const request = indexedDB.open(lDatabaseName, 1);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                db.createObjectStore(lInitialTableName);
            };
        });
        lInitialDb.close();

        // Setup. Table definitions for WebDatabase.
        @WebDatabase.table(lInitialTableName)
        class InitialTable {
            @WebDatabase.field('nameIndex')
            public name!: string;
        }

        @WebDatabase.table(lNewTableName)
        class NewTable {
            @WebDatabase.identity(true)
            public id!: number;

            @WebDatabase.field('valueIndex')
            public value!: string;
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
            expect(lInitialTableStore.name).toEqual(lInitialTableName);
            expect(lInitialTableStore.keyPath).toBeNull();
            expect(lInitialTableStore.indexNames).toHaveLength(1);
            expect(lInitialTableStore.indexNames).toContain('nameIndex');
        });

        // Evaluation. Verify new table is created correctly.
        await lWebDatabase.transaction([NewTable], 'readonly', async (pTransaction) => {
            const lNewTableStore: IDBObjectStore = pTransaction.transaction.objectStore(lNewTableName);
            expect(lNewTableStore.name).toEqual(lNewTableName);
            expect(lNewTableStore.keyPath).toEqual('id');
            expect(lNewTableStore.autoIncrement).toBeTruthy();
            expect(lNewTableStore.indexNames).toHaveLength(1);
            expect(lNewTableStore.indexNames).toContain('valueIndex');
        });

        // Cleanup. Close the database.
        await lWebDatabase.close();
    });

    await pContext.step('Update database - Remove Table', async () => {
        // Setup. Database configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableToKeepName: string = 'TableToKeep';
        const lTableToRemoveName: string = 'TableToRemove';

        // Setup. Create initial database with two tables using native IndexedDB API.
        const lInitialDb: IDBDatabase = await new Promise<IDBDatabase>((resolve, reject) => {
            const request = indexedDB.open(lDatabaseName, 1);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                
                // Create table to keep.
                const keepStore = db.createObjectStore(lTableToKeepName, { keyPath: 'id', autoIncrement: true });
                keepStore.createIndex('keepIndex', 'name', { unique: false });
                
                // Create table to remove.
                const removeStore = db.createObjectStore(lTableToRemoveName);
                removeStore.createIndex('removeIndex', 'value', { unique: true });
            };
        });
        lInitialDb.close();

        // Setup. Table definition for WebDatabase (only the table to keep).
        @WebDatabase.table(lTableToKeepName)
        class TableToKeep {
            @WebDatabase.identity(true)
            public id!: number;

            @WebDatabase.field('keepIndex')
            public name!: string;
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
            expect(lKeptTableStore.keyPath).toEqual('id');
            expect(lKeptTableStore.autoIncrement).toBeTruthy();
            expect(lKeptTableStore.indexNames).toHaveLength(1);
            expect(lKeptTableStore.indexNames).toContain('keepIndex');

            const lKeepIndex: IDBIndex = lKeptTableStore.index('keepIndex');
            expect(lKeepIndex.unique).toBeFalsy();
            expect(lKeepIndex.keyPath).toEqual('name');
        });

        // Cleanup. Close the database.
        await lWebDatabase.close();
    });

    await pContext.step('Update database - Add table identity', async () => {
        // Setup. Database configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableName: string = 'TestTable';

        // Setup. Create initial database without identity using native IndexedDB API.
        const lInitialDb: IDBDatabase = await new Promise<IDBDatabase>((resolve, reject) => {
            const request = indexedDB.open(lDatabaseName, 1);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                const store = db.createObjectStore(lTableName);
                store.createIndex('nameIndex', 'name', { unique: false });
            };
        });
        lInitialDb.close();

        // Setup. Table definition with identity for WebDatabase.
        @WebDatabase.table(lTableName)
        class TestTable {
            @WebDatabase.identity(true)
            public id!: number;

            @WebDatabase.field('nameIndex')
            public name!: string;
        }

        // Process. Update database with WebDatabase.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);
        const lUpdatedDb: IDBDatabase = await lWebDatabase.open();

        // Evaluation. Verify table has identity.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTableStore: IDBObjectStore = pTransaction.transaction.objectStore(lTableName);
            expect(lTableStore.keyPath).toEqual('id');
            expect(lTableStore.autoIncrement).toBeTruthy();
            expect(lTableStore.indexNames).toHaveLength(1);
            expect(lTableStore.indexNames).toContain('nameIndex');
        });

        // Cleanup. Close the database.
        await lWebDatabase.close();
    });

    await pContext.step('Update database - Remove table identity', async () => {
        // Setup. Database configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableName: string = 'TestTable';

        // Setup. Create initial database with identity using native IndexedDB API.
        const lInitialDb: IDBDatabase = await new Promise<IDBDatabase>((resolve, reject) => {
            const request = indexedDB.open(lDatabaseName, 1);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                const store = db.createObjectStore(lTableName, { keyPath: 'id', autoIncrement: true });
                store.createIndex('nameIndex', 'name', { unique: false });
            };
        });
        lInitialDb.close();

        // Setup. Table definition without identity for WebDatabase.
        @WebDatabase.table(lTableName)
        class TestTable {
            @WebDatabase.field('nameIndex')
            public name!: string;
        }

        // Process. Update database with WebDatabase.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);
        const lUpdatedDb: IDBDatabase = await lWebDatabase.open();

        // Evaluation. Verify table has no identity.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTableStore: IDBObjectStore = pTransaction.transaction.objectStore(lTableName);
            expect(lTableStore.keyPath).toBeNull();
            expect(lTableStore.autoIncrement).toBeFalsy();
            expect(lTableStore.indexNames).toHaveLength(1);
            expect(lTableStore.indexNames).toContain('nameIndex');
        });

        // Cleanup. Close the database.
        await lWebDatabase.close();
    });

    await pContext.step('Update database - Update table identity, add auto increment', async () => {
        // Setup. Database configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableName: string = 'TestTable';

        // Setup. Create initial database with non-auto-increment identity using native IndexedDB API.
        const lInitialDb: IDBDatabase = await new Promise<IDBDatabase>((resolve, reject) => {
            const request = indexedDB.open(lDatabaseName, 1);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                const store = db.createObjectStore(lTableName, { keyPath: 'id', autoIncrement: false });
                store.createIndex('nameIndex', 'name', { unique: false });
            };
        });
        lInitialDb.close();

        // Setup. Table definition with auto-increment identity for WebDatabase.
        @WebDatabase.table(lTableName)
        class TestTable {
            @WebDatabase.identity(true)
            public id!: number;

            @WebDatabase.field('nameIndex')
            public name!: string;
        }

        // Process. Update database with WebDatabase.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);
        const lUpdatedDb: IDBDatabase = await lWebDatabase.open();

        // Evaluation. Verify table has auto-increment identity.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTableStore: IDBObjectStore = pTransaction.transaction.objectStore(lTableName);
            expect(lTableStore.keyPath).toEqual('id');
            expect(lTableStore.autoIncrement).toBeTruthy();
            expect(lTableStore.indexNames).toHaveLength(1);
            expect(lTableStore.indexNames).toContain('nameIndex');
        });

        // Cleanup. Close the database.
        await lWebDatabase.close();
    });

    await pContext.step('Update database - Update table identity, remove auto increment', async () => {
        // Setup. Database configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableName: string = 'TestTable';

        // Setup. Create initial database with auto-increment identity using native IndexedDB API.
        const lInitialDb: IDBDatabase = await new Promise<IDBDatabase>((resolve, reject) => {
            const request = indexedDB.open(lDatabaseName, 1);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                const store = db.createObjectStore(lTableName, { keyPath: 'id', autoIncrement: true });
                store.createIndex('nameIndex', 'name', { unique: false });
            };
        });
        lInitialDb.close();

        // Setup. Table definition with non-auto-increment identity for WebDatabase.
        @WebDatabase.table(lTableName)
        class TestTable {
            @WebDatabase.identity(false)
            public id!: string;

            @WebDatabase.field('nameIndex')
            public name!: string;
        }

        // Process. Update database with WebDatabase.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);
        const lUpdatedDb: IDBDatabase = await lWebDatabase.open();

        // Evaluation. Verify table has non-auto-increment identity.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTableStore: IDBObjectStore = pTransaction.transaction.objectStore(lTableName);
            expect(lTableStore.keyPath).toEqual('id');
            expect(lTableStore.autoIncrement).toBeFalsy();
            expect(lTableStore.indexNames).toHaveLength(1);
            expect(lTableStore.indexNames).toContain('nameIndex');
        });

        // Cleanup. Close the database.
        await lWebDatabase.close();
    });

    await pContext.step('Update database - Add table index', async () => {
        // Setup. Database configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableName: string = 'TestTable';
        const lNewIndexName: string = 'newIndex';

        // Setup. Create initial database without the new index using native IndexedDB API.
        const lInitialDb: IDBDatabase = await new Promise<IDBDatabase>((resolve, reject) => {
            const request = indexedDB.open(lDatabaseName, 1);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                const store = db.createObjectStore(lTableName, { keyPath: 'id', autoIncrement: true });
                store.createIndex('existingIndex', 'name', { unique: false });
            };
        });
        lInitialDb.close();

        // Setup. Table definition with new index for WebDatabase.
        @WebDatabase.table(lTableName)
        class TestTable {
            @WebDatabase.identity(true)
            public id!: number;

            @WebDatabase.field('existingIndex')
            public name!: string;

            @WebDatabase.field(lNewIndexName)
            public category!: string;
        }

        // Process. Update database with WebDatabase.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);
        const lUpdatedDb: IDBDatabase = await lWebDatabase.open();

        // Evaluation. Verify both indices exist.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTableStore: IDBObjectStore = pTransaction.transaction.objectStore(lTableName);
            expect(lTableStore.indexNames).toHaveLength(2);
            expect(lTableStore.indexNames).toContain('existingIndex');
            expect(lTableStore.indexNames).toContain(lNewIndexName);

            const lNewIndex: IDBIndex = lTableStore.index(lNewIndexName);
            expect(lNewIndex.keyPath).toEqual('category');
            expect(lNewIndex.unique).toBeFalsy();
            expect(lNewIndex.multiEntry).toBeFalsy();
        });

        // Cleanup. Close the database.
        await lWebDatabase.close();
    });

    await pContext.step('Update database - Remove table index', async () => {
        // Setup. Database configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableName: string = 'TestTable';
        const lIndexToRemove: string = 'indexToRemove';

        // Setup. Create initial database with index to remove using native IndexedDB API.
        const lInitialDb: IDBDatabase = await new Promise<IDBDatabase>((resolve, reject) => {
            const request = indexedDB.open(lDatabaseName, 1);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                const store = db.createObjectStore(lTableName, { keyPath: 'id', autoIncrement: true });
                store.createIndex('keepIndex', 'name', { unique: false });
                store.createIndex(lIndexToRemove, 'category', { unique: true });
            };
        });
        lInitialDb.close();

        // Setup. Table definition without the index to remove for WebDatabase.
        @WebDatabase.table(lTableName)
        class TestTable {
            @WebDatabase.identity(true)
            public id!: number;

            @WebDatabase.field('keepIndex')
            public name!: string;
        }

        // Process. Update database with WebDatabase.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);
        const lUpdatedDb: IDBDatabase = await lWebDatabase.open();

        // Evaluation. Verify only the kept index exists.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTableStore: IDBObjectStore = pTransaction.transaction.objectStore(lTableName);
            expect(lTableStore.indexNames).toHaveLength(1);
            expect(lTableStore.indexNames).toContain('keepIndex');
            expect(lTableStore.indexNames).not.toContain(lIndexToRemove);
        });

        // Cleanup. Close the database.
        await lWebDatabase.close();
    });

    await pContext.step('Update database - Update table index, add unique', async () => {
        // Setup. Database configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableName: string = 'TestTable';
        const lIndexName: string = 'testIndex';

        // Setup. Create initial database with non-unique index using native IndexedDB API.
        const lInitialDb: IDBDatabase = await new Promise<IDBDatabase>((resolve, reject) => {
            const request = indexedDB.open(lDatabaseName, 1);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                const store = db.createObjectStore(lTableName, { keyPath: 'id', autoIncrement: true });
                store.createIndex(lIndexName, 'name', { unique: false });
            };
        });
        lInitialDb.close();

        // Setup. Table definition with unique index for WebDatabase.
        @WebDatabase.table(lTableName)
        class TestTable {
            @WebDatabase.identity(true)
            public id!: number;

            @WebDatabase.field(lIndexName, true)
            public name!: string;
        }

        // Process. Update database with WebDatabase.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);
        const lUpdatedDb: IDBDatabase = await lWebDatabase.open();

        // Evaluation. Verify index is now unique.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTableStore: IDBObjectStore = pTransaction.transaction.objectStore(lTableName);
            const lIndex: IDBIndex = lTableStore.index(lIndexName);
            expect(lIndex.unique).toBeTruthy();
            expect(lIndex.keyPath).toEqual('name');
            expect(lIndex.multiEntry).toBeFalsy();
        });

        // Cleanup. Close the database.
        await lWebDatabase.close();
    });

    await pContext.step('Update database - Update table index, remove unique', async () => {
        // Setup. Database configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableName: string = 'TestTable';
        const lIndexName: string = 'testIndex';

        // Setup. Create initial database with unique index using native IndexedDB API.
        const lInitialDb: IDBDatabase = await new Promise<IDBDatabase>((resolve, reject) => {
            const request = indexedDB.open(lDatabaseName, 1);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                const store = db.createObjectStore(lTableName, { keyPath: 'id', autoIncrement: true });
                store.createIndex(lIndexName, 'name', { unique: true });
            };
        });
        lInitialDb.close();

        // Setup. Table definition with non-unique index for WebDatabase.
        @WebDatabase.table(lTableName)
        class TestTable {
            @WebDatabase.identity(true)
            public id!: number;

            @WebDatabase.field(lIndexName, false)
            public name!: string;
        }

        // Process. Update database with WebDatabase.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);
        const lUpdatedDb: IDBDatabase = await lWebDatabase.open();

        // Evaluation. Verify index is no longer unique.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTableStore: IDBObjectStore = pTransaction.transaction.objectStore(lTableName);
            const lIndex: IDBIndex = lTableStore.index(lIndexName);
            expect(lIndex.unique).toBeFalsy();
            expect(lIndex.keyPath).toEqual('name');
            expect(lIndex.multiEntry).toBeFalsy();
        });

        // Cleanup. Close the database.
        await lWebDatabase.close();
    });

    await pContext.step('Update database - Update table index, add multi entry', async () => {
        // Setup. Database configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableName: string = 'TestTable';
        const lIndexName: string = 'testIndex';

        // Setup. Create initial database with non-multi-entry index using native IndexedDB API.
        const lInitialDb: IDBDatabase = await new Promise<IDBDatabase>((resolve, reject) => {
            const request = indexedDB.open(lDatabaseName, 1);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                const store = db.createObjectStore(lTableName, { keyPath: 'id', autoIncrement: true });
                store.createIndex(lIndexName, 'tags', { unique: false, multiEntry: false });
            };
        });
        lInitialDb.close();

        // Setup. Table definition with multi-entry index for WebDatabase.
        @WebDatabase.table(lTableName)
        class TestTable {
            @WebDatabase.identity(true)
            public id!: number;

            @WebDatabase.field(lIndexName, false, true)
            public tags!: Array<string>;
        }

        // Process. Update database with WebDatabase.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);
        const lUpdatedDb: IDBDatabase = await lWebDatabase.open();

        // Evaluation. Verify index is now multi-entry.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTableStore: IDBObjectStore = pTransaction.transaction.objectStore(lTableName);
            const lIndex: IDBIndex = lTableStore.index(lIndexName);
            expect(lIndex.unique).toBeFalsy();
            expect(lIndex.keyPath).toEqual('tags');
            expect(lIndex.multiEntry).toBeTruthy();
        });

        // Cleanup. Close the database.
        await lWebDatabase.close();
    });

    await pContext.step('Update database - Update table index, remove multi entry', async () => {
        // Setup. Database configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableName: string = 'TestTable';
        const lIndexName: string = 'testIndex';

        // Setup. Create initial database with multi-entry index using native IndexedDB API.
        const lInitialDb: IDBDatabase = await new Promise<IDBDatabase>((resolve, reject) => {
            const request = indexedDB.open(lDatabaseName, 1);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                const store = db.createObjectStore(lTableName, { keyPath: 'id', autoIncrement: true });
                store.createIndex(lIndexName, 'category', { unique: false, multiEntry: true });
            };
        });
        lInitialDb.close();

        // Setup. Table definition with non-multi-entry index for WebDatabase.
        @WebDatabase.table(lTableName)
        class TestTable {
            @WebDatabase.identity(true)
            public id!: number;

            @WebDatabase.field(lIndexName, false, false)
            public category!: string;
        }

        // Process. Update database with WebDatabase.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);
        const lUpdatedDb: IDBDatabase = await lWebDatabase.open();

        // Evaluation. Verify index is no longer multi-entry.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTableStore: IDBObjectStore = pTransaction.transaction.objectStore(lTableName);
            const lIndex: IDBIndex = lTableStore.index(lIndexName);
            expect(lIndex.unique).toBeFalsy();
            expect(lIndex.keyPath).toEqual('category');
            expect(lIndex.multiEntry).toBeFalsy();
        });

        // Cleanup. Close the database.
        await lWebDatabase.close();
    });

    await pContext.step('Update database - Update table index, change default index to compound index', async () => {
        // Setup. Database configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableName: string = 'TestTable';
        const lIndexName: string = 'testIndex';

        // Setup. Create initial database with single-property index using native IndexedDB API.
        const lInitialDb: IDBDatabase = await new Promise<IDBDatabase>((resolve, reject) => {
            const request = indexedDB.open(lDatabaseName, 1);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                const store = db.createObjectStore(lTableName, { keyPath: 'id', autoIncrement: true });
                store.createIndex(lIndexName, 'firstName', { unique: false });
            };
        });
        lInitialDb.close();

        // Setup. Table definition with compound index for WebDatabase.
        @WebDatabase.table(lTableName)
        class TestTable {
            @WebDatabase.identity(true)
            public id!: number;

            @WebDatabase.field(lIndexName)
            public firstName!: string;

            @WebDatabase.field(lIndexName)
            public lastName!: string;
        }

        // Process. Update database with WebDatabase.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);
        const lUpdatedDb: IDBDatabase = await lWebDatabase.open();

        // Evaluation. Verify index is now compound.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTableStore: IDBObjectStore = pTransaction.transaction.objectStore(lTableName);
            const lIndex: IDBIndex = lTableStore.index(lIndexName);
            expect(lIndex.unique).toBeFalsy();
            expect(lIndex.keyPath).toEqual(['firstName', 'lastName']);
            expect(lIndex.multiEntry).toBeFalsy();
        });

        // Cleanup. Close the database.
        await lWebDatabase.close();
    });

    await pContext.step('Update database - Update table index, change compound index to default index', async () => {
        // Setup. Database configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableName: string = 'TestTable';
        const lIndexName: string = 'testIndex';

        // Setup. Create initial database with compound index using native IndexedDB API.
        const lInitialDb: IDBDatabase = await new Promise<IDBDatabase>((resolve, reject) => {
            const request = indexedDB.open(lDatabaseName, 1);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                const store = db.createObjectStore(lTableName, { keyPath: 'id', autoIncrement: true });
                store.createIndex(lIndexName, ['firstName', 'lastName'], { unique: false });
            };
        });
        lInitialDb.close();

        // Setup. Table definition with single-property index for WebDatabase.
        @WebDatabase.table(lTableName)
        class TestTable {
            @WebDatabase.identity(true)
            public id!: number;

            @WebDatabase.field(lIndexName)
            public firstName!: string;
        }

        // Process. Update database with WebDatabase.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);
        const lUpdatedDb: IDBDatabase = await lWebDatabase.open();

        // Evaluation. Verify index is now single-property.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTableStore: IDBObjectStore = pTransaction.transaction.objectStore(lTableName);
            const lIndex: IDBIndex = lTableStore.index(lIndexName);
            expect(lIndex.unique).toBeFalsy();
            expect(lIndex.keyPath).toEqual('firstName');
            expect(lIndex.multiEntry).toBeFalsy();
        });

        // Cleanup. Close the database.
        await lWebDatabase.close();
    });

    await pContext.step('Update database - Update table index, add property to compound index', async () => {
        // Setup. Database configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableName: string = 'TestTable';
        const lIndexName: string = 'testIndex';

        // Setup. Create initial database with two-property compound index using native IndexedDB API.
        const lInitialDb: IDBDatabase = await new Promise<IDBDatabase>((resolve, reject) => {
            const request = indexedDB.open(lDatabaseName, 1);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                const store = db.createObjectStore(lTableName, { keyPath: 'id', autoIncrement: true });
                store.createIndex(lIndexName, ['firstName', 'lastName'], { unique: false });
            };
        });
        lInitialDb.close();

        // Setup. Table definition with three-property compound index for WebDatabase.
        @WebDatabase.table(lTableName)
        class TestTable {
            @WebDatabase.identity(true)
            public id!: number;

            @WebDatabase.field(lIndexName)
            public firstName!: string;

            @WebDatabase.field(lIndexName)
            public lastName!: string;

            @WebDatabase.field(lIndexName)
            public middleName!: string;
        }

        // Process. Update database with WebDatabase.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);
        const lUpdatedDb: IDBDatabase = await lWebDatabase.open();

        // Evaluation. Verify index now includes three properties.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTableStore: IDBObjectStore = pTransaction.transaction.objectStore(lTableName);
            const lIndex: IDBIndex = lTableStore.index(lIndexName);
            expect(lIndex.unique).toBeFalsy();
            expect(lIndex.keyPath).toEqual(['firstName', 'lastName', 'middleName']);
            expect(lIndex.multiEntry).toBeFalsy();
        });

        // Cleanup. Close the database.
        await lWebDatabase.close();
    });

    await pContext.step('Update database - Update table index, remove property from compound index', async () => {
        // Setup. Database configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableName: string = 'TestTable';
        const lIndexName: string = 'testIndex';

        // Setup. Create initial database with three-property compound index using native IndexedDB API.
        const lInitialDb: IDBDatabase = await new Promise<IDBDatabase>((resolve, reject) => {
            const request = indexedDB.open(lDatabaseName, 1);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                const store = db.createObjectStore(lTableName, { keyPath: 'id', autoIncrement: true });
                store.createIndex(lIndexName, ['firstName', 'lastName', 'middleName'], { unique: false });
            };
        });
        lInitialDb.close();

        // Setup. Table definition with two-property compound index for WebDatabase.
        @WebDatabase.table(lTableName)
        class TestTable {
            @WebDatabase.identity(true)
            public id!: number;

            @WebDatabase.field(lIndexName)
            public firstName!: string;

            @WebDatabase.field(lIndexName)
            public lastName!: string;
        }

        // Process. Update database with WebDatabase.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);
        const lUpdatedDb: IDBDatabase = await lWebDatabase.open();

        // Evaluation. Verify index now includes only two properties.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTableStore: IDBObjectStore = pTransaction.transaction.objectStore(lTableName);
            const lIndex: IDBIndex = lTableStore.index(lIndexName);
            expect(lIndex.unique).toBeFalsy();
            expect(lIndex.keyPath).toEqual(['firstName', 'lastName']);
            expect(lIndex.multiEntry).toBeFalsy();
        });

        // Cleanup. Close the database.
        await lWebDatabase.close();
    });
});

Deno.test('WebDatabase.table()', async (pContext) => {
    await pContext.step('Valid table name', () => {
        // Process
        const decoratorFunction = () => {
            @WebDatabase.table('ValidTable')
            class TestTable {
            }
        };

        // Evaluation - should not throw an error
        expect(decoratorFunction).not.toThrow();
    });

    await pContext.step('Empty table name', () => {
        // Process
        const decoratorFunction = () => {
            @WebDatabase.table('')
            class TestTable {
            }
        };

        // Evaluation - should not throw an error (empty string is a valid string)
        expect(decoratorFunction).not.toThrow();
    });

    await pContext.step('Special characters in table name', () => {
        // Process
        const decoratorFunction = () => {
            @WebDatabase.table('Test-Table_123$')
            class TestTable {
            }
        };

        // Evaluation - should not throw an error
        expect(decoratorFunction).not.toThrow();
    });
});

Deno.test('WebDatabase.identity()', async (pContext) => {
    await pContext.step('Valid identity with autoIncrement true', () => {
        // Process
        const decoratorFunction = () => {
            class TestTable {
                @WebDatabase.identity(true)
                public id!: number;
            }
        };

        // Evaluation - should not throw an error
        expect(decoratorFunction).not.toThrow();
    });

    await pContext.step('Valid identity with autoIncrement false', () => {
        // Process
        const decoratorFunction = () => {
            class TestTable {
                @WebDatabase.identity(false)
                public id!: string;
            }
        };

        // Evaluation - should not throw an error
        expect(decoratorFunction).not.toThrow();
    });

    await pContext.step('Error: identity on static property', () => {
        // Process
        const decoratorFunction = () => {
            class TestTable {
                @WebDatabase.identity(true)
                static id: number;
            }
        };

        // Evaluation - should throw an error about static properties
        expect(decoratorFunction).toThrow('Identity property can not be a static property.');
    });

    await pContext.step('Error: identity with symbol property name', () => {
        // Process
        const decoratorFunction = () => {
            const symbolProp = Symbol('id');
            class TestTable {
                @WebDatabase.identity(true)
                [symbolProp]!: number;
            }
        };

        // Evaluation - should throw an error about non-string property name
        expect(decoratorFunction).toThrow('Identity name must be a string.');
    });

    await pContext.step('Error: identity with number property name', () => {
        // Process
        const decoratorFunction = () => {
            class TestTable {
                @WebDatabase.identity(true)
                [123]!: number;
            }
        };

        // Evaluation - should throw an error about non-string property name
        expect(decoratorFunction).toThrow('Identity name must be a string.');
    });

    await pContext.step('Error: multiple identity decorators on same class', () => {
        // Process
        const decoratorFunction = () => {
            @WebDatabase.table('MultipleIdentityTable')
            class TestTable {
                @WebDatabase.identity(true)
                public id1!: number;

                @WebDatabase.identity(false)
                public id2!: string;
            }

            // Create database instance to trigger validation
            new WebDatabase('test-db', [TestTable]);
        };

        // Evaluation - should throw an error about multiple identities
        expect(decoratorFunction).toThrow('A table type can only have one identifier.');
    });
});

Deno.test('WebDatabase.field()', async (pContext) => {
    await pContext.step('Valid field with default parameters', () => {
        // Process
        const decoratorFunction = () => {
            class TestTable {
                @WebDatabase.field()
                public name!: string;
            }
        };

        // Evaluation - should not throw an error
        expect(decoratorFunction).not.toThrow();
    });

    await pContext.step('Valid field with index name', () => {
        // Setup. Index name for the test
        const lIndexName: string = 'nameIndex';

        // Process
        const decoratorFunction = () => {
            class TestTable {
                @WebDatabase.field(lIndexName)
                public name!: string;
            }
        };

        // Evaluation - should not throw an error
        expect(decoratorFunction).not.toThrow();
    });

    await pContext.step('Valid field with unique index', () => {
        // Setup. Index name for the test
        const lIndexName: string = 'nameIndex';

        // Process
        const decoratorFunction = () => {
            class TestTable {
                @WebDatabase.field(lIndexName, true)
                public name!: string;
            }
        };

        // Evaluation - should not throw an error
        expect(decoratorFunction).not.toThrow();
    });

    await pContext.step('Valid field with multiEntry index', () => {
        // Setup. Index name for the test
        const lIndexName: string = 'tagsIndex';

        // Process
        const decoratorFunction = () => {
            class TestTable {
                @WebDatabase.field(lIndexName, false, true)
                public tags!: Array<string>;
            }
        };

        // Evaluation - should not throw an error
        expect(decoratorFunction).not.toThrow();
    });

    await pContext.step('Valid field with unique and multiEntry index', () => {
        // Setup. Index name for the test
        const lIndexName: string = 'uniqueTagsIndex';

        // Process
        const decoratorFunction = () => {
            class TestTable {
                @WebDatabase.field(lIndexName, true, true)
                public uniqueTags!: Array<string>;
            }
        };

        // Evaluation - should not throw an error
        expect(decoratorFunction).not.toThrow();
    });

    await pContext.step('Valid field with empty string index name', () => {
        // Setup. Index name for the test
        const lIndexName: string = '';

        // Process
        const decoratorFunction = () => {
            class TestTable {
                @WebDatabase.field(lIndexName)
                public name!: string;
            }
        };

        // Evaluation - should not throw an error
        expect(decoratorFunction).not.toThrow();
    });

    await pContext.step('Valid compound index with same index name', () => {
        // Setup. Index name for the test
        const lIndexName: string = 'fullNameIndex';

        // Process
        const decoratorFunction = () => {
            @WebDatabase.table('CompoundIndexTable')
            class TestTable {
                @WebDatabase.field(lIndexName)
                public firstName!: string;

                @WebDatabase.field(lIndexName)
                public lastName!: string;
            }

            // Create database instance to ensure it works
            new WebDatabase('test-db', [TestTable]);
        };

        // Evaluation - should not throw an error for valid compound index
        expect(decoratorFunction).not.toThrow();
    });

    await pContext.step('Error: field on static property', () => {
        // Setup. Index name for the test
        const lIndexName: string = 'nameIndex';

        // Process
        const decoratorFunction = () => {
            class TestTable {
                @WebDatabase.field(lIndexName)
                static name: string;
            }
        };

        // Evaluation - should throw an error about static properties
        expect(decoratorFunction).toThrow('Index property can not be a static property.');
    });

    await pContext.step('Error: field with symbol property name', () => {
        // Setup. Index name for the test
        const lIndexName: string = 'nameIndex';

        // Process
        const decoratorFunction = () => {
            const symbolProp = Symbol('name');
            class TestTable {
                @WebDatabase.field(lIndexName)
                [symbolProp]!: string;
            }
        };

        // Evaluation - should throw an error about non-string property name
        expect(decoratorFunction).toThrow('Index name must be a string.');
    });

    await pContext.step('Error: field with number property name', () => {
        // Setup. Index name for the test
        const lIndexName: string = 'indexName';

        // Process
        const decoratorFunction = () => {
            class TestTable {
                @WebDatabase.field(lIndexName)
                [456]!: string;
            }
        };

        // Evaluation - should throw an error about non-string property name
        expect(decoratorFunction).toThrow('Index name must be a string.');
    });

    await pContext.step('Error: compound index with multiEntry', () => {
        // Setup. Index name for the test
        const lIndexName: string = 'compoundMultiIndex';

        // Process
        const decoratorFunction = () => {
            @WebDatabase.table('CompoundMultiEntryTable')
            class TestTable {
                @WebDatabase.field(lIndexName, false, true)
                public field1!: Array<string>;

                @WebDatabase.field(lIndexName, false, false)
                public field2!: string;
            }

            // Create an instance to ensure decorators are applied and validation occurs
            new WebDatabase('test-db', [TestTable]);
        };

        // Evaluation - should throw an error about multientity index
        expect(decoratorFunction).toThrow('Multi entity index can only have one property.');
    });

    await pContext.step('Error: mixed unique settings in compound index', () => {
        // Setup. Index name for the test
        const lIndexName: string = 'mixedIndex';

        // Process
        const decoratorFunction = () => {
            @WebDatabase.table('MixedUniqueTable')
            class TestTable {
                @WebDatabase.field(lIndexName, true)
                public field1!: string;

                @WebDatabase.field(lIndexName, false)
                public field2!: string;
            }

            // Create database instance to trigger validation
            new WebDatabase('test-db', [TestTable]);
        };

        // Evaluation - should throw an error about inconsistent unique settings
        expect(decoratorFunction).toThrow(`Multi key index "${lIndexName}" cant have mixed unique settings.`);
    });
});