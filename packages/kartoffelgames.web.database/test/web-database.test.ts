import 'npm:fake-indexeddb/auto';
import { expect } from '@kartoffelgames/core-test';
import { WebDatabase, WebDatabaseTable } from '../source/index.ts';

Deno.test('WebDatabase.open', async (pContext) => {
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

    await pContext.step('Table - Read name by table name', async () => {
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
            const lTestTableObjectStore: IDBObjectStore = lWebDbTransaction.objectStore(TestTable.name);
            expect(lTestTableObjectStore.name).toEqual(lTableName);
        });
    });
});

Deno.test('WebDatabase.table', async (pContext) => {
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

Deno.test('WebDatabase.identity', async (pContext) => {
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

Deno.test('WebDatabase.field', async (pContext) => {
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
        expect(decoratorFunction).toThrow('Multientity index can only have one property.');
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