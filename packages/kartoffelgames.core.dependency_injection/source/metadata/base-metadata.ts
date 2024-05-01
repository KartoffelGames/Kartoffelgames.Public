import { Dictionary } from '@kartoffelgames/core.data';
import { InjectionConstructor } from '../type';

/**
 * Base metadata information for classes and properties.
 */
export class BaseMetadata {
    private readonly mConstructor: InjectionConstructor;
    private readonly mCustomMetadata: Dictionary<string, any>;

    /**
     * Constructor where all metadata are attached.
     */
    protected get injectionConstructor(): InjectionConstructor {
        return this.mConstructor;
    }

    /**
     * Constructor.
     * Initialize lists.
     * 
     * @param pConstructor - Constructor where all metadata are attached.
     */
    public constructor(pConstructor: InjectionConstructor) {
        this.mConstructor = pConstructor;
        this.mCustomMetadata = new Dictionary<string, any>();
    }

    /**
     * Get metadata of constructor.
     * @param pMetadataKey - Metadata key.
     */
    public getMetadata<T>(pMetadataKey: string): T {
        return this.mCustomMetadata.get(pMetadataKey) ?? null;
    }

    /**
     * Set metadata of constructor.
     * @param pMetadataKey - Metadata key.
     * @param pMetadataValue - Metadata value.
     */
    public setMetadata<T>(pMetadataKey: string, pMetadataValue: T): void {
        this.mCustomMetadata.set(pMetadataKey, pMetadataValue);
    }
}