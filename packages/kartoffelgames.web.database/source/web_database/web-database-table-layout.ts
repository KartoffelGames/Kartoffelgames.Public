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

    private readonly mFields: Set<string>;
    private mIdentity: TableLayoutIdentity | null;
    private readonly mIndices: Map<string, TableLayoutIndex>;
    private mTableName: string;
    private mTableType: TableType | null;

    /**
     * Get table field names.
     */
    public get fields(): Array<string> {
        // Restrict access when no table name is set.
        if (!this.mTableType) {
            throw new Exception('Webdatabase field defined but the Table was not initialized with a name.', this);
        }

        return Array.from(this.mFields.values());
    }

    /**
     * Get all indices of the table type.
     */
    public get identity(): Readonly<TableLayoutIdentity> | null {
        // Restrict access when no table name is set.
        if (!this.mTableType) {
            throw new Exception('Webdatabase field defined but the Table was not initialized with a name.', this);
        }

        // Return identity.
        return this.mIdentity;
    }

    /**
     * Get all indices of the table type.
     */
    public get indices(): Array<string> {
        // Restrict access when no table name is set.
        if (!this.mTableType) {
            throw new Exception('Webdatabase field defined but the Table was not initialized with a name.', this);
        }

        return Array.from(this.mIndices.keys());
    }

    /**
     * Get table name.
     */
    public get tableName(): string {
        // Restrict access when no table name is set.
        if (!this.mTableType) {
            throw new Exception('Webdatabase field defined but the Table was not initialized with a name.', this);
        }

        return this.mTableName;
    }

    /**
     * Get table type.
     */
    public get tableType(): TableType {
        // Restrict access when no table name is set.
        if (!this.mTableType) {
            throw new Exception('Webdatabase field defined but the Table was not initialized with a name.', this);
        }

        return this.mTableType;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mTableName = '';
        this.mTableType = null;
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
                unique: pIsUnique,
                type: pMultiEnty ? 'multiEntry' : 'default',
            };

            // Link index to table config.
            this.mIndices.set(pIndexName, lIndexConfig);
        }

        // Add key to index.
        lIndexConfig.keys.push(pPropertyKey);

        // Disable multientity when key is not a array or more than one key is set for the same index.
        if (lIndexConfig.keys.length > 1 && lIndexConfig.type === 'multiEntry') {
            throw new Exception(`Multi entity index can only have one property.`, this);
        }

        // Upgrade index type when more than one key is set.
        if (lIndexConfig.keys.length > 1) {
            // Order keys alphabetically to ensure the same order in the index.
            lIndexConfig.keys.sort();

            // Set index type to compound.
            lIndexConfig.type = 'compound';
        }

        // Index is not unique when one index is not unique.
        if (lIndexConfig.unique !== pIsUnique) {
            throw new Exception(`Multi key index "${pIndexName}" cant have mixed unique settings.`, this);
        }
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
     * Set table name.
     */
    public setTableName(pType: TableType, pName: string): void {
        if (this.mTableType) {
            throw new Exception('Table name can only be set once.', this);
        }

        this.mTableName = pName;
        this.mTableType = pType;
    }
}

export type TableLayoutIndex = {
    name: string;
    keys: [string];
    unique: boolean;
    type: 'default' | 'multiEntry';
} | {
    name: string;
    keys: Array<string>;
    unique: boolean;
    type: 'compound';
};

export type TableLayoutIdentity = {
    key: string;
    autoIncrement: boolean;
};

export type TableType = IVoidParameterConstructor<object>;