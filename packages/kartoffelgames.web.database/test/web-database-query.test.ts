import { expect } from '@kartoffelgames/core-test';
import 'npm:fake-indexeddb/auto';
import { WebDatabase } from '../source/index.ts';
import { WebDatabaseQuery } from "../source/web_database/query/web-database-query.ts";

// Sanitize disabled because timers are started outside of the test in fake-indexeddb.
Deno.test('WebDatabaseQuery.read()', { sanitizeResources: false, sanitizeOps: false }, async (pContext) => {
    await pContext.step('Single Index - String - Query with is()', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableIndexPropertyName: string = 'propertyOne';
        const lTableIndexValue: string = 'TestValue1';

        // Setup. Create Table definition.
        @WebDatabase.table('TestTable')
        class TestTable {
            @WebDatabase.field({ as: { identity: 'auto' } })
            public id!: number;

            @WebDatabase.field({ as: { index: { unique: true } } })
            public [lTableIndexPropertyName]!: string;

            @WebDatabase.field()
            public propertyTwo!: string;
        }

        // Setup. Create database.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Setup. Create test data.
        await lWebDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);

            const lTestObject1 = new TestTable();
            lTestObject1[lTableIndexPropertyName] = lTableIndexValue;
            lTestObject1.propertyTwo = 'TestValue2';
            await lTestTable.put(lTestObject1);

            const lTestObject2 = new TestTable();
            lTestObject2[lTableIndexPropertyName] = 'NotSearched';
            lTestObject2.propertyTwo = 'TestValue3';
            await lTestTable.put(lTestObject2);
        });

        // Process. Test query.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);
            const lResults = await lTestTable.where(lTableIndexPropertyName).is(lTableIndexValue).read();

            // Evaluation.
            expect(lResults).toHaveLength(1);
            expect(lResults[0][lTableIndexPropertyName]).toBe(lTableIndexValue);
        });

        lWebDatabase.close();
    });

    await pContext.step('Single Index - Number - Query with is()', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableIndexPropertyName: string = 'propertyOne';
        const lTableIndexValue: number = 123;

        // Setup. Create Table definition.
        @WebDatabase.table('TestTable')
        class TestTable {
            @WebDatabase.field({ as: { identity: 'auto' } })
            public id!: number;

            @WebDatabase.field({ as: { index: { unique: true } } })
            public [lTableIndexPropertyName]!: number;

            @WebDatabase.field()
            public propertyTwo!: string;
        }

        // Setup. Create database.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Setup. Create test data.
        await lWebDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);

            const lTestObject1 = new TestTable();
            lTestObject1[lTableIndexPropertyName] = lTableIndexValue;
            lTestObject1.propertyTwo = 'TestValue2';
            await lTestTable.put(lTestObject1);

            const lTestObject2 = new TestTable();
            lTestObject2[lTableIndexPropertyName] = 456;
            lTestObject2.propertyTwo = 'TestValue3';
            await lTestTable.put(lTestObject2);
        });

        // Process. Test query.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);
            const lResults = await lTestTable.where(lTableIndexPropertyName).is(lTableIndexValue).read();

            // Evaluation.
            expect(lResults).toHaveLength(1);
            expect(lResults[0][lTableIndexPropertyName]).toBe(lTableIndexValue);
        });

        lWebDatabase.close();
    });

    await pContext.step('Single Index - Number - Query with between()', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableIndexPropertyName: string = 'propertyOne';
        const lLowerValue: number = 25;
        const lUpperValue: number = 35;

        // Setup. Create Table definition.
        @WebDatabase.table('TestTable')
        class TestTable {
            @WebDatabase.field({ as: { identity: 'auto' } })
            public id!: number;

            @WebDatabase.field({ as: { index: {} } })
            public [lTableIndexPropertyName]!: number;
        }

        // Setup. Create database.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Setup. Create test data.
        await lWebDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);

            const lTestValues: number[] = [20, 30, 40];
            for (const lValue of lTestValues) {
                const lTestObject = new TestTable();
                lTestObject[lTableIndexPropertyName] = lValue;
                await lTestTable.put(lTestObject);
            }
        });

        // Process. Test query.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);
            const lResults = await lTestTable.where(lTableIndexPropertyName).between(lLowerValue, lUpperValue).read();

            // Evaluation.
            expect(lResults).toHaveLength(1);
            expect(lResults[0][lTableIndexPropertyName]).toBe(30);
        });

        lWebDatabase.close();
    });

    await pContext.step('Single Index - Number - Query with greaterThan()', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableIndexPropertyName: string = 'propertyOne';
        const lThresholdValue: number = 25;

        // Setup. Create Table definition.
        @WebDatabase.table('TestTable')
        class TestTable {
            @WebDatabase.field({ as: { identity: 'auto' } })
            public id!: number;

            @WebDatabase.field({ as: { index: {} } })
            public [lTableIndexPropertyName]!: number;
        }

        // Setup. Create database.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Setup. Create test data.
        await lWebDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);

            const lTestValues: number[] = [20, 30, 40];
            for (const lValue of lTestValues) {
                const lTestObject = new TestTable();
                lTestObject[lTableIndexPropertyName] = lValue;
                await lTestTable.put(lTestObject);
            }
        });

        // Process. Test query.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);
            const lResults = await lTestTable.where(lTableIndexPropertyName).greaterThan(lThresholdValue).read();

            // Evaluation.
            expect(lResults).toHaveLength(2);
            expect(lResults.map(r => r[lTableIndexPropertyName]).sort()).toEqual([30, 40]);
        });

        lWebDatabase.close();
    });

    await pContext.step('Single Index - Number - Query with lowerThan()', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableIndexPropertyName: string = 'propertyOne';
        const lThresholdValue: number = 35;

        // Setup. Create Table definition.
        @WebDatabase.table('TestTable')
        class TestTable {
            @WebDatabase.field({ as: { identity: 'auto' } })
            public id!: number;

            @WebDatabase.field({ as: { index: {} } })
            public [lTableIndexPropertyName]!: number;
        }

        // Setup. Create database.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Setup. Create test data.
        await lWebDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);

            const lTestValues: number[] = [20, 30, 40];
            for (const lValue of lTestValues) {
                const lTestObject = new TestTable();
                lTestObject[lTableIndexPropertyName] = lValue;
                await lTestTable.put(lTestObject);
            }
        });

        // Process. Test query.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);
            const lResults = await lTestTable.where(lTableIndexPropertyName).lowerThan(lThresholdValue).read();

            // Evaluation.
            expect(lResults).toHaveLength(2);
            expect(lResults.map(r => r[lTableIndexPropertyName]).sort()).toEqual([20, 30]);
        });

        lWebDatabase.close();
    });

    await pContext.step('Single Index - String - Query with between()', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableIndexPropertyName: string = 'propertyOne';
        const lLowerValue: string = 'TestValue2';
        const lUpperValue: string = 'TestValue4';

        // Setup. Create Table definition.
        @WebDatabase.table('TestTable')
        class TestTable {
            @WebDatabase.field({ as: { identity: 'auto' } })
            public id!: number;

            @WebDatabase.field({ as: { index: {} } })
            public [lTableIndexPropertyName]!: string;
        }

        // Setup. Create database.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Setup. Create test data.
        await lWebDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);

            const lTestValues: string[] = ['TestValue1', 'TestValue3', 'TestValue5'];
            for (const lValue of lTestValues) {
                const lTestObject = new TestTable();
                lTestObject[lTableIndexPropertyName] = lValue;
                await lTestTable.put(lTestObject);
            }
        });

        // Process. Test query.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);
            const lResults = await lTestTable.where(lTableIndexPropertyName).between(lLowerValue, lUpperValue).read();

            // Evaluation.
            expect(lResults).toHaveLength(1);
            expect(lResults[0][lTableIndexPropertyName]).toBe('TestValue3');
        });

        lWebDatabase.close();
    });

    await pContext.step('Single Index - String - Query with greaterThan()', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableIndexPropertyName: string = 'propertyOne';
        const lThresholdValue: string = 'TestValue2';

        // Setup. Create Table definition.
        @WebDatabase.table('TestTable')
        class TestTable {
            @WebDatabase.field({ as: { identity: 'auto' } })
            public id!: number;

            @WebDatabase.field({ as: { index: {} } })
            public [lTableIndexPropertyName]!: string;
        }

        // Setup. Create database.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Setup. Create test data.
        await lWebDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);

            const lTestValues: string[] = ['TestValue1', 'TestValue3', 'TestValue5'];
            for (const lValue of lTestValues) {
                const lTestObject = new TestTable();
                lTestObject[lTableIndexPropertyName] = lValue;
                await lTestTable.put(lTestObject);
            }
        });

        // Process. Test query.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);
            const lResults = await lTestTable.where(lTableIndexPropertyName).greaterThan(lThresholdValue).read();

            // Evaluation.
            expect(lResults).toHaveLength(2);
            expect(lResults.map(r => r[lTableIndexPropertyName]).sort()).toEqual(['TestValue3', 'TestValue5']);
        });

        lWebDatabase.close();
    });

    await pContext.step('Single Index - String - Query with lowerThan()', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableIndexPropertyName: string = 'propertyOne';
        const lThresholdValue: string = 'TestValue4';

        // Setup. Create Table definition.
        @WebDatabase.table('TestTable')
        class TestTable {
            @WebDatabase.field({ as: { identity: 'auto' } })
            public id!: number;

            @WebDatabase.field({ as: { index: {} } })
            public [lTableIndexPropertyName]!: string;
        }

        // Setup. Create database.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Setup. Create test data.
        await lWebDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);

            const lTestValues: string[] = ['TestValue1', 'TestValue3', 'TestValue5'];
            for (const lValue of lTestValues) {
                const lTestObject = new TestTable();
                lTestObject[lTableIndexPropertyName] = lValue;
                await lTestTable.put(lTestObject);
            }
        });

        // Process. Test query.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);
            const lResults = await lTestTable.where(lTableIndexPropertyName).lowerThan(lThresholdValue).read();

            // Evaluation.
            expect(lResults).toHaveLength(2);
            expect(lResults.map(r => r[lTableIndexPropertyName]).sort()).toEqual(['TestValue1', 'TestValue3']);
        });

        lWebDatabase.close();
    });

    await pContext.step('Single Index - Multi-entry - Query with is()', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableIndexPropertyName: string = 'propertyOne';
        const lSearchValue: string = 'TestValue2';

        // Setup. Create Table definition.
        @WebDatabase.table('TestTable')
        class TestTable {
            @WebDatabase.field({ as: { identity: 'auto' } })
            public id!: number;

            @WebDatabase.field({ as: { index: { multiEntry: true } } })
            public [lTableIndexPropertyName]!: Array<string>;
        }

        // Setup. Create database.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Setup. Create test data.
        await lWebDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);

            const lTestObject1 = new TestTable();
            lTestObject1[lTableIndexPropertyName] = ['TestValue1', lSearchValue, 'TestValue3'];
            await lTestTable.put(lTestObject1);

            const lTestObject2 = new TestTable();
            lTestObject2[lTableIndexPropertyName] = ['TestValue4', 'TestValue5'];
            await lTestTable.put(lTestObject2);

            const lTestObject3 = new TestTable();
            lTestObject3[lTableIndexPropertyName] = ['TestValue6', lSearchValue];
            await lTestTable.put(lTestObject3);
        });

        // Process. Test query.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);
            const lResults = await lTestTable.where(lTableIndexPropertyName).is(lSearchValue).read();

            // Evaluation.
            expect(lResults).toHaveLength(2);
            expect(lResults[0][lTableIndexPropertyName]).toContain(lSearchValue);
            expect(lResults[1][lTableIndexPropertyName]).toContain(lSearchValue);
        });

        lWebDatabase.close();
    });

    await pContext.step('Single Index - Multi-entry - Query with between()', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableIndexPropertyName: string = 'propertyOne';
        const lLowerValue: string = 'TestValue1';
        const lUpperValue: string = 'TestValue4';

        // Setup. Create Table definition.
        @WebDatabase.table('TestTable')
        class TestTable {
            @WebDatabase.field({ as: { identity: 'auto' } })
            public id!: number;

            @WebDatabase.field({ as: { index: { multiEntry: true } } })
            public [lTableIndexPropertyName]!: Array<string>;
        }

        // Setup. Create database.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Setup. Create test data.
        await lWebDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);

            const lTestObject1 = new TestTable();
            lTestObject1[lTableIndexPropertyName] = ['TestValue1', 'TestValue3'];
            await lTestTable.put(lTestObject1);

            const lTestObject2 = new TestTable();
            lTestObject2[lTableIndexPropertyName] = ['TestValue5', 'TestValue6'];
            await lTestTable.put(lTestObject2);

            const lTestObject3 = new TestTable();
            lTestObject3[lTableIndexPropertyName] = ['TestValue2', 'TestValue7'];
            await lTestTable.put(lTestObject3);
        });

        // Process. Test query.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);
            const lResults = await lTestTable.where(lTableIndexPropertyName).between(lLowerValue, lUpperValue).read();

            // Evaluation.
            expect(lResults).toHaveLength(2);
            const lFoundValues: string[] = lResults.flatMap(r => r[lTableIndexPropertyName] as string[]).filter((v: string) => v >= lLowerValue && v <= lUpperValue);
            expect(lFoundValues).toContain('TestValue2');
            expect(lFoundValues).toContain('TestValue3');
        });

        lWebDatabase.close();
    });

    await pContext.step('Compound Index - Query with is() on both properties', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableIndexPropertyOneName: string = 'propertyOne';
        const lTableIndexPropertyTwoName: string = 'propertyTwo';
        const lSearchValueOne: string = 'TestValue1';
        const lSearchValueTwo: string = 'TestValue2';

        // Setup. Create Table definition.
        @WebDatabase.table('TestTable', {
            with: [{
                properties: [lTableIndexPropertyOneName, lTableIndexPropertyTwoName],
                unique: false
            }]
        })
        class TestTable {
            @WebDatabase.field({ as: { identity: 'auto' } })
            public id!: number;

            @WebDatabase.field()
            public [lTableIndexPropertyOneName]!: string;

            @WebDatabase.field()
            public [lTableIndexPropertyTwoName]!: string;
        }

        // Setup. Create database.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Setup. Create test data.
        await lWebDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);

            const lTestObject1 = new TestTable();
            lTestObject1[lTableIndexPropertyOneName] = lSearchValueOne;
            lTestObject1[lTableIndexPropertyTwoName] = lSearchValueTwo;
            await lTestTable.put(lTestObject1);

            const lTestObject2 = new TestTable();
            lTestObject2[lTableIndexPropertyOneName] = lSearchValueOne;
            lTestObject2[lTableIndexPropertyTwoName] = 'DifferentValue';
            await lTestTable.put(lTestObject2);
        });

        // Process. Test query.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);
            const lResults = await lTestTable
                .where(lTableIndexPropertyOneName).is(lSearchValueOne)
                .and(lTableIndexPropertyTwoName).is(lSearchValueTwo)
                .read();

            // Evaluation.
            expect(lResults).toHaveLength(1);
            expect(lResults[0][lTableIndexPropertyOneName]).toBe(lSearchValueOne);
            expect(lResults[0][lTableIndexPropertyTwoName]).toBe(lSearchValueTwo);
        });

        lWebDatabase.close();
    });

    await pContext.step('Identity - Query with is() on identity property', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableIdentityPropertyName: string = 'propertyOne';
        const lSearchValue: string = 'TestIdentity1';

        // Setup. Create Table definition.
        @WebDatabase.table('TestTable')
        class TestTable {
            @WebDatabase.field({ as: { identity: 'manual' } })
            public [lTableIdentityPropertyName]!: string;

            @WebDatabase.field()
            public propertyTwo!: string;
        }

        // Setup. Create database.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Setup. Create test data.
        await lWebDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);

            const lTestObject1 = new TestTable();
            lTestObject1[lTableIdentityPropertyName] = lSearchValue;
            lTestObject1.propertyTwo = 'TestValue2';
            await lTestTable.put(lTestObject1);

            const lTestObject2 = new TestTable();
            lTestObject2[lTableIdentityPropertyName] = 'DifferentIdentity';
            lTestObject2.propertyTwo = 'TestValue3';
            await lTestTable.put(lTestObject2);
        });

        // Process. Test query.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);
            const lResults = await lTestTable.where(lTableIdentityPropertyName).is(lSearchValue).read();

            // Evaluation.
            expect(lResults).toHaveLength(1);
            expect(lResults[0][lTableIdentityPropertyName]).toBe(lSearchValue);
        });

        lWebDatabase.close();
    });

    await pContext.step('Query without OR - Single condition', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableIndexPropertyName: string = 'propertyOne';
        const lSearchValue: string = 'TestValue1';

        // Setup. Create Table definition.
        @WebDatabase.table('TestTable')
        class TestTable {
            @WebDatabase.field({ as: { identity: 'auto' } })
            public id!: number;

            @WebDatabase.field({ as: { index: {} } })
            public [lTableIndexPropertyName]!: string;
        }

        // Setup. Create database.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Setup. Create test data.
        await lWebDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);

            const lTestValues: string[] = [lSearchValue, 'TestValue2', 'TestValue3'];
            for (const lValue of lTestValues) {
                const lTestObject = new TestTable();
                lTestObject[lTableIndexPropertyName] = lValue;
                await lTestTable.put(lTestObject);
            }
        });

        // Process. Test query.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);
            const lResults = await lTestTable.where(lTableIndexPropertyName).is(lSearchValue).read();

            // Evaluation.
            expect(lResults).toHaveLength(1);
            expect(lResults[0][lTableIndexPropertyName]).toBe(lSearchValue);
        });

        lWebDatabase.close();
    });

    await pContext.step('Query with one OR - Two conditions', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableIndexPropertyName: string = 'propertyOne';
        const lSearchValueOne: string = 'TestValue1';
        const lSearchValueTwo: string = 'TestValue2';

        // Setup. Create Table definition.
        @WebDatabase.table('TestTable')
        class TestTable {
            @WebDatabase.field({ as: { identity: 'auto' } })
            public id!: number;

            @WebDatabase.field({ as: { index: {} } })
            public [lTableIndexPropertyName]!: string;
        }

        // Setup. Create database.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Setup. Create test data.
        await lWebDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);

            const lTestValues: string[] = [lSearchValueOne, lSearchValueTwo, 'TestValue3'];
            for (const lValue of lTestValues) {
                const lTestObject = new TestTable();
                lTestObject[lTableIndexPropertyName] = lValue;
                await lTestTable.put(lTestObject);
            }
        });

        // Process. Test query.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);
            const lResults = await lTestTable
                .where(lTableIndexPropertyName).is(lSearchValueOne)
                .or(lTableIndexPropertyName).is(lSearchValueTwo)
                .read();

            // Evaluation.
            expect(lResults).toHaveLength(2);
            const lResultValues = lResults.map(r => r[lTableIndexPropertyName]).sort();
            expect(lResultValues).toEqual([lSearchValueOne, lSearchValueTwo]);
        });

        lWebDatabase.close();
    });

    await pContext.step('Query with two ORs - Three conditions', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableIndexPropertyName: string = 'propertyOne';
        const lSearchValueOne: string = 'TestValue1';
        const lSearchValueTwo: string = 'TestValue2';
        const lSearchValueThree: string = 'TestValue3';

        // Setup. Create Table definition.
        @WebDatabase.table('TestTable')
        class TestTable {
            @WebDatabase.field({ as: { identity: 'auto' } })
            public id!: number;

            @WebDatabase.field({ as: { index: {} } })
            public [lTableIndexPropertyName]!: string;
        }

        // Setup. Create database.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Setup. Create test data.
        await lWebDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);

            const lTestValues: string[] = [lSearchValueOne, lSearchValueTwo, lSearchValueThree, 'TestValue4'];
            for (const lValue of lTestValues) {
                const lTestObject = new TestTable();
                lTestObject[lTableIndexPropertyName] = lValue;
                await lTestTable.put(lTestObject);
            }
        });

        // Process. Test query.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);
            const lResults = await lTestTable
                .where(lTableIndexPropertyName).is(lSearchValueOne)
                .or(lTableIndexPropertyName).is(lSearchValueTwo)
                .or(lTableIndexPropertyName).is(lSearchValueThree)
                .read();

            // Evaluation.
            expect(lResults).toHaveLength(3);
            const lResultValues = lResults.map(r => r[lTableIndexPropertyName]).sort();
            expect(lResultValues).toEqual([lSearchValueOne, lSearchValueTwo, lSearchValueThree]);
        });

        lWebDatabase.close();
    });

    await pContext.step('Error: No indexable key range for block found - Single index that does not exist', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTablePropertyName: string = 'propertyOne';
        const lSearchValue: string = 'TestValue1';

        // Setup. Create Table definition.
        @WebDatabase.table('TestTable')
        class TestTable {
            @WebDatabase.field({ as: { identity: 'auto' } })
            public id!: number;

            @WebDatabase.field()
            public [lTablePropertyName]!: string;
        }

        // Setup. Create database.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Process. Test query.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);

            const lFailingFunction = async () => {
                await lTestTable.where(lTablePropertyName).is(lSearchValue).read();
            };

            // Evaluation.
            await expect(lFailingFunction()).rejects.toThrow('No indexable key range for block found.');
        });

        lWebDatabase.close();
    });

    await pContext.step('Error: No indexable key range for block found - Compound index that does not exist', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTablePropertyOneName: string = 'propertyOne';
        const lTablePropertyTwoName: string = 'propertyTwo';
        const lSearchValueOne: string = 'TestValue1';
        const lSearchValueTwo: string = 'TestValue2';

        // Setup. Create Table definition.
        @WebDatabase.table('TestTable')
        class TestTable {
            @WebDatabase.field({ as: { identity: 'auto' } })
            public id!: number;

            @WebDatabase.field({ as: { index: {} } })
            public [lTablePropertyOneName]!: string;

            @WebDatabase.field({ as: { index: {} } })
            public [lTablePropertyTwoName]!: string;
        }

        // Setup. Create database.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Process. Test query.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);

            const lFailingFunction = async () => {
                await lTestTable
                    .where(lTablePropertyOneName).is(lSearchValueOne)
                    .and(lTablePropertyTwoName).is(lSearchValueTwo)
                    .read();
            };

            // Evaluation.
            await expect(lFailingFunction()).rejects.toThrow('No indexable key range for block found.');
        });

        lWebDatabase.close();
    });

    await pContext.step('Error: No queries specified', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);

        // Setup. Create Table definition.
        @WebDatabase.table('TestTable')
        class TestTable {
            @WebDatabase.field({ as: { identity: 'auto' } })
            public id!: number;
        }

        // Setup. Create database.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Process. Test query.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);

            const lFailingFunction = async () => {
                // Create query but don't specify any actions
                const lQueryInstance = new WebDatabaseQuery<typeof TestTable>(lTestTable);
                await lQueryInstance.read();
            };

            // Evaluation.
            await expect(lFailingFunction()).rejects.toThrow('No queries specified.');
        });

        lWebDatabase.close();
    });
});

Deno.test('WebDatabaseQuery.delete()', { sanitizeResources: false, sanitizeOps: false }, async (pContext) => {
    await pContext.step('Single Index - String - Delete with is()', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableIndexPropertyName: string = 'propertyOne';
        const lDeleteValue: string = 'TestValue1';

        // Setup. Create Table definition.
        @WebDatabase.table('TestTable')
        class TestTable {
            @WebDatabase.field({ as: { identity: 'auto' } })
            public id!: number;

            @WebDatabase.field({ as: { index: {} } })
            public [lTableIndexPropertyName]!: string;
        }

        // Setup. Create database.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Setup. Create test data.
        await lWebDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);

            const lTestValues: string[] = [lDeleteValue, 'TestValue2', 'TestValue3'];
            for (const lValue of lTestValues) {
                const lTestObject = new TestTable();
                lTestObject[lTableIndexPropertyName] = lValue;
                await lTestTable.put(lTestObject);
            }
        });

        // Process. Test delete.
        await lWebDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);
            await lTestTable.where(lTableIndexPropertyName).is(lDeleteValue).delete();
        });

        // Evaluation.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);
            const lResults = await lTestTable.getAll();

            expect(lResults).toHaveLength(2);
            expect(lResults.map(r => r[lTableIndexPropertyName])).not.toContain(lDeleteValue);
        });

        lWebDatabase.close();
    });

    await pContext.step('Single Index - Number - Delete with is()', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableIndexPropertyName: string = 'propertyOne';
        const lDeleteValue: number = 123;

        // Setup. Create Table definition.
        @WebDatabase.table('TestTable')
        class TestTable {
            @WebDatabase.field({ as: { identity: 'auto' } })
            public id!: number;

            @WebDatabase.field({ as: { index: {} } })
            public [lTableIndexPropertyName]!: number;
        }

        // Setup. Create database.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Setup. Create test data.
        await lWebDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);

            const lTestValues: number[] = [lDeleteValue, 456, 789];
            for (const lValue of lTestValues) {
                const lTestObject = new TestTable();
                lTestObject[lTableIndexPropertyName] = lValue;
                await lTestTable.put(lTestObject);
            }
        });

        // Process. Test delete.
        await lWebDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);
            await lTestTable.where(lTableIndexPropertyName).is(lDeleteValue).delete();
        });

        // Evaluation.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);
            const lResults = await lTestTable.getAll();

            expect(lResults).toHaveLength(2);
            expect(lResults.map(r => r[lTableIndexPropertyName])).not.toContain(lDeleteValue);
        });

        lWebDatabase.close();
    });

    await pContext.step('Single Index - String - Delete with between()', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableIndexPropertyName: string = 'propertyOne';
        const lLowerValue: string = 'TestValue2';
        const lUpperValue: string = 'TestValue4';

        // Setup. Create Table definition.
        @WebDatabase.table('TestTable')
        class TestTable {
            @WebDatabase.field({ as: { identity: 'auto' } })
            public id!: number;

            @WebDatabase.field({ as: { index: {} } })
            public [lTableIndexPropertyName]!: string;
        }

        // Setup. Create database.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Setup. Create test data.
        await lWebDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);

            const lTestValues: string[] = ['TestValue1', 'TestValue3', 'TestValue5'];
            for (const lValue of lTestValues) {
                const lTestObject = new TestTable();
                lTestObject[lTableIndexPropertyName] = lValue;
                await lTestTable.put(lTestObject);
            }
        });

        // Process. Test delete.
        await lWebDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);
            await lTestTable.where(lTableIndexPropertyName).between(lLowerValue, lUpperValue).delete();
        });

        // Evaluation.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);
            const lResults = await lTestTable.getAll();

            expect(lResults).toHaveLength(2);
            expect(lResults.map(r => r[lTableIndexPropertyName]).sort()).toEqual(['TestValue1', 'TestValue5']);
        });

        lWebDatabase.close();
    });

    await pContext.step('Single Index - Number - Delete with between()', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableIndexPropertyName: string = 'propertyOne';
        const lLowerValue: number = 25;
        const lUpperValue: number = 35;

        // Setup. Create Table definition.
        @WebDatabase.table('TestTable')
        class TestTable {
            @WebDatabase.field({ as: { identity: 'auto' } })
            public id!: number;

            @WebDatabase.field({ as: { index: {} } })
            public [lTableIndexPropertyName]!: number;
        }

        // Setup. Create database.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Setup. Create test data.
        await lWebDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);

            const lTestValues: number[] = [20, 30, 40];
            for (const lValue of lTestValues) {
                const lTestObject = new TestTable();
                lTestObject[lTableIndexPropertyName] = lValue;
                await lTestTable.put(lTestObject);
            }
        });

        // Process. Test delete.
        await lWebDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);
            await lTestTable.where(lTableIndexPropertyName).between(lLowerValue, lUpperValue).delete();
        });

        // Evaluation.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);
            const lResults = await lTestTable.getAll();

            expect(lResults).toHaveLength(2);
            expect(lResults.map(r => r[lTableIndexPropertyName]).sort()).toEqual([20, 40]);
        });

        lWebDatabase.close();
    });

    await pContext.step('Single Index - Number - Delete with greaterThan()', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableIndexPropertyName: string = 'propertyOne';
        const lThresholdValue: number = 25;

        // Setup. Create Table definition.
        @WebDatabase.table('TestTable')
        class TestTable {
            @WebDatabase.field({ as: { identity: 'auto' } })
            public id!: number;

            @WebDatabase.field({ as: { index: {} } })
            public [lTableIndexPropertyName]!: number;
        }

        // Setup. Create database.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Setup. Create test data.
        await lWebDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);

            const lTestValues: number[] = [20, 30, 40];
            for (const lValue of lTestValues) {
                const lTestObject = new TestTable();
                lTestObject[lTableIndexPropertyName] = lValue;
                await lTestTable.put(lTestObject);
            }
        });

        // Process. Test delete.
        await lWebDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);
            await lTestTable.where(lTableIndexPropertyName).greaterThan(lThresholdValue).delete();
        });

        // Evaluation.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);
            const lResults = await lTestTable.getAll();

            expect(lResults).toHaveLength(1);
            expect(lResults[0][lTableIndexPropertyName]).toBe(20);
        });

        lWebDatabase.close();
    });

    await pContext.step('Single Index - Number - Delete with lowerThan()', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableIndexPropertyName: string = 'propertyOne';
        const lThresholdValue: number = 35;

        // Setup. Create Table definition.
        @WebDatabase.table('TestTable')
        class TestTable {
            @WebDatabase.field({ as: { identity: 'auto' } })
            public id!: number;

            @WebDatabase.field({ as: { index: {} } })
            public [lTableIndexPropertyName]!: number;
        }

        // Setup. Create database.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Setup. Create test data.
        await lWebDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);

            const lTestValues: number[] = [20, 30, 40];
            for (const lValue of lTestValues) {
                const lTestObject = new TestTable();
                lTestObject[lTableIndexPropertyName] = lValue;
                await lTestTable.put(lTestObject);
            }
        });

        // Process. Test delete.
        await lWebDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);
            await lTestTable.where(lTableIndexPropertyName).lowerThan(lThresholdValue).delete();
        });

        // Evaluation.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);
            const lResults = await lTestTable.getAll();

            expect(lResults).toHaveLength(1);
            expect(lResults[0][lTableIndexPropertyName]).toBe(40);
        });

        lWebDatabase.close();
    });

    await pContext.step('Single Index - String - Delete with greaterThan()', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableIndexPropertyName: string = 'propertyOne';
        const lThresholdValue: string = 'TestValue2';

        // Setup. Create Table definition.
        @WebDatabase.table('TestTable')
        class TestTable {
            @WebDatabase.field({ as: { identity: 'auto' } })
            public id!: number;

            @WebDatabase.field({ as: { index: {} } })
            public [lTableIndexPropertyName]!: string;
        }

        // Setup. Create database.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Setup. Create test data.
        await lWebDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);

            const lTestValues: string[] = ['TestValue1', 'TestValue3', 'TestValue5'];
            for (const lValue of lTestValues) {
                const lTestObject = new TestTable();
                lTestObject[lTableIndexPropertyName] = lValue;
                await lTestTable.put(lTestObject);
            }
        });

        // Process. Test delete.
        await lWebDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);
            await lTestTable.where(lTableIndexPropertyName).greaterThan(lThresholdValue).delete();
        });

        // Evaluation.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);
            const lResults = await lTestTable.getAll();

            expect(lResults).toHaveLength(1);
            expect(lResults[0][lTableIndexPropertyName]).toBe('TestValue1');
        });

        lWebDatabase.close();
    });

    await pContext.step('Single Index - String - Delete with lowerThan()', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableIndexPropertyName: string = 'propertyOne';
        const lThresholdValue: string = 'TestValue4';

        // Setup. Create Table definition.
        @WebDatabase.table('TestTable')
        class TestTable {
            @WebDatabase.field({ as: { identity: 'auto' } })
            public id!: number;

            @WebDatabase.field({ as: { index: {} } })
            public [lTableIndexPropertyName]!: string;
        }

        // Setup. Create database.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Setup. Create test data.
        await lWebDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);

            const lTestValues: string[] = ['TestValue1', 'TestValue3', 'TestValue5'];
            for (const lValue of lTestValues) {
                const lTestObject = new TestTable();
                lTestObject[lTableIndexPropertyName] = lValue;
                await lTestTable.put(lTestObject);
            }
        });

        // Process. Test delete.
        await lWebDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);
            await lTestTable.where(lTableIndexPropertyName).lowerThan(lThresholdValue).delete();
        });

        // Evaluation.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);
            const lResults = await lTestTable.getAll();

            expect(lResults).toHaveLength(1);
            expect(lResults[0][lTableIndexPropertyName]).toBe('TestValue5');
        });

        lWebDatabase.close();
    });

    await pContext.step('Single Index - Multi-entry - Delete with is()', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableIndexPropertyName: string = 'propertyOne';
        const lDeleteValue: string = 'TestValue2';

        // Setup. Create Table definition.
        @WebDatabase.table('TestTable')
        class TestTable {
            @WebDatabase.field({ as: { identity: 'auto' } })
            public id!: number;

            @WebDatabase.field({ as: { index: { multiEntry: true } } })
            public [lTableIndexPropertyName]!: Array<string>;
        }

        // Setup. Create database.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Setup. Create test data.
        await lWebDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);

            const lTestObject1 = new TestTable();
            lTestObject1[lTableIndexPropertyName] = ['TestValue1', lDeleteValue, 'TestValue3'];
            await lTestTable.put(lTestObject1);

            const lTestObject2 = new TestTable();
            lTestObject2[lTableIndexPropertyName] = ['TestValue4', 'TestValue5'];
            await lTestTable.put(lTestObject2);

            const lTestObject3 = new TestTable();
            lTestObject3[lTableIndexPropertyName] = ['TestValue6', lDeleteValue];
            await lTestTable.put(lTestObject3);
        });

        // Process. Test delete.
        await lWebDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);
            await lTestTable.where(lTableIndexPropertyName).is(lDeleteValue).delete();
        });

        // Evaluation.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);
            const lResults = await lTestTable.getAll();

            expect(lResults).toHaveLength(1);
            expect(lResults[0][lTableIndexPropertyName]).not.toContain(lDeleteValue);
            expect(lResults[0][lTableIndexPropertyName]).toEqual(['TestValue4', 'TestValue5']);
        });

        lWebDatabase.close();
    });

    await pContext.step('Single Index - Multi-entry - Delete with between()', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableIndexPropertyName: string = 'propertyOne';
        const lLowerValue: string = 'TestValue1';
        const lUpperValue: string = 'TestValue5';

        // Setup. Create Table definition.
        @WebDatabase.table('TestTable')
        class TestTable {
            @WebDatabase.field({ as: { identity: 'auto' } })
            public id!: number;

            @WebDatabase.field({ as: { index: { multiEntry: true } } })
            public [lTableIndexPropertyName]!: Array<string>;
        }

        // Setup. Create database.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Setup. Create test data.
        await lWebDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);

            const lTestObject1 = new TestTable();
            lTestObject1[lTableIndexPropertyName] = ['TestValue1', 'TestValue3'];
            await lTestTable.put(lTestObject1);

            const lTestObject2 = new TestTable();
            lTestObject2[lTableIndexPropertyName] = ['TestValue5', 'TestValue6'];
            await lTestTable.put(lTestObject2);

            const lTestObject3 = new TestTable();
            lTestObject3[lTableIndexPropertyName] = ['TestValue2', 'TestValue7'];
            await lTestTable.put(lTestObject3);
        });

        // Process. Test delete.
        await lWebDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);
            await lTestTable.where(lTableIndexPropertyName).between(lLowerValue, lUpperValue).delete();
        });

        // Evaluation.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);
            const lResults = await lTestTable.getAll();

            expect(lResults).toHaveLength(1);
            expect(lResults[0][lTableIndexPropertyName]).toEqual(['TestValue5', 'TestValue6']);
        });

        lWebDatabase.close();
    });

    await pContext.step('Compound Index - Delete with is() on both properties', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableIndexPropertyOneName: string = 'propertyOne';
        const lTableIndexPropertyTwoName: string = 'propertyTwo';
        const lDeleteValueOne: string = 'TestValue1';
        const lDeleteValueTwo: string = 'TestValue2';

        // Setup. Create Table definition.
        @WebDatabase.table('TestTable', {
            with: [{
                properties: [lTableIndexPropertyOneName, lTableIndexPropertyTwoName],
                unique: false
            }]
        })
        class TestTable {
            @WebDatabase.field({ as: { identity: 'auto' } })
            public id!: number;

            @WebDatabase.field()
            public [lTableIndexPropertyOneName]!: string;

            @WebDatabase.field()
            public [lTableIndexPropertyTwoName]!: string;
        }

        // Setup. Create database.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Setup. Create test data.
        await lWebDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);

            const lTestObject1 = new TestTable();
            lTestObject1[lTableIndexPropertyOneName] = lDeleteValueOne;
            lTestObject1[lTableIndexPropertyTwoName] = lDeleteValueTwo;
            await lTestTable.put(lTestObject1);

            const lTestObject2 = new TestTable();
            lTestObject2[lTableIndexPropertyOneName] = lDeleteValueOne;
            lTestObject2[lTableIndexPropertyTwoName] = 'DifferentValue';
            await lTestTable.put(lTestObject2);
        });

        // Process. Test delete.
        await lWebDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);
            await lTestTable
                .where(lTableIndexPropertyOneName).is(lDeleteValueOne)
                .and(lTableIndexPropertyTwoName).is(lDeleteValueTwo)
                .delete();
        });

        // Evaluation.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);
            const lResults = await lTestTable.getAll();

            expect(lResults).toHaveLength(1);
            expect(lResults[0][lTableIndexPropertyTwoName]).toBe('DifferentValue');
        });

        lWebDatabase.close();
    });

    await pContext.step('Identity - Delete with is() on identity property', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableIdentityPropertyName: string = 'propertyOne';
        const lDeleteValue: string = 'TestIdentity1';

        // Setup. Create Table definition.
        @WebDatabase.table('TestTable')
        class TestTable {
            @WebDatabase.field({ as: { identity: 'manual' } })
            public [lTableIdentityPropertyName]!: string;

            @WebDatabase.field()
            public propertyTwo!: string;
        }

        // Setup. Create database.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Setup. Create test data.
        await lWebDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);

            const lTestObject1 = new TestTable();
            lTestObject1[lTableIdentityPropertyName] = lDeleteValue;
            lTestObject1.propertyTwo = 'TestValue2';
            await lTestTable.put(lTestObject1);

            const lTestObject2 = new TestTable();
            lTestObject2[lTableIdentityPropertyName] = 'DifferentIdentity';
            lTestObject2.propertyTwo = 'TestValue3';
            await lTestTable.put(lTestObject2);
        });

        // Process. Test delete.
        await lWebDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);
            await lTestTable.where(lTableIdentityPropertyName).is(lDeleteValue).delete();
        });

        // Evaluation.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);
            const lResults = await lTestTable.getAll();

            expect(lResults).toHaveLength(1);
            expect(lResults[0][lTableIdentityPropertyName]).toBe('DifferentIdentity');
        });

        lWebDatabase.close();
    });

    await pContext.step('Delete without OR - Single condition', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableIndexPropertyName: string = 'propertyOne';
        const lDeleteValue: string = 'TestValue1';

        // Setup. Create Table definition.
        @WebDatabase.table('TestTable')
        class TestTable {
            @WebDatabase.field({ as: { identity: 'auto' } })
            public id!: number;

            @WebDatabase.field({ as: { index: {} } })
            public [lTableIndexPropertyName]!: string;
        }

        // Setup. Create database.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Setup. Create test data.
        await lWebDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);

            const lTestValues: string[] = [lDeleteValue, 'TestValue2', 'TestValue3'];
            for (const lValue of lTestValues) {
                const lTestObject = new TestTable();
                lTestObject[lTableIndexPropertyName] = lValue;
                await lTestTable.put(lTestObject);
            }
        });

        // Process. Test delete.
        await lWebDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);
            await lTestTable.where(lTableIndexPropertyName).is(lDeleteValue).delete();
        });

        // Evaluation.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);
            const lResults = await lTestTable.getAll();

            expect(lResults).toHaveLength(2);
            expect(lResults.map(r => r[lTableIndexPropertyName])).not.toContain(lDeleteValue);
        });

        lWebDatabase.close();
    });

    await pContext.step('Delete with one OR - Two conditions', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableIndexPropertyName: string = 'propertyOne';
        const lDeleteValueOne: string = 'TestValue1';
        const lDeleteValueTwo: string = 'TestValue2';

        // Setup. Create Table definition.
        @WebDatabase.table('TestTable')
        class TestTable {
            @WebDatabase.field({ as: { identity: 'auto' } })
            public id!: number;

            @WebDatabase.field({ as: { index: {} } })
            public [lTableIndexPropertyName]!: string;
        }

        // Setup. Create database.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Setup. Create test data.
        await lWebDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);

            const lTestValues: string[] = [lDeleteValueOne, lDeleteValueTwo, 'TestValue3'];
            for (const lValue of lTestValues) {
                const lTestObject = new TestTable();
                lTestObject[lTableIndexPropertyName] = lValue;
                await lTestTable.put(lTestObject);
            }
        });

        // Process. Test delete.
        await lWebDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);
            await lTestTable
                .where(lTableIndexPropertyName).is(lDeleteValueOne)
                .or(lTableIndexPropertyName).is(lDeleteValueTwo)
                .delete();
        });

        // Evaluation.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);
            const lResults = await lTestTable.getAll();

            expect(lResults).toHaveLength(1);
            expect(lResults[0][lTableIndexPropertyName]).toBe('TestValue3');
        });

        lWebDatabase.close();
    });

    await pContext.step('Delete with two ORs - Three conditions', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTableIndexPropertyName: string = 'propertyOne';
        const lDeleteValueOne: string = 'TestValue1';
        const lDeleteValueTwo: string = 'TestValue2';
        const lDeleteValueThree: string = 'TestValue3';

        // Setup. Create Table definition.
        @WebDatabase.table('TestTable')
        class TestTable {
            @WebDatabase.field({ as: { identity: 'auto' } })
            public id!: number;

            @WebDatabase.field({ as: { index: {} } })
            public [lTableIndexPropertyName]!: string;
        }

        // Setup. Create database.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Setup. Create test data.
        await lWebDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);

            const lTestValues: string[] = [lDeleteValueOne, lDeleteValueTwo, lDeleteValueThree, 'TestValue4'];
            for (const lValue of lTestValues) {
                const lTestObject = new TestTable();
                lTestObject[lTableIndexPropertyName] = lValue;
                await lTestTable.put(lTestObject);
            }
        });

        // Process. Test delete.
        await lWebDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);
            await lTestTable
                .where(lTableIndexPropertyName).is(lDeleteValueOne)
                .or(lTableIndexPropertyName).is(lDeleteValueTwo)
                .or(lTableIndexPropertyName).is(lDeleteValueThree)
                .delete();
        });

        // Evaluation.
        await lWebDatabase.transaction([TestTable], 'readonly', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);
            const lResults = await lTestTable.getAll();

            expect(lResults).toHaveLength(1);
            expect(lResults[0][lTableIndexPropertyName]).toBe('TestValue4');
        });

        lWebDatabase.close();
    });

    await pContext.step('Error: No indexable key range for block found - Single index that does not exist', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTablePropertyName: string = 'propertyOne';
        const lDeleteValue: string = 'TestValue1';

        // Setup. Create Table definition.
        @WebDatabase.table('TestTable')
        class TestTable {
            @WebDatabase.field({ as: { identity: 'auto' } })
            public id!: number;

            @WebDatabase.field()
            public [lTablePropertyName]!: string;
        }

        // Setup. Create database.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Process. Test delete.
        await lWebDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);

            const lFailingFunction = async () => {
                await lTestTable.where(lTablePropertyName).is(lDeleteValue).delete();
            };

            // Evaluation.
            await expect(lFailingFunction()).rejects.toThrow('No indexable key range for block found.');
        });

        lWebDatabase.close();
    });

    await pContext.step('Error: No indexable key range for block found - Compound index that does not exist', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lTablePropertyOneName: string = 'propertyOne';
        const lTablePropertyTwoName: string = 'propertyTwo';
        const lDeleteValueOne: string = 'TestValue1';
        const lDeleteValueTwo: string = 'TestValue2';

        // Setup. Create Table definition.
        @WebDatabase.table('TestTable')
        class TestTable {
            @WebDatabase.field({ as: { identity: 'auto' } })
            public id!: number;

            @WebDatabase.field({ as: { index: {} } })
            public [lTablePropertyOneName]!: string;

            @WebDatabase.field({ as: { index: {} } })
            public [lTablePropertyTwoName]!: string;
        }

        // Setup. Create database.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Process. Test delete.
        await lWebDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);

            const lFailingFunction = async () => {
                await lTestTable
                    .where(lTablePropertyOneName).is(lDeleteValueOne)
                    .and(lTablePropertyTwoName).is(lDeleteValueTwo)
                    .delete();
            };

            // Evaluation.
            await expect(lFailingFunction()).rejects.toThrow('No indexable key range for block found.');
        });

        lWebDatabase.close();
    });

    await pContext.step('Error: No queries specified', async () => {
        // Setup. Table configuration.
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);

        // Setup. Create Table definition.
        @WebDatabase.table('TestTable')
        class TestTable {
            @WebDatabase.field({ as: { identity: 'auto' } })
            public id!: number;
        }

        // Setup. Create database.
        const lWebDatabase = new WebDatabase(lDatabaseName, [TestTable]);

        // Process. Test delete.
        await lWebDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
            const lTestTable = pTransaction.table(TestTable);

            const lFailingFunction = async () => {
                // Create query but don't specify any actions
                const lQueryInstance = new WebDatabaseQuery<typeof TestTable>(lTestTable);
                await lQueryInstance.delete();
            };

            // Evaluation.
            await expect(lFailingFunction()).rejects.toThrow('No queries specified.');
        });

        lWebDatabase.close();
    });
});

