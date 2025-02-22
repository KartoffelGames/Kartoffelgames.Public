import { Dictionary } from '@kartoffelgames/core';

/**
 * Base metadata information for classes and properties.
 */
export class BaseMetadata {
    private readonly mCustomMetadata: Dictionary<MetadataKey, any>;

    /**
     * Constructor.
     * Initialize lists.
     * 
     * @param pConstructor - Constructor where all metadata should be attached.
     * @param pPropertyKey - Key of property where all metadata should be attached.
     */
    public constructor() {
        this.mCustomMetadata = new Dictionary<MetadataKey, any>();
    }

    /**
     * Get metadata of constructor or property.
     * 
     * @param pMetadataKey - Metadata key.
     * 
     * @typeParam T - Expected type of metadata value. 
     * 
     * @returns set metadata or null when no metadata was attached.
     */
    public getMetadata<T>(pMetadataKey: MetadataKey): T | null {
        return this.mCustomMetadata.get(pMetadataKey) ?? null;
    }

    /**
     * Set metadata of constructor or property.
     * 
     * @param pMetadataKey - Metadata key.
     * @param pMetadataValue - Metadata value.
     * 
     * @typeParam T - Type of metadata value. 
     */
    public setMetadata<T>(pMetadataKey: MetadataKey, pMetadataValue: T): void {
        this.mCustomMetadata.set(pMetadataKey, pMetadataValue);
    }
}

export type MetadataKey = string | symbol | number;