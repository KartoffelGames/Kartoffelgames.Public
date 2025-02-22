import { Dictionary } from '@kartoffelgames/core';
import { InjectionConstructor } from '../type.ts';


/**
 * Base metadata information for classes and properties.
 */
export class BaseMetadata {
    private readonly mCustomMetadata: Dictionary<string, any>;

    /**
     * Constructor.
     * Initialize lists.
     * 
     * @param pConstructor - Constructor where all metadata should be attached.
     * @param pPropertyKey - Key of property where all metadata should be attached.
     */
    public constructor() {
        this.mCustomMetadata = new Dictionary<string, any>();
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
    public getMetadata<T>(pMetadataKey: string): T | null {
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
    public setMetadata<T>(pMetadataKey: string, pMetadataValue: T): void {
        this.mCustomMetadata.set(pMetadataKey, pMetadataValue);
    }
}