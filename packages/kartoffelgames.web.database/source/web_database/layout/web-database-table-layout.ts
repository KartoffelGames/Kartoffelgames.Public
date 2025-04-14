import { Exception, type IVoidParameterConstructor } from '@kartoffelgames/core';
import { type InjectionConstructor, Metadata } from '@kartoffelgames/core-dependency-injection';

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

    private readonly mIdentity: TableLayoutIdentity;
    private readonly mIndices: Map<string, TableLayoutIndex>;

    /**
     * Get all indices of the table type.
     */
    public get identity(): TableLayoutIdentity {
        return this.mIdentity;
    }

    /**
     * Get all indices of the table type.
     */
    public get indices(): Array<string> { 
        return Array.from(this.mIndices.keys());
    }

    /**
     * Constructor.
     */
    public constructor() {
        // Set default "hidden" identity setting. 
        this.mIdentity = {
            key: '__ID__',
            autoIncrement: true,
            configurated: false
        };
        this.mIndices = new Map<string, TableLayoutIndex>();
    }

    /**
     * Get table type index by name.
     * 
     * @param pName - Index name.
     * 
     * @returns Table type index or undefined when not found.
     */
    public index(pName: string): TableLayoutIndex | undefined {
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
        if (this.mIdentity.configurated) {
            throw new Exception(`A table type can only have one identifier.`, this);
        }

        // Set table type identity.
        this.mIdentity.key = pKey;
        this.mIdentity.autoIncrement = pAutoIncrement;
        this.mIdentity.configurated = true;
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
    public setTableIndex(pPropertyKey: string, pIndexName: string, pIsUnique: boolean, pMultiEnty: boolean): void {
        // Initialize index.
        let lIndexConfig: TableLayoutIndex | undefined = this.mIndices.get(pIndexName);
        if (!lIndexConfig) {
            // Set default configuration where anything is enabled.
            lIndexConfig = {
                name: pIndexName,
                keys: new Array<string>(),
                options: {
                    unique: true,
                    multiEntity: pMultiEnty
                }
            };

            // Link index to table config.
            this.mIndices.set(pIndexName, lIndexConfig);
        }

        // Add key to index.
        lIndexConfig.keys.push(pPropertyKey);

        // Disable multientity when key is not a array or more than one key is set for the same index.
        if (lIndexConfig.keys.length > 1 && pMultiEnty) {
            throw new Exception(`Multientity index can only have one key.`, this);
        }

        // Index is not unique when one index is not unique.
        if (!pIsUnique) {
            lIndexConfig.options.unique = false;
        }
    }
}

export type TableLayoutIndex = {
    name: string;
    keys: Array<string>;
    options: {
        unique: boolean;
        /**
         * Set when single key is an array.
         */
        multiEntity: boolean;
    };
};

export type TableLayoutIdentity = {
    key: string;
    autoIncrement: boolean;
    configurated: boolean;
};

export type TableType = IVoidParameterConstructor<object>;