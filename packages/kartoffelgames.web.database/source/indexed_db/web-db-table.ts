
import { TableType } from './table/table-layout';
import { WebDbTransaction } from './web-db-transaction';

export class WebDbTable<TTableType extends TableType> {
    private readonly mTableType: TTableType;
    private readonly mTransaction: WebDbTransaction<TableType>;

    /**
     * Constructor.
     * 
     * @param pType - Table type.
     * @param pDatabase - Database.
     */
    public constructor(pType: TTableType, pTransaction: WebDbTransaction<TableType>) {
        this.mTableType = pType;
        this.mTransaction = pTransaction;
    }
}