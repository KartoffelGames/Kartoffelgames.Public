import { TableType } from "./table/table-layout";
import { WebDb } from "./web-db";

export class WebDbTable {
    private readonly mDatabase: WebDb;
    private readonly mTableType: TableType;

    /**
     * Constructor.
     * 
     * @param pType - Table type.
     * @param pDatabase - Database.
     */
    public constructor(pType: TableType, pDatabase: WebDb) {
        this.mTableType = pType;
        this.mDatabase = pDatabase;
    }
}