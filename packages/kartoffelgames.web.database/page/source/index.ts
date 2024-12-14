import { WebDatabaseIdentity } from '../../source/web_database/layout/web-database-identity.decorator';
import { WebDatabaseIndex } from '../../source/web_database/layout/web-database-index.decorator';
import { WebDatabase } from '../../source/web_database/web-database';
import { WebDatabaseTable } from '../../source/web_database/web-database-table';

class TestTable {
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

(() => {
    const lDatabase: WebDatabase = new WebDatabase('MainDB', [TestTable]);

    lDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
        const lTestTable: WebDatabaseTable<typeof TestTable> = pTransaction.table(TestTable);

        // Create random data.
        const lData: TestTable = new TestTable();
        lData.name = Math.random().toString(16);
        lData.price = Math.random();
        lData.types = [1, 2, 3];
        lData.notIndexed = Math.random().toString(16);

        await lTestTable.put(lData);

        console.log(await lTestTable.getAll());
        console.log(await lTestTable.count());

        await lTestTable.delete(lData);

        console.log(await lTestTable.count());

        await lTestTable.clear();

        console.log(await lTestTable.count());
    });
})();

