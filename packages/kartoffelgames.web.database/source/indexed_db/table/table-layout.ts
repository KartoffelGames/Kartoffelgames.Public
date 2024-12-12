import { Dictionary, Exception, IVoidParameterConstructor } from '@kartoffelgames/core';

/**
 * Singleton. Table layout and settings.
 */
export class TableLayout {
    private static mInstance: TableLayout;

    private readonly mTableConfigs!: Dictionary<TableType, TableLayoutConfig>;

    /**
     * Constructor.
     */
    public constructor() {
        if (TableLayout.mInstance) {
            return TableLayout.mInstance;
        }

        TableLayout.mInstance = this;

        // Init lists.
        this.mTableConfigs = new Dictionary<TableType, TableLayoutConfig>();
    }

    /**
     * Get table configuration of type.
     * 
     * @param pType - Table type.
     * 
     * @returns table type config. 
     */
    public configOf(pType: TableType): TableLayoutConfig {
        // Table type is not initialized.
        if (!this.mTableConfigs.has(pType)) {
            throw new Exception('Table type not defined.', this);
        }

        return this.mTableConfigs.get(pType)!;
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
    public setTableIdentity(pType: TableType, pKey: string, pAutoIncrement: boolean): void {
        // Initialize table type.
        this.initializeTableType(pType);

        // Read table config and restrict to one identity.
        const lTableConfig: TableLayoutConfig = this.mTableConfigs.get(pType)!;
        if (lTableConfig.identity) {
            throw new Exception(`A table type can only have one identifier.`, this);
        }

        // Set table type identity.
        lTableConfig.identity = {
            key: pKey,
            autoIncrement: pAutoIncrement
        };
    }

    /**
     * Set table type identity.
     * 
     * @param pType - Table type.
     * @param pKey - Key of identity.
     * @param pName - Index name.
     * @param pIsArray - Property is key.
     * @param pIsUnique - Index should be unique.
     */
    public setTableIndex(pType: TableType, pKey: string, pName: string, pIsArray: boolean, pIsUnique: boolean): void {
        // Initialize table type.
        this.initializeTableType(pType);

        // Read table config.
        const lTableConfig: TableLayoutConfig = this.mTableConfigs.get(pType)!;

        // Initialize index.
        let lIndexConfig: TableLayoutConfigIndex | undefined = lTableConfig.indices.get(pName);
        if (!lIndexConfig) {
            // Set default configuration where anything is enabled.
            lIndexConfig = {
                name: pName,
                keys: new Array<string>(),
                options: {
                    unique: true,
                    multiEntity: true
                }
            };

            // Link index to table config.
            lTableConfig.indices.set(pName, lIndexConfig);
        }

        // Add key to index.
        lIndexConfig.keys.push(pKey);

        // Disable multientiy when key is not a array or more than one key is set for the same index.
        if (lIndexConfig.keys.length > 1 || !pIsArray) {
            lIndexConfig.options.multiEntity = false;
        }

        // Index is not unique when one index is not unique.
        if (!pIsUnique) {
            lIndexConfig.options.unique = false;
        }
    }

    /**
     * Initialize table type.
     * Does nothing when the type is allready initialized.
     * 
     * @param pType - Table type.
     */
    private initializeTableType(pType: TableType): void {
        // Table type is allready initialized.
        if (this.mTableConfigs.has(pType)) {
            return;
        }

        // Add type reference.
        this.mTableConfigs.set(pType, {
            indices: new Dictionary<string, TableLayoutConfigIndex>()
        });
    }
}

type TableLayoutConfigIndex = {
    name: string;
    keys: Array<string>;
    options: {
        unique: boolean;
        multiEntity: boolean; // Set when single key is an array.
    };
};

export type TableLayoutConfig = {
    identity?: {
        key: string;
        autoIncrement: boolean;
    },
    indices: Dictionary<string, TableLayoutConfigIndex>;
};

export type TableType = IVoidParameterConstructor<object>;