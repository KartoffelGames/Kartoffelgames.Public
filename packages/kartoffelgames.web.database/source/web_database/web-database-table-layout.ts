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
    public get identity(): Readonly<TableLayoutIdentity> {
        // Restrict access when no table name is set.
        if (!this.mTableType) {
            throw new Exception('Webdatabase field defined but the Table was not initialized with a name.', this);
        }

        // Generic identity when no identity is set.
        if (!this.mIdentity) {
            return {
                key: '__id__',
                autoIncrement: true,
            };
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
     * Set table type field.
     * Setting a field includes the property value in the saved object.
     * 
     * @remarks
     * Does not set a index or identity.
     * 
     * @param pPropertyKey - Property key of identity.
     */
    public setTableField(pPropertyKey: string): void {
        // add property key to field list.
        this.mFields.add(pPropertyKey);
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

        // Validate that the identity property is set as field.
        if (!this.mFields.has(pKey)) {
            throw new Exception(`Identity property "${pKey}" is not set as field.`, this);
        }

        // Set table type identity.
        this.mIdentity = {
            key: pKey,
            autoIncrement: pAutoIncrement,
        };
    }

    /**
     * Adds an index to the table layout.
     * 
     * @param pPropertyKeys - Array of property names to be used as index keys. All properties must be set as fields before.
     * @param pIsUnique - Whether the index should enforce uniqueness.
     * @param pMultiEnty - If true, creates a multiEntry index (only allowed for a single property).
     * 
     * @throws {@link Exception} If any property is not set as a field, if the index already exists, or if multiEntry is used with multiple keys.
     */
    public setTableIndex(pPropertyKeys: Array<string>, pIsUnique: boolean, pMultiEnty: boolean): void {
        // Create index name from property keys order of property keys matters.
        const lIndexName: string = pPropertyKeys.join('+');

        // Validate that each property is set as a field.
        for (const lPropertyKey of pPropertyKeys) {
            if (!this.mFields.has(lPropertyKey)) {
                throw new Exception(`Index property "${lPropertyKey}" of index "${lIndexName}" is not set as field.`, this);
            }
        }

        // Validate that index does not already exist.
        if (this.mIndices.has(lIndexName)) {
            throw new Exception(`Index "${lIndexName}" already exists.`, this);
        }

        // Initialize index.
        const lIndexConfig: TableLayoutIndex = {
            name: lIndexName,
            keys: pPropertyKeys as [string],
            unique: pIsUnique,
            type: 'default'
        };

        // Set correct index type.
        if (pMultiEnty) {
            // Restrict multientity when key is not a array or more than one key is set for the same index.
            if (lIndexConfig.keys.length > 1) {
                throw new Exception(`Multi entity index can only have one property.`, this);
            }

            // Set index type to multiEntry.
            lIndexConfig.type = 'multiEntry';
        } else if (lIndexConfig.keys.length > 1) {
            // Set index type to compound when more than one key is set.
            lIndexConfig.type = 'compound';
        }

        // Link index to table config.
        this.mIndices.set(lIndexName, lIndexConfig);
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
    keys: Array<string>;
    unique: boolean;
    type: 'default' | 'multiEntry' | 'compound';
};

export type TableLayoutIdentity = {
    key: string;
    autoIncrement: boolean;
};

export type TableType = IVoidParameterConstructor<object>;