import { expect } from '@kartoffelgames/core-test';
import 'npm:fake-indexeddb/auto';
import { WebDatabase } from '../source/index.ts';

// Sanitize disabled because timers are started outside of the test in fake-indexeddb.
Deno.test('WebDatabaseTable.clear()', { sanitizeResources: false, sanitizeOps: false }, async (pContext) => {
    await pContext.step('Clear table with data', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableName: string = 'TestTable';

        // Setup. Table
        @WebDatabase.table(lTableName)
        class TestTable {
            @WebDatabase.field({ as: { identity: 'auto' } })
            public id!: number;

            @WebDatabase.field()
            public name!: string;
        }

        // Setup. Database and add test data.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Add test data.
        await lWebDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
            const lTable = pTransaction.table(TestTable);
            
            const lTestData1 = new TestTable();
            lTestData1.name = 'Test Item 1';
            await lTable.put(lTestData1);

            const lTestData2 = new TestTable();
            lTestData2.name = 'Test Item 2';
            await lTable.put(lTestData2);
        });

        // Process. Clear table.
        await lWebDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
            const lTable = pTransaction.table(TestTable);
            await lTable.clear();
        });

        // Evaluation. Verify table is empty.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTable = pTransaction.table(TestTable);
            const lCount = await lTable.count();
            expect(lCount).toEqual(0);
        });

        // Cleanup.
        lWebDatabase.close();
    });

    await pContext.step('Clear empty table', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableName: string = 'TestTable';

        // Setup. Table
        @WebDatabase.table(lTableName)
        class TestTable {
            @WebDatabase.field({ as: { identity: 'auto' } })
            public id!: number;

            @WebDatabase.field()
            public name!: string;
        }

        // Setup. Database.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Process. Clear empty table.
        await lWebDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
            const lTable = pTransaction.table(TestTable);
            await lTable.clear();
        });

        // Evaluation. Verify table is still empty.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTable = pTransaction.table(TestTable);
            const lCount = await lTable.count();
            expect(lCount).toEqual(0);
        });

        // Cleanup.
        lWebDatabase.close();
    });
});

Deno.test('WebDatabaseTable.count()', { sanitizeResources: false, sanitizeOps: false }, async (pContext) => {
    await pContext.step('Count empty table', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableName: string = 'TestTable';

        // Setup. Table
        @WebDatabase.table(lTableName)
        class TestTable {
            @WebDatabase.field({ as: { identity: 'auto' } })
            public id!: number;

            @WebDatabase.field()
            public name!: string;
        }

        // Setup. Database.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Process and Evaluation.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTable = pTransaction.table(TestTable);
            const lCount = await lTable.count();
            expect(lCount).toEqual(0);
        });

        // Cleanup.
        lWebDatabase.close();
    });

    await pContext.step('Count table with data', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableName: string = 'TestTable';

        // Setup. Table
        @WebDatabase.table(lTableName)
        class TestTable {
            @WebDatabase.field({ as: { identity: 'auto' } })
            public id!: number;

            @WebDatabase.field()
            public name!: string;
        }

        // Setup. Database and add test data.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Add test data.
        await lWebDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
            const lTable = pTransaction.table(TestTable);
            
            for (let i = 0; i < 5; i++) {
                const lTestData = new TestTable();
                lTestData.name = `Test Item ${i}`;
                await lTable.put(lTestData);
            }
        });

        // Process and Evaluation.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTable = pTransaction.table(TestTable);
            const lCount = await lTable.count();
            expect(lCount).toEqual(5);
        });

        // Cleanup.
        lWebDatabase.close();
    });
});

Deno.test('WebDatabaseTable.delete()', { sanitizeResources: false, sanitizeOps: false }, async (pContext) => {
    await pContext.step('Delete by identity - auto increment', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableName: string = 'TestTable';

        // Setup. Table
        @WebDatabase.table(lTableName)
        class TestTable {
            @WebDatabase.field({ as: { identity: 'auto' } })
            public id!: number;

            @WebDatabase.field()
            public name!: string;
        }

        // Setup. Database and add test data.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        let lTestDataToDelete: TestTable;

        // Add test data.
        await lWebDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
            const lTable = pTransaction.table(TestTable);
            
            lTestDataToDelete = new TestTable();
            lTestDataToDelete.name = 'To Delete';
            await lTable.put(lTestDataToDelete);

            const lTestDataToKeep = new TestTable();
            lTestDataToKeep.name = 'To Keep';
            await lTable.put(lTestDataToKeep);
        });

        // Process. Delete data.
        await lWebDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
            const lTable = pTransaction.table(TestTable);
            await lTable.delete(lTestDataToDelete);
        });

        // Evaluation. Verify deletion.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTable = pTransaction.table(TestTable);
            const lCount = await lTable.count();
            expect(lCount).toEqual(1);

            const lRemainingData = await lTable.getAll();
            expect(lRemainingData).toHaveLength(1);
            expect(lRemainingData[0].name).toEqual('To Keep');
        });

        // Cleanup.
        lWebDatabase.close();
    });

    await pContext.step('Delete by identity - manual', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableName: string = 'TestTable';

        // Setup. Table
        @WebDatabase.table(lTableName)
        class TestTable {
            @WebDatabase.field({ as: { identity: 'manual' } })
            public id!: string;

            @WebDatabase.field()
            public name!: string;
        }

        // Setup. Database and add test data.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        let lTestDataToDelete: TestTable;

        // Add test data.
        await lWebDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
            const lTable = pTransaction.table(TestTable);
            
            lTestDataToDelete = new TestTable();
            lTestDataToDelete.id = 'delete-me';
            lTestDataToDelete.name = 'To Delete';
            await lTable.put(lTestDataToDelete);

            const lTestDataToKeep = new TestTable();
            lTestDataToKeep.id = 'keep-me';
            lTestDataToKeep.name = 'To Keep';
            await lTable.put(lTestDataToKeep);
        });

        // Process. Delete data.
        await lWebDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
            const lTable = pTransaction.table(TestTable);
            await lTable.delete(lTestDataToDelete);
        });

        // Evaluation. Verify deletion.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTable = pTransaction.table(TestTable);
            const lCount = await lTable.count();
            expect(lCount).toEqual(1);

            const lRemainingData = await lTable.getAll();
            expect(lRemainingData).toHaveLength(1);
            expect(lRemainingData[0].name).toEqual('To Keep');
        });

        // Cleanup.
        lWebDatabase.close();
    });

    await pContext.step('Delete by unique index', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableName: string = 'TestTable';

        // Setup. Table
        @WebDatabase.table(lTableName)
        class TestTable {
            @WebDatabase.field({ as: { index: { unique: true } } })
            public email!: string;

            @WebDatabase.field()
            public name!: string;
        }

        // Setup. Database and add test data.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        let lTestDataToDelete: TestTable;

        // Add test data.
        await lWebDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
            const lTable = pTransaction.table(TestTable);
            
            lTestDataToDelete = new TestTable();
            lTestDataToDelete.email = 'delete@test.com';
            lTestDataToDelete.name = 'To Delete';
            await lTable.put(lTestDataToDelete);

            const lTestDataToKeep = new TestTable();
            lTestDataToKeep.email = 'keep@test.com';
            lTestDataToKeep.name = 'To Keep';
            await lTable.put(lTestDataToKeep);
        });

        // Process. Delete data.
        await lWebDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
            const lTable = pTransaction.table(TestTable);
            await lTable.delete(lTestDataToDelete);
        });

        // Evaluation. Verify deletion.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTable = pTransaction.table(TestTable);
            const lCount = await lTable.count();
            expect(lCount).toEqual(1);

            const lRemainingData = await lTable.getAll();
            expect(lRemainingData).toHaveLength(1);
            expect(lRemainingData[0].name).toEqual('To Keep');
        });

        // Cleanup.
        lWebDatabase.close();
    });

    await pContext.step('Error: Invalid data type', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableName: string = 'TestTable';

        // Setup. Table
        @WebDatabase.table(lTableName)
        class TestTable {
            @WebDatabase.field({ as: { identity: 'auto' } })
            public id!: number;

            @WebDatabase.field()
            public name!: string;
        }

        // Setup. Database.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Process and Evaluation.
        await lWebDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
            const lTable = pTransaction.table(TestTable);
            
            // Try to delete invalid data type.
            const lInvalidData = { id: 1, name: 'Invalid' };
            await expect(lTable.delete(lInvalidData as any)).rejects.toThrow('Invalid data type.');
        });

        // Cleanup.
        lWebDatabase.close();
    });

    await pContext.step('Error: No identity or unique index', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableName: string = 'TestTable';

        // Setup. Table
        @WebDatabase.table(lTableName)
        class TestTable {
            @WebDatabase.field({ as: { index: {} } })
            public name!: string;
        }

        // Setup. Database.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Process and Evaluation.
        await lWebDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
            const lTable = pTransaction.table(TestTable);
            
            const lTestData = new TestTable();
            lTestData.name = 'Test';
            
            await expect(lTable.delete(lTestData)).rejects.toThrow('Table TestTable must have a unique, not multi entry, index or identity to delete data directly.');
        });

        // Cleanup.
        lWebDatabase.close();
    });
});

Deno.test('WebDatabaseTable.getAll()', { sanitizeResources: false, sanitizeOps: false }, async (pContext) => {
    await pContext.step('Get all from empty table', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableName: string = 'TestTable';

        // Setup. Table
        @WebDatabase.table(lTableName)
        class TestTable {
            @WebDatabase.field({ as: { identity: 'auto' } })
            public id!: number;

            @WebDatabase.field()
            public name!: string;
        }

        // Setup. Database.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Process and Evaluation.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTable = pTransaction.table(TestTable);
            const lResult = await lTable.getAll();
            
            expect(lResult).toHaveLength(0);
            expect(Array.isArray(lResult)).toBeTruthy();
        });

        // Cleanup.
        lWebDatabase.close();
    });

    await pContext.step('Get all with data', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableName: string = 'TestTable';

        // Setup. Table
        @WebDatabase.table(lTableName)
        class TestTable {
            @WebDatabase.field({ as: { identity: 'auto' } })
            public id!: number;

            @WebDatabase.field()
            public name!: string;

            @WebDatabase.field()
            public value!: number;
        }

        // Setup. Database and add test data.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Add test data.
        await lWebDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
            const lTable = pTransaction.table(TestTable);
            
            for (let i = 0; i < 3; i++) {
                const lTestData = new TestTable();
                lTestData.name = `Item ${i}`;
                lTestData.value = i * 10;
                await lTable.put(lTestData);
            }
        });

        // Process and Evaluation.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTable = pTransaction.table(TestTable);
            const lResult = await lTable.getAll();
            
            expect(lResult).toHaveLength(3);
            expect(lResult[0]).toBeInstanceOf(TestTable);
            expect(lResult[0].name).toEqual('Item 0');
            expect(lResult[0].value).toEqual(0);
            expect(lResult[1].name).toEqual('Item 1');
            expect(lResult[2].name).toEqual('Item 2');
        });

        // Cleanup.
        lWebDatabase.close();
    });

    await pContext.step('Get all with limit', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableName: string = 'TestTable';

        // Setup. Table
        @WebDatabase.table(lTableName)
        class TestTable {
            @WebDatabase.field({ as: { identity: 'auto' } })
            public id!: number;

            @WebDatabase.field()
            public name!: string;
        }

        // Setup. Database and add test data.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Add test data.
        await lWebDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
            const lTable = pTransaction.table(TestTable);
            
            for (let i = 0; i < 5; i++) {
                const lTestData = new TestTable();
                lTestData.name = `Item ${i}`;
                await lTable.put(lTestData);
            }
        });

        // Process and Evaluation.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTable = pTransaction.table(TestTable);
            const lResult = await lTable.getAll(2);
            
            expect(lResult).toHaveLength(2);
            expect(lResult[0]).toBeInstanceOf(TestTable);
        });

        // Cleanup.
        lWebDatabase.close();
    });
});

Deno.test('WebDatabaseTable.parseToType()', { sanitizeResources: false, sanitizeOps: false }, async (pContext) => {
    await pContext.step('Parse empty array', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableName: string = 'TestTable';

        // Setup. Table
        @WebDatabase.table(lTableName)
        class TestTable {
            @WebDatabase.field({ as: { identity: 'auto' } })
            public id!: number;

            @WebDatabase.field()
            public name!: string;
        }

        // Setup. Database.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Process and Evaluation.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTable = pTransaction.table(TestTable);
            const lResult = lTable.parseToType([]);
            
            expect(lResult).toHaveLength(0);
            expect(Array.isArray(lResult)).toBeTruthy();
        });

        // Cleanup.
        lWebDatabase.close();
    });

    await pContext.step('Parse data objects to types', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableName: string = 'TestTable';

        // Setup. Table
        @WebDatabase.table(lTableName)
        class TestTable {
            @WebDatabase.field({ as: { identity: 'auto' } })
            public id!: number;

            @WebDatabase.field()
            public name!: string;

            @WebDatabase.field()
            public value!: number;
        }

        // Setup. Database.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Process and Evaluation.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTable = pTransaction.table(TestTable);
            
            const lRawData = [
                { id: 1, name: 'Test 1', value: 100, extraField: 'ignored' },
                { id: 2, name: 'Test 2', value: 200, extraField: 'ignored' }
            ];
            
            const lResult = lTable.parseToType(lRawData);
            
            expect(lResult).toHaveLength(2);
            expect(lResult[0]).toBeInstanceOf(TestTable);
            expect(lResult[0].id).toEqual(1);
            expect(lResult[0].name).toEqual('Test 1');
            expect(lResult[0].value).toEqual(100);
            expect((lResult[0] as any).extraField).toBeUndefined();
            
            expect(lResult[1]).toBeInstanceOf(TestTable);
            expect(lResult[1].id).toEqual(2);
            expect(lResult[1].name).toEqual('Test 2');
            expect(lResult[1].value).toEqual(200);
        });

        // Cleanup.
        lWebDatabase.close();
    });

    await pContext.step('Parse partial data', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableName: string = 'TestTable';

        // Setup. Table
        @WebDatabase.table(lTableName)
        class TestTable {
            @WebDatabase.field({ as: { identity: 'auto' } })
            public id!: number;

            @WebDatabase.field()
            public name!: string;

            @WebDatabase.field()
            public value!: number;
        }

        // Setup. Database.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Process and Evaluation.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTable = pTransaction.table(TestTable);
            
            const lRawData = [
                { id: 1, name: 'Test 1' }, // Missing value field
                { name: 'Test 2', value: 200 } // Missing id field
            ];
            
            const lResult = lTable.parseToType(lRawData);
            
            expect(lResult).toHaveLength(2);
            expect(lResult[0]).toBeInstanceOf(TestTable);
            expect(lResult[0].id).toEqual(1);
            expect(lResult[0].name).toEqual('Test 1');
            expect(lResult[0].value).toBeUndefined();
            
            expect(lResult[1]).toBeInstanceOf(TestTable);
            expect(lResult[1].id).toBeUndefined();
            expect(lResult[1].name).toEqual('Test 2');
            expect(lResult[1].value).toEqual(200);
        });

        // Cleanup.
        lWebDatabase.close();
    });
});

Deno.test('WebDatabaseTable.put()', { sanitizeResources: false, sanitizeOps: false }, async (pContext) => {
    await pContext.step('Put data with auto identity', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableName: string = 'TestTable';

        // Setup. Table
        @WebDatabase.table(lTableName)
        class TestTable {
            @WebDatabase.field({ as: { identity: 'auto' } })
            public id!: number;

            @WebDatabase.field()
            public name!: string;
        }

        // Setup. Database.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Process.
        let lTestData: TestTable;
        await lWebDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
            const lTable = pTransaction.table(TestTable);
            
            lTestData = new TestTable();
            lTestData.name = 'Test Item';
            await lTable.put(lTestData);
        });

        // Evaluation. Verify data was saved and auto-increment ID was set.
        expect(lTestData!.id).toBeGreaterThan(0);
        
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTable = pTransaction.table(TestTable);
            const lCount = await lTable.count();
            expect(lCount).toEqual(1);
            
            const lResult = await lTable.getAll();
            expect(lResult).toHaveLength(1);
            expect(lResult[0].name).toEqual('Test Item');
            expect(lResult[0].id).toEqual(lTestData!.id);
        });

        // Cleanup.
        lWebDatabase.close();
    });

    await pContext.step('Put data with manual identity', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableName: string = 'TestTable';

        // Setup. Table
        @WebDatabase.table(lTableName)
        class TestTable {
            @WebDatabase.field({ as: { identity: 'manual' } })
            public id!: string;

            @WebDatabase.field()
            public name!: string;
        }

        // Setup. Database.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Process.
        await lWebDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
            const lTable = pTransaction.table(TestTable);
            
            const lTestData = new TestTable();
            lTestData.id = 'custom-id';
            lTestData.name = 'Test Item';
            await lTable.put(lTestData);
        });

        // Evaluation.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTable = pTransaction.table(TestTable);
            const lCount = await lTable.count();
            expect(lCount).toEqual(1);
            
            const lResult = await lTable.getAll();
            expect(lResult).toHaveLength(1);
            expect(lResult[0].name).toEqual('Test Item');
            expect(lResult[0].id).toEqual('custom-id');
        });

        // Cleanup.
        lWebDatabase.close();
    });

    await pContext.step('Put data without identity', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableName: string = 'TestTable';

        // Setup. Table
        @WebDatabase.table(lTableName)
        class TestTable {
            @WebDatabase.field()
            public name!: string;

            @WebDatabase.field()
            public value!: number;
        }

        // Setup. Database.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Process.
        await lWebDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
            const lTable = pTransaction.table(TestTable);
            
            const lTestData = new TestTable();
            lTestData.name = 'Test Item';
            lTestData.value = 42;
            await lTable.put(lTestData);
        });

        // Evaluation.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTable = pTransaction.table(TestTable);
            const lCount = await lTable.count();
            expect(lCount).toEqual(1);
            
            const lResult = await lTable.getAll();
            expect(lResult).toHaveLength(1);
            expect(lResult[0].name).toEqual('Test Item');
            expect(lResult[0].value).toEqual(42);
        });

        // Cleanup.
        lWebDatabase.close();
    });

    await pContext.step('Put data with extra fields filtered out', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableName: string = 'TestTable';

        // Setup. Table
        @WebDatabase.table(lTableName)
        class TestTable {
            @WebDatabase.field({ as: { identity: 'auto' } })
            public id!: number;

            @WebDatabase.field()
            public name!: string;

            // Extra field not decorated - should be filtered out
            public extraField!: string;
        }

        // Setup. Database.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Process.
        await lWebDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
            const lTable = pTransaction.table(TestTable);
            
            const lTestData = new TestTable();
            lTestData.name = 'Test Item';
            lTestData.extraField = 'Should be filtered';
            await lTable.put(lTestData);
        });

        // Evaluation. Verify only decorated fields are saved.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTable = pTransaction.table(TestTable);
            const lResult = await lTable.getAll();
            
            expect(lResult).toHaveLength(1);
            expect(lResult[0].name).toEqual('Test Item');
            expect(lResult[0].extraField).toBeUndefined();
        });

        // Cleanup.
        lWebDatabase.close();
    });

    await pContext.step('Error: Invalid data type', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableName: string = 'TestTable';

        // Setup. Table
        @WebDatabase.table(lTableName)
        class TestTable {
            @WebDatabase.field({ as: { identity: 'auto' } })
            public id!: number;

            @WebDatabase.field()
            public name!: string;
        }

        // Setup. Database.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Process and Evaluation.
        await lWebDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
            const lTable = pTransaction.table(TestTable);
            
            // Try to put invalid data type.
            const lInvalidData = { name: 'Invalid' };
            await expect(lTable.put(lInvalidData as any)).rejects.toThrow('Invalid data type.');
        });

        // Cleanup.
        lWebDatabase.close();
    });
});

Deno.test('WebDatabaseTable.where()', { sanitizeResources: false, sanitizeOps: false }, async (pContext) => {
    await pContext.step('Create query with property name', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableName: string = 'TestTable';

        // Setup. Table
        @WebDatabase.table(lTableName)
        class TestTable {
            @WebDatabase.field({ as: { identity: 'auto' } })
            public id!: number;

            @WebDatabase.field({ as: { index: {} } })
            public name!: string;
        }

        // Setup. Database.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Process and Evaluation.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTable = pTransaction.table(TestTable);
            const lQuery = lTable.where('name');
            
            // Verify query is created and is chainable.
            expect(lQuery).toBeDefined();
            expect(typeof lQuery.is).toEqual('function');
            expect(typeof lQuery.between).toEqual('function');
        });

        // Cleanup.
        lWebDatabase.close();
    });

    await pContext.step('Create query with index name', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableName: string = 'TestTable';

        // Setup. Table
        @WebDatabase.table(lTableName)
        class TestTable {
            @WebDatabase.field({ as: { identity: 'auto' } })
            public id!: number;

            @WebDatabase.field({ as: { index: {} } })
            public email!: string;
        }

        // Setup. Database.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Process and Evaluation.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTable = pTransaction.table(TestTable);
            const lQuery = lTable.where('email');
            
            // Verify query is created and is chainable.
            expect(lQuery).toBeDefined();
            expect(typeof lQuery.is).toEqual('function');
            expect(typeof lQuery.between).toEqual('function');
        });

        // Cleanup.
        lWebDatabase.close();
    });

    await pContext.step('Create query with compound index name', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableName: string = 'TestTable';
        const lIndexProperty1 = 'firstName';
        const lIndexProperty2 = 'lastName';

        // Setup. Table
        @WebDatabase.table(lTableName, {
            with: [{
                properties: [lIndexProperty1, lIndexProperty2]
            }]
        })
        class TestTable {
            @WebDatabase.field({ as: { identity: 'auto' } })
            public id!: number;

            @WebDatabase.field()
            public [lIndexProperty1]!: string;

            @WebDatabase.field()
            public [lIndexProperty2]!: string;
        }

        // Setup. Database.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Process and Evaluation.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTable = pTransaction.table(TestTable);
            const lQuery = lTable.where(`${lIndexProperty1}+${lIndexProperty2}`);
            
            // Verify query is created and is chainable.
            expect(lQuery).toBeDefined();
            expect(typeof lQuery.is).toEqual('function');
            expect(typeof lQuery.between).toEqual('function');
        });

        // Cleanup.
        lWebDatabase.close();
    });
});

