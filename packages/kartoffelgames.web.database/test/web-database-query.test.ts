import { expect } from '@kartoffelgames/core-test';
import 'npm:fake-indexeddb/auto';
import { WebDatabase } from '../source/index.ts';

// Test classes for different scenarios
@WebDatabase.table('Users')
class User {
    @WebDatabase.field({ as: { identity: 'auto' } })
    public id!: number;

    @WebDatabase.field({ as: { index: { unique: true } } })
    public email!: string;

    @WebDatabase.field({ as: { index: {} } })
    public age!: number;

    @WebDatabase.field()
    public name!: string;
}

@WebDatabase.table('Products', {
    with: [
        { properties: ['category', 'brand'], unique: false },
        { properties: ['category', 'price'], unique: false }
    ]
})
class Product {
    @WebDatabase.field({ as: { identity: 'auto' } })
    public id!: number;

    @WebDatabase.field()
    public category!: string;

    @WebDatabase.field()
    public brand!: string;

    @WebDatabase.field()
    public price!: number;

    @WebDatabase.field()
    public name!: string;
}

@WebDatabase.table('Orders')
class Order {
    @WebDatabase.field({ as: { identity: 'manual' } })
    public orderId!: string;

    @WebDatabase.field({ as: { index: {} } })
    public customerId!: number;

    @WebDatabase.field({ as: { index: {} } })
    public status!: string;

    @WebDatabase.field()
    public total!: number;
}

// Sanitize disabled because timers are started outside of the test in fake-indexeddb.
Deno.test('WebDatabaseQuery.read()', { sanitizeResources: false, sanitizeOps: false }, async (pContext) => {
    await pContext.step('Single index query with exact match using is()', async () => {
        // Setup
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lWebDatabase = new WebDatabase(lDatabaseName, [User]);

        // Create test data
        await lWebDatabase.transaction([User], 'readwrite', async (pTransaction) => {
            const lUserTable = pTransaction.table(User);
            
            const lUser1 = new User();
            lUser1.email = 'john@example.com';
            lUser1.age = 25;
            lUser1.name = 'John Doe';
            await lUserTable.put(lUser1);

            const lUser2 = new User();
            lUser2.email = 'jane@example.com';
            lUser2.age = 30;
            lUser2.name = 'Jane Smith';
            await lUserTable.put(lUser2);
        });

        // Test query
        await lWebDatabase.transaction([User], 'readonly', async (pTransaction) => {
            const lUserTable = pTransaction.table(User);
            const lResults = await lUserTable.where('email').is('john@example.com').read();
            
            expect(lResults).toHaveLength(1);
            expect(lResults[0].email).toBe('john@example.com');
            expect(lResults[0].name).toBe('John Doe');
        });

        lWebDatabase.close();
    });

    await pContext.step('Single index query with range using between()', async () => {
        // Setup
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lWebDatabase = new WebDatabase(lDatabaseName, [User]);

        // Create test data
        await lWebDatabase.transaction([User], 'readwrite', async (pTransaction) => {
            const lUserTable = pTransaction.table(User);
            
            const lAges = [20, 25, 30, 35, 40];
            for (let i = 0; i < lAges.length; i++) {
                const lUser = new User();
                lUser.email = `user${i}@example.com`;
                lUser.age = lAges[i];
                lUser.name = `User ${i}`;
                await lUserTable.put(lUser);
            }
        });

        // Test query
        await lWebDatabase.transaction([User], 'readonly', async (pTransaction) => {
            const lUserTable = pTransaction.table(User);
            const lResults = await lUserTable.where('age').between(24, 31).read();
            
            expect(lResults).toHaveLength(2);
            expect(lResults.map(u => u.age).sort()).toEqual([25, 30]);
        });

        lWebDatabase.close();
    });

    await pContext.step('Single index query with greater than filter', async () => {
        // Setup
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lWebDatabase = new WebDatabase(lDatabaseName, [User]);

        // Create test data
        await lWebDatabase.transaction([User], 'readwrite', async (pTransaction) => {
            const lUserTable = pTransaction.table(User);
            
            const lAges = [20, 25, 30, 35, 40];
            for (let i = 0; i < lAges.length; i++) {
                const lUser = new User();
                lUser.email = `user${i}@example.com`;
                lUser.age = lAges[i];
                lUser.name = `User ${i}`;
                await lUserTable.put(lUser);
            }
        });

        // Test query
        await lWebDatabase.transaction([User], 'readonly', async (pTransaction) => {
            const lUserTable = pTransaction.table(User);
            const lResults = await lUserTable.where('age').greaterThan(30).read();
            
            expect(lResults).toHaveLength(2);
            expect(lResults.map(u => u.age).sort()).toEqual([35, 40]);
        });

        lWebDatabase.close();
    });

    await pContext.step('Single index query with lower than filter', async () => {
        // Setup
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lWebDatabase = new WebDatabase(lDatabaseName, [User]);

        // Create test data
        await lWebDatabase.transaction([User], 'readwrite', async (pTransaction) => {
            const lUserTable = pTransaction.table(User);
            
            const lAges = [20, 25, 30, 35, 40];
            for (let i = 0; i < lAges.length; i++) {
                const lUser = new User();
                lUser.email = `user${i}@example.com`;
                lUser.age = lAges[i];
                lUser.name = `User ${i}`;
                await lUserTable.put(lUser);
            }
        });

        // Test query
        await lWebDatabase.transaction([User], 'readonly', async (pTransaction) => {
            const lUserTable = pTransaction.table(User);
            const lResults = await lUserTable.where('age').lowerThan(30).read();
            
            expect(lResults).toHaveLength(2);
            expect(lResults.map(u => u.age).sort()).toEqual([20, 25]);
        });

        lWebDatabase.close();
    });

    await pContext.step('Compound index query with exact match', async () => {
        // Setup
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lWebDatabase = new WebDatabase(lDatabaseName, [Product]);

        // Create test data
        await lWebDatabase.transaction([Product], 'readwrite', async (pTransaction) => {
            const lProductTable = pTransaction.table(Product);
            
            const lProducts = [
                { category: 'Electronics', brand: 'Apple', price: 999, name: 'iPhone' },
                { category: 'Electronics', brand: 'Samsung', price: 899, name: 'Galaxy' },
                { category: 'Clothing', brand: 'Nike', price: 199, name: 'Shoes' },
                { category: 'Electronics', brand: 'Apple', price: 1299, name: 'MacBook' }
            ];

            for (const lProductData of lProducts) {
                const lProduct = new Product();
                Object.assign(lProduct, lProductData);
                await lProductTable.put(lProduct);
            }
        });

        // Test compound index query
        await lWebDatabase.transaction([Product], 'readonly', async (pTransaction) => {
            const lProductTable = pTransaction.table(Product);
            const lResults = await lProductTable
                .where('category').is('Electronics')
                .and('brand').is('Apple')
                .read();
            
            expect(lResults).toHaveLength(2);
            expect(lResults.every(p => p.category === 'Electronics' && p.brand === 'Apple')).toBeTruthy();
        });

        lWebDatabase.close();
    });

    await pContext.step('Compound index query with range filters', async () => {
        // Setup
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lWebDatabase = new WebDatabase(lDatabaseName, [Product]);

        // Create test data
        await lWebDatabase.transaction([Product], 'readwrite', async (pTransaction) => {
            const lProductTable = pTransaction.table(Product);
            
            const lProducts = [
                { category: 'Electronics', brand: 'Apple', price: 500, name: 'iPad' },
                { category: 'Electronics', brand: 'Samsung', price: 800, name: 'Tablet' },
                { category: 'Electronics', brand: 'Sony', price: 1200, name: 'Camera' },
                { category: 'Clothing', brand: 'Nike', price: 150, name: 'Shirt' }
            ];

            for (const lProductData of lProducts) {
                const lProduct = new Product();
                Object.assign(lProduct, lProductData);
                await lProductTable.put(lProduct);
            }
        });

        // Test compound index query with price range
        await lWebDatabase.transaction([Product], 'readonly', async (pTransaction) => {
            const lProductTable = pTransaction.table(Product);
            const lResults = await lProductTable
                .where('category').is('Electronics')
                .and('price').between(600, 1000)
                .read();
            
            expect(lResults).toHaveLength(1);
            expect(lResults[0].brand).toBe('Samsung');
            expect(lResults[0].price).toBe(800);
        });

        lWebDatabase.close();
    });

    await pContext.step('Query by identity field', async () => {
        // Setup
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lWebDatabase = new WebDatabase(lDatabaseName, [Order]);

        // Create test data
        await lWebDatabase.transaction([Order], 'readwrite', async (pTransaction) => {
            const lOrderTable = pTransaction.table(Order);
            
            const lOrders = [
                { orderId: 'ORD-001', customerId: 123, status: 'pending', total: 100 },
                { orderId: 'ORD-002', customerId: 456, status: 'completed', total: 200 },
                { orderId: 'ORD-003', customerId: 789, status: 'pending', total: 150 }
            ];

            for (const lOrderData of lOrders) {
                const lOrder = new Order();
                Object.assign(lOrder, lOrderData);
                await lOrderTable.put(lOrder);
            }
        });

        // Test identity query
        await lWebDatabase.transaction([Order], 'readonly', async (pTransaction) => {
            const lOrderTable = pTransaction.table(Order);
            const lResults = await lOrderTable.where('orderId').is('ORD-002').read();
            
            expect(lResults).toHaveLength(1);
            expect(lResults[0].orderId).toBe('ORD-002');
            expect(lResults[0].total).toBe(200);
        });

        lWebDatabase.close();
    });

    await pContext.step('Query with single OR condition', async () => {
        // Setup
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lWebDatabase = new WebDatabase(lDatabaseName, [Order]);

        // Create test data
        await lWebDatabase.transaction([Order], 'readwrite', async (pTransaction) => {
            const lOrderTable = pTransaction.table(Order);
            
            const lOrders = [
                { orderId: 'ORD-001', customerId: 123, status: 'pending', total: 100 },
                { orderId: 'ORD-002', customerId: 456, status: 'completed', total: 200 },
                { orderId: 'ORD-003', customerId: 789, status: 'cancelled', total: 150 },
                { orderId: 'ORD-004', customerId: 123, status: 'pending', total: 300 }
            ];

            for (const lOrderData of lOrders) {
                const lOrder = new Order();
                Object.assign(lOrder, lOrderData);
                await lOrderTable.put(lOrder);
            }
        });

        // Test OR query
        await lWebDatabase.transaction([Order], 'readonly', async (pTransaction) => {
            const lOrderTable = pTransaction.table(Order);
            const lResults = await lOrderTable
                .where('status').is('pending')
                .or('status').is('completed')
                .read();
            
            expect(lResults).toHaveLength(3);
            const lStatuses = lResults.map(o => o.status);
            expect(lStatuses.filter(s => s === 'pending')).toHaveLength(2);
            expect(lStatuses.filter(s => s === 'completed')).toHaveLength(1);
        });

        lWebDatabase.close();
    });

    await pContext.step('Query with two OR conditions (triple condition)', async () => {
        // Setup
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lWebDatabase = new WebDatabase(lDatabaseName, [User]);

        // Create test data
        await lWebDatabase.transaction([User], 'readwrite', async (pTransaction) => {
            const lUserTable = pTransaction.table(User);
            
            const lAges = [18, 25, 30, 35, 40, 45, 50];
            for (let i = 0; i < lAges.length; i++) {
                const lUser = new User();
                lUser.email = `user${i}@example.com`;
                lUser.age = lAges[i];
                lUser.name = `User ${i}`;
                await lUserTable.put(lUser);
            }
        });

        // Test triple OR query
        await lWebDatabase.transaction([User], 'readonly', async (pTransaction) => {
            const lUserTable = pTransaction.table(User);
            const lResults = await lUserTable
                .where('age').is(25)
                .or('age').is(35)
                .or('age').is(45)
                .read();
            
            expect(lResults).toHaveLength(3);
            expect(lResults.map(u => u.age).sort()).toEqual([25, 35, 45]);
        });

        lWebDatabase.close();
    });

    await pContext.step('Complex query with AND and OR combinations', async () => {
        // Setup
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lWebDatabase = new WebDatabase(lDatabaseName, [Product]);

        // Create test data
        await lWebDatabase.transaction([Product], 'readwrite', async (pTransaction) => {
            const lProductTable = pTransaction.table(Product);
            
            const lProducts = [
                { category: 'Electronics', brand: 'Apple', price: 999, name: 'iPhone' },
                { category: 'Electronics', brand: 'Samsung', price: 899, name: 'Galaxy' },
                { category: 'Electronics', brand: 'Apple', price: 1299, name: 'MacBook' },
                { category: 'Clothing', brand: 'Nike', price: 199, name: 'Shoes' },
                { category: 'Clothing', brand: 'Adidas', price: 299, name: 'Jacket' }
            ];

            for (const lProductData of lProducts) {
                const lProduct = new Product();
                Object.assign(lProduct, lProductData);
                await lProductTable.put(lProduct);
            }
        });

        // Test complex query: (Electronics AND Apple) OR (Clothing AND price > 250)
        await lWebDatabase.transaction([Product], 'readonly', async (pTransaction) => {
            const lProductTable = pTransaction.table(Product);
            const lResults = await lProductTable
                .where('category').is('Electronics')
                .and('brand').is('Apple')
                .or('category').is('Clothing')
                .and('price').greaterThan(250)
                .read();
            
            expect(lResults).toHaveLength(3);
            // Should include: iPhone, MacBook (Electronics + Apple), Jacket (Clothing + price > 250)
            const lNames = lResults.map(p => p.name).sort();
            expect(lNames).toEqual(['iPhone', 'Jacket', 'MacBook']);
        });

        lWebDatabase.close();
    });
});

Deno.test('WebDatabaseQuery.delete()', { sanitizeResources: false, sanitizeOps: false }, async (pContext) => {
    await pContext.step('Delete with single index exact match', async () => {
        // Setup
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lWebDatabase = new WebDatabase(lDatabaseName, [User]);

        // Create test data
        await lWebDatabase.transaction([User], 'readwrite', async (pTransaction) => {
            const lUserTable = pTransaction.table(User);
            
            const lUsers = [
                { email: 'john@example.com', age: 25, name: 'John Doe' },
                { email: 'jane@example.com', age: 30, name: 'Jane Smith' },
                { email: 'bob@example.com', age: 35, name: 'Bob Johnson' }
            ];

            for (const lUserData of lUsers) {
                const lUser = new User();
                Object.assign(lUser, lUserData);
                await lUserTable.put(lUser);
            }
        });

        // Delete specific user
        await lWebDatabase.transaction([User], 'readwrite', async (pTransaction) => {
            const lUserTable = pTransaction.table(User);
            await lUserTable.where('email').is('jane@example.com').delete();
        });

        // Verify deletion
        await lWebDatabase.transaction([User], 'readonly', async (pTransaction) => {
            const lUserTable = pTransaction.table(User);
            const lAllUsers = await lUserTable.getAll();
            
            expect(lAllUsers).toHaveLength(2);
            expect(lAllUsers.map(u => u.email)).not.toContain('jane@example.com');
        });

        lWebDatabase.close();
    });

    await pContext.step('Delete with range filter using between()', async () => {
        // Setup
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lWebDatabase = new WebDatabase(lDatabaseName, [User]);

        // Create test data
        await lWebDatabase.transaction([User], 'readwrite', async (pTransaction) => {
            const lUserTable = pTransaction.table(User);
            
            const lAges = [20, 25, 30, 35, 40, 45];
            for (let i = 0; i < lAges.length; i++) {
                const lUser = new User();
                lUser.email = `user${i}@example.com`;
                lUser.age = lAges[i];
                lUser.name = `User ${i}`;
                await lUserTable.put(lUser);
            }
        });

        // Delete users in age range
        await lWebDatabase.transaction([User], 'readwrite', async (pTransaction) => {
            const lUserTable = pTransaction.table(User);
            await lUserTable.where('age').between(28, 37).delete();
        });

        // Verify deletion
        await lWebDatabase.transaction([User], 'readonly', async (pTransaction) => {
            const lUserTable = pTransaction.table(User);
            const lRemainingUsers = await lUserTable.getAll();
            
            expect(lRemainingUsers).toHaveLength(4);
            expect(lRemainingUsers.map(u => u.age).sort()).toEqual([20, 25, 40, 45]);
        });

        lWebDatabase.close();
    });

    await pContext.step('Delete with greater than filter', async () => {
        // Setup
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lWebDatabase = new WebDatabase(lDatabaseName, [User]);

        // Create test data
        await lWebDatabase.transaction([User], 'readwrite', async (pTransaction) => {
            const lUserTable = pTransaction.table(User);
            
            const lAges = [20, 25, 30, 35, 40];
            for (let i = 0; i < lAges.length; i++) {
                const lUser = new User();
                lUser.email = `user${i}@example.com`;
                lUser.age = lAges[i];
                lUser.name = `User ${i}`;
                await lUserTable.put(lUser);
            }
        });

        // Delete users older than 30
        await lWebDatabase.transaction([User], 'readwrite', async (pTransaction) => {
            const lUserTable = pTransaction.table(User);
            await lUserTable.where('age').greaterThan(30).delete();
        });

        // Verify deletion
        await lWebDatabase.transaction([User], 'readonly', async (pTransaction) => {
            const lUserTable = pTransaction.table(User);
            const lRemainingUsers = await lUserTable.getAll();
            
            expect(lRemainingUsers).toHaveLength(3);
            expect(lRemainingUsers.map(u => u.age).sort()).toEqual([20, 25, 30]);
        });

        lWebDatabase.close();
    });

    await pContext.step('Delete with lower than filter', async () => {
        // Setup
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lWebDatabase = new WebDatabase(lDatabaseName, [User]);

        // Create test data
        await lWebDatabase.transaction([User], 'readwrite', async (pTransaction) => {
            const lUserTable = pTransaction.table(User);
            
            const lAges = [20, 25, 30, 35, 40];
            for (let i = 0; i < lAges.length; i++) {
                const lUser = new User();
                lUser.email = `user${i}@example.com`;
                lUser.age = lAges[i];
                lUser.name = `User ${i}`;
                await lUserTable.put(lUser);
            }
        });

        // Delete users younger than 30
        await lWebDatabase.transaction([User], 'readwrite', async (pTransaction) => {
            const lUserTable = pTransaction.table(User);
            await lUserTable.where('age').lowerThan(30).delete();
        });

        // Verify deletion
        await lWebDatabase.transaction([User], 'readonly', async (pTransaction) => {
            const lUserTable = pTransaction.table(User);
            const lRemainingUsers = await lUserTable.getAll();
            
            expect(lRemainingUsers).toHaveLength(3);
            expect(lRemainingUsers.map(u => u.age).sort()).toEqual([30, 35, 40]);
        });

        lWebDatabase.close();
    });

    await pContext.step('Delete with compound index query', async () => {
        // Setup
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lWebDatabase = new WebDatabase(lDatabaseName, [Product]);

        // Create test data
        await lWebDatabase.transaction([Product], 'readwrite', async (pTransaction) => {
            const lProductTable = pTransaction.table(Product);
            
            const lProducts = [
                { category: 'Electronics', brand: 'Apple', price: 999, name: 'iPhone' },
                { category: 'Electronics', brand: 'Samsung', price: 899, name: 'Galaxy' },
                { category: 'Electronics', brand: 'Apple', price: 1299, name: 'MacBook' },
                { category: 'Clothing', brand: 'Nike', price: 199, name: 'Shoes' }
            ];

            for (const lProductData of lProducts) {
                const lProduct = new Product();
                Object.assign(lProduct, lProductData);
                await lProductTable.put(lProduct);
            }
        });

        // Delete Apple Electronics
        await lWebDatabase.transaction([Product], 'readwrite', async (pTransaction) => {
            const lProductTable = pTransaction.table(Product);
            await lProductTable
                .where('category').is('Electronics')
                .and('brand').is('Apple')
                .delete();
        });

        // Verify deletion
        await lWebDatabase.transaction([Product], 'readonly', async (pTransaction) => {
            const lProductTable = pTransaction.table(Product);
            const lRemainingProducts = await lProductTable.getAll();
            
            expect(lRemainingProducts).toHaveLength(2);
            expect(lRemainingProducts.map(p => p.name).sort()).toEqual(['Galaxy', 'Shoes']);
        });

        lWebDatabase.close();
    });

    await pContext.step('Delete by identity field', async () => {
        // Setup
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lWebDatabase = new WebDatabase(lDatabaseName, [Order]);

        // Create test data
        await lWebDatabase.transaction([Order], 'readwrite', async (pTransaction) => {
            const lOrderTable = pTransaction.table(Order);
            
            const lOrders = [
                { orderId: 'ORD-001', customerId: 123, status: 'pending', total: 100 },
                { orderId: 'ORD-002', customerId: 456, status: 'completed', total: 200 },
                { orderId: 'ORD-003', customerId: 789, status: 'pending', total: 150 }
            ];

            for (const lOrderData of lOrders) {
                const lOrder = new Order();
                Object.assign(lOrder, lOrderData);
                await lOrderTable.put(lOrder);
            }
        });

        // Delete specific order by ID
        await lWebDatabase.transaction([Order], 'readwrite', async (pTransaction) => {
            const lOrderTable = pTransaction.table(Order);
            await lOrderTable.where('orderId').is('ORD-002').delete();
        });

        // Verify deletion
        await lWebDatabase.transaction([Order], 'readonly', async (pTransaction) => {
            const lOrderTable = pTransaction.table(Order);
            const lRemainingOrders = await lOrderTable.getAll();
            
            expect(lRemainingOrders).toHaveLength(2);
            expect(lRemainingOrders.map(o => o.orderId)).not.toContain('ORD-002');
        });

        lWebDatabase.close();
    });

    await pContext.step('Delete with single OR condition', async () => {
        // Setup
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lWebDatabase = new WebDatabase(lDatabaseName, [Order]);

        // Create test data
        await lWebDatabase.transaction([Order], 'readwrite', async (pTransaction) => {
            const lOrderTable = pTransaction.table(Order);
            
            const lOrders = [
                { orderId: 'ORD-001', customerId: 123, status: 'pending', total: 100 },
                { orderId: 'ORD-002', customerId: 456, status: 'completed', total: 200 },
                { orderId: 'ORD-003', customerId: 789, status: 'cancelled', total: 150 },
                { orderId: 'ORD-004', customerId: 123, status: 'pending', total: 300 }
            ];

            for (const lOrderData of lOrders) {
                const lOrder = new Order();
                Object.assign(lOrder, lOrderData);
                await lOrderTable.put(lOrder);
            }
        });

        // Delete pending or cancelled orders
        await lWebDatabase.transaction([Order], 'readwrite', async (pTransaction) => {
            const lOrderTable = pTransaction.table(Order);
            await lOrderTable
                .where('status').is('pending')
                .or('status').is('cancelled')
                .delete();
        });

        // Verify deletion
        await lWebDatabase.transaction([Order], 'readonly', async (pTransaction) => {
            const lOrderTable = pTransaction.table(Order);
            const lRemainingOrders = await lOrderTable.getAll();
            
            expect(lRemainingOrders).toHaveLength(1);
            expect(lRemainingOrders[0].status).toBe('completed');
        });

        lWebDatabase.close();
    });

    await pContext.step('Delete with two OR conditions (triple condition)', async () => {
        // Setup
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lWebDatabase = new WebDatabase(lDatabaseName, [User]);

        // Create test data
        await lWebDatabase.transaction([User], 'readwrite', async (pTransaction) => {
            const lUserTable = pTransaction.table(User);
            
            const lAges = [20, 25, 30, 35, 40, 45, 50];
            for (let i = 0; i < lAges.length; i++) {
                const lUser = new User();
                lUser.email = `user${i}@example.com`;
                lUser.age = lAges[i];
                lUser.name = `User ${i}`;
                await lUserTable.put(lUser);
            }
        });

        // Delete users aged 25, 35, or 45
        await lWebDatabase.transaction([User], 'readwrite', async (pTransaction) => {
            const lUserTable = pTransaction.table(User);
            await lUserTable
                .where('age').is(25)
                .or('age').is(35)
                .or('age').is(45)
                .delete();
        });

        // Verify deletion
        await lWebDatabase.transaction([User], 'readonly', async (pTransaction) => {
            const lUserTable = pTransaction.table(User);
            const lRemainingUsers = await lUserTable.getAll();
            
            expect(lRemainingUsers).toHaveLength(4);
            expect(lRemainingUsers.map(u => u.age).sort()).toEqual([20, 30, 40, 50]);
        });

        lWebDatabase.close();
    });

    await pContext.step('Delete with complex AND and OR combinations', async () => {
        // Setup
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lWebDatabase = new WebDatabase(lDatabaseName, [Product]);

        // Create test data
        await lWebDatabase.transaction([Product], 'readwrite', async (pTransaction) => {
            const lProductTable = pTransaction.table(Product);
            
            const lProducts = [
                { category: 'Electronics', brand: 'Apple', price: 999, name: 'iPhone' },
                { category: 'Electronics', brand: 'Samsung', price: 899, name: 'Galaxy' },
                { category: 'Electronics', brand: 'Apple', price: 1299, name: 'MacBook' },
                { category: 'Clothing', brand: 'Nike', price: 199, name: 'Shoes' },
                { category: 'Clothing', brand: 'Adidas', price: 299, name: 'Jacket' }
            ];

            for (const lProductData of lProducts) {
                const lProduct = new Product();
                Object.assign(lProduct, lProductData);
                await lProductTable.put(lProduct);
            }
        });

        // Delete: (Electronics AND Apple) OR (Clothing AND price > 250)
        await lWebDatabase.transaction([Product], 'readwrite', async (pTransaction) => {
            const lProductTable = pTransaction.table(Product);
            await lProductTable
                .where('category').is('Electronics')
                .and('brand').is('Apple')
                .or('category').is('Clothing')
                .and('price').greaterThan(250)
                .delete();
        });

        // Verify deletion
        await lWebDatabase.transaction([Product], 'readonly', async (pTransaction) => {
            const lProductTable = pTransaction.table(Product);
            const lRemainingProducts = await lProductTable.getAll();
            
            expect(lRemainingProducts).toHaveLength(2);
            // Should remain: Galaxy (Electronics but not Apple), Shoes (Clothing but price <= 250)
            const lNames = lRemainingProducts.map(p => p.name).sort();
            expect(lNames).toEqual(['Galaxy', 'Shoes']);
        });

        lWebDatabase.close();
    });
});

Deno.test('WebDatabaseQuery Error Cases', { sanitizeResources: false, sanitizeOps: false }, async (pContext) => {
    await pContext.step('Read with incomplete query should throw error', async () => {
        // Setup
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lWebDatabase = new WebDatabase(lDatabaseName, [User]);

        await lWebDatabase.transaction([User], 'readonly', async (pTransaction) => {
            const lUserTable = pTransaction.table(User);
            
            // Create a query but don't call .is(), .between(), etc.
            const lQuery = new (lUserTable as any).constructor.__proto__.constructor(lUserTable);
            
            // Should throw error when trying to read without any queries
            await expect(async () => {
                await lQuery.read();
            }).rejects.toThrow('No queries specified.');
        });

        lWebDatabase.close();
    });

    await pContext.step('Delete with incomplete query should throw error', async () => {
        // Setup
        const lDatabaseName: string = Math.random().toString(36).substring(2, 15);
        const lWebDatabase = new WebDatabase(lDatabaseName, [User]);

        await lWebDatabase.transaction([User], 'readwrite', async (pTransaction) => {
            const lUserTable = pTransaction.table(User);
            
            // Create a query but don't call .is(), .between(), etc.
            const lQuery = new (lUserTable as any).constructor.__proto__.constructor(lUserTable);
            
            // Should throw error when trying to delete without any queries
            await expect(async () => {
                await lQuery.delete();
            }).rejects.toThrow('No queries specified.');
        });

        lWebDatabase.close();
    });
});
