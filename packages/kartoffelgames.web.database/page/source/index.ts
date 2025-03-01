/* eslint-disable no-console */
import { WebDatabaseIdentity } from '../../source/web_database/layout/web-database-identity.decorator.ts';
import { WebDatabaseIndex } from '../../source/web_database/layout/web-database-index.decorator.ts';
import { WebDatabase } from '../../source/web_database/web-database.ts';
import type { WebDatabaseTable } from '../../source/web_database/web-database-table.ts';

class TestTableOne {
    @WebDatabaseIdentity(true)
    public id?: number;

    @WebDatabaseIndex(true)
    public name?: string;

    @WebDatabaseIndex()
    public price?: number;

    @WebDatabaseIndex()
    public types?: Array<number>;

    public notIndexed?: string;

    public whatMyId(): number {
        return this.id!;
    }
}

class TestTableTwo {
    @WebDatabaseIndex(true)
    public nameThing?: string;
}

(() => {
    const lDatabase: WebDatabase = new WebDatabase('MainDB', [TestTableOne, TestTableTwo]);
    lDatabase.transaction([TestTableOne, TestTableTwo], 'readwrite', async (pTransaction) => {
        const lTestTableOne: WebDatabaseTable<typeof TestTableOne> = pTransaction.table(TestTableOne);
        const lTestTableTwo: WebDatabaseTable<typeof TestTableTwo> = pTransaction.table(TestTableTwo);

        await lTestTableOne.clear();
        await lTestTableTwo.clear();

        // Create random data.
        for (let lCounter = 0; lCounter < 100; lCounter++) {
            const lData: TestTableOne = new TestTableOne();
            lData.name = Math.random().toString(16);
            lData.price = Math.random();
            lData.types = [1, 2, 3].slice(Math.floor(Math.random() * 4), Math.floor(Math.random() * 4));
            lData.notIndexed = Math.random().toString(16);

            await lTestTableOne.put(lData);
        }

        console.log(await lTestTableOne.count(), await lTestTableOne.getAll());
        console.log(await lTestTableOne.where('types').is(2).and('price').between(0, 0.5).execute());

        // Create random data.
        for (let lCounter = 0; lCounter < 100; lCounter++) {
            const lData: TestTableTwo = new TestTableTwo();
            lData.nameThing = Math.random().toString(16);

            await lTestTableTwo.put(lData);
        }
    });
})();

