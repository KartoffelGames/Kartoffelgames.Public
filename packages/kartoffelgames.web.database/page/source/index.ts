import { WebDbIdentity } from '../../source/indexed_db/table/web-db-identity.decorator';
import { WebDbIndex } from '../../source/indexed_db/table/web-db-index.decorator';
import { WebDb } from '../../source/indexed_db/web-db';
import { WebDbTable } from '../../source/indexed_db/web-db-table';


class TestTable {
    @WebDbIdentity(true)
    public id?: number;

    @WebDbIndex(true)
    public name?: string;

    @WebDbIndex()
    public price?: number;

    @WebDbIndex()
    public types?: Array<number>;

    public notIndexed?: string;

    public whatMyId(): number {
        return this.id!;
    }
}

(() => {
    const lDatabase: WebDb = new WebDb('MainDB', [TestTable]);

    lDatabase.transaction([TestTable], 'readwrite', async (pTransaction) => {
        const lTestTable: WebDbTable<typeof TestTable> = pTransaction.table(TestTable);

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

