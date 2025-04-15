import { Exception, type IVoidParameterConstructor } from '@kartoffelgames/core';
import { Metadata } from '@kartoffelgames/core-dependency-injection';

/**
 * Singleton. Table layout and settings.
 */
export class WebDatabaseTableLayout {
    public static readonly METADATA_KEY: symbol = Symbol('WebDatabaseTableLayoutMetadataKey');

    /**
     * Get table configuration of type.
     * 
     * @param pType - Table type.
     * 
     * @returns table type config. 
     */
    public static configOf(pType: TableType): WebDatabaseTableLayout {
        // Read table config from metadata.
        const lTableLayout: WebDatabaseTableLayout | null = Metadata.get(pType).getMetadata(WebDatabaseTableLayout.METADATA_KEY);

        // Table type is not initialized.
        if (!lTableLayout) {
            throw new Exception('Table type not defined.', this);
        }

        return lTableLayout;
    }

    private mTableName: string | null;
    private readonly mFields: Set<string>;
    private mIdentity: TableLayoutIdentity | null;
    private readonly mIndices: Map<string, TableLayoutIndex>;

    /**
     * Get table field names.
     */
    public get fields(): Array<string> {
        // Restrict access when no table name is set.
        if (!this.mTableName) {
            throw new Exception('Webdatabase field defined but the Table was not initialized with a name.', this);
        }

        return Array.from(this.mFields.values());
    }

    /**
     * Get all indices of the table type.
     */
    public get identity(): TableLayoutIdentity {
        // Restrict access when no table name is set.
        if (!this.mTableName) {
            throw new Exception('Webdatabase field defined but the Table was not initialized with a name.', this);
        }

        // Return a default identity when no identity is set.
        if (!this.mIdentity) {
            return {
                key: '__ID__',
                autoIncrement: false
            };
        }

        return this.mIdentity;
    }

    /**
     * Get all indices of the table type.
     */
    public get indices(): Array<string> {
        // Restrict access when no table name is set.
        if (!this.mTableName) {
            throw new Exception('Webdatabase field defined but the Table was not initialized with a name.', this);
        }

        return Array.from(this.mIndices.keys());
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mTableName = null;
        this.mIdentity = null;
        this.mIndices = new Map<string, TableLayoutIndex>();
        this.mFields = new Set<string>();
    }

    /**
     * Get table type index by name.
     * 
     * @param pName - Index name.
     * 
     * @returns Table type index or undefined when not found.
     */
    public index(pName: string): TableLayoutIndex | undefined {
        // Restrict access when no table name is set.
        if (!this.mTableName) {
            throw new Exception('Webdatabase field defined but the Table was not initialized with a name.', this);
        }

        return this.mIndices.get(pName);
    }

    /**
     * Set table type identity.
     * 
     * @param pType - Table type.
     * @param pKey - Key of identity.
     * @param pAutoIncrement - Autoincrement identity.
     * 
     * @throws {@link Exception} - When a identitfier for this type is already set.
     */
    public setTableIdentity(pKey: string, pAutoIncrement: boolean): void {
        // Read table config and restrict to one identity.
        if (this.mIdentity) {
            throw new Exception(`A table type can only have one identifier.`, this);
        }

        // Set table type identity.
        this.mIdentity = {
            key: pKey,
            autoIncrement: pAutoIncrement,
        };

        // Add property key to field list.
        this.mFields.add(pKey);
    }

    /**
     * Set table type identity.
     * 
     * @param pType - Table type.
     * @param pPropertyKey - Property key of identity.
     * @param pIndexName - Index name.
     * @param pIsArray - Property is key.
     * @param pIsUnique - Index should be unique.
     */
    public setTableField(pPropertyKey: string, pIndexName?: string, pIsUnique: boolean = false, pMultiEnty: boolean = false): void {
        // add property key to field list.
        this.mFields.add(pPropertyKey);

        // Skip index creation when no index name is set.
        if (!pIndexName) {
            return;
        }

        // Initialize index.
        let lIndexConfig: TableLayoutIndex | undefined = this.mIndices.get(pIndexName);
        if (!lIndexConfig) {
            // Set default configuration where anything is enabled.
            lIndexConfig = {
                name: pIndexName,
                keys: new Array<string>() as [string],
                unique: true,
                type: pMultiEnty ? 'multiEntryIndex' : 'index',
            };

            // Link index to table config.
            this.mIndices.set(pIndexName, lIndexConfig);
        }

        // Add key to index.
        lIndexConfig.keys.push(pPropertyKey);

        // Disable multientity when key is not a array or more than one key is set for the same index.
        if (lIndexConfig.keys.length > 1 && lIndexConfig.type === 'multiEntryIndex') {
            throw new Exception(`Multientity index can only have one key.`, this);
        }

        // Upgrade index type when more than one key is set.
        if (lIndexConfig.keys.length > 1) {
            lIndexConfig.type = 'compoundIndex';
        }

        // Index is not unique when one index is not unique.
        if (!pIsUnique) {
            lIndexConfig.unique = false;
        }
    }

    /**
     * Set table name.
     */
    public setTableName(pName: string): void {
        if (this.mTableName) {
            throw new Exception('Table name can only be set once.', this);
        }
        this.mTableName = pName;
    }
}

export type TableLayoutIndex = {
    name: string;
    keys: [string];
    unique: boolean;
    type: 'index' | 'multiEntryIndex';
} | {
    name: string;
    keys: Array<string>;
    unique: boolean;
    type: 'compoundIndex';
};

export type TableLayoutIdentity = {
    key: string;
    autoIncrement: boolean;
};

export type TableType = IVoidParameterConstructor<object>;