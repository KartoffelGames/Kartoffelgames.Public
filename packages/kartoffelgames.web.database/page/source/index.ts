import { WebDbIdentity } from '../../source/indexed_db/table/web-db-identity.decorator';
import { WebDbIndex } from '../../source/indexed_db/table/web-db-index.decorator';
import { WebDb } from '../../source/indexed_db/web-db';


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
}

(() => {
    const lDatabase: WebDb = new WebDb('MainDB', [TestTable]);

    lDatabase.transaction([TestTable], () => {

    });
})();

