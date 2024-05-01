import { Dictionary } from '@kartoffelgames/core.data';
import { InjectionConstructor } from '../type';
import { PropertyMetadata } from './property-metadata';

/**
 * Constructor metadata.
 */
export class ConstructorMetadata {
    private readonly mCustomMetadata: Dictionary<string, any>;
    private readonly mPropertyMetadata: Dictionary<string | symbol, PropertyMetadata>;

    /**
     * Get parameter type information.
     */
    public get parameterTypes(): Array<InjectionConstructor> | null {
        return this.getMetadata<Array<InjectionConstructor>>('design:paramtypes');
    }

    /**
     * Constructor.
     * Initialize lists.
     */
    public constructor() {
        this.mCustomMetadata = new Dictionary<string, any>();
        this.mPropertyMetadata = new Dictionary<string | symbol, PropertyMetadata>();
    }

    /**
     * Get metadata of constructor.
     * @param pMetadataKey - Metadata key.
     */
    public getMetadata<T>(pMetadataKey: string): T | null {
        return this.mCustomMetadata.get(pMetadataKey) ?? null;
    }

    /**
     * Get property by key.
     * Creates new property metadata if it not already exists.
     * @param pPropertyKey - Key of property.
     */
    public getProperty(pPropertyKey: string | symbol): PropertyMetadata {
        // Create if missing.
        if (!this.mPropertyMetadata.has(pPropertyKey)) {
            this.mPropertyMetadata.add(pPropertyKey, new PropertyMetadata());
        }

        return <PropertyMetadata>this.mPropertyMetadata.get(pPropertyKey);
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