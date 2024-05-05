import { Dictionary } from '@kartoffelgames/core.data';
import { InjectionConstructor } from '../type';
import { PropertyMetadata } from './property-metadata';
import { BaseMetadata } from './base-metadata';

/**
 * Constructor metadata.
 */
export class ConstructorMetadata extends BaseMetadata {
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
     * 
     * @param pConstructor - Constructor where all metadata should be attached.
     */
    public constructor(pConstructor: InjectionConstructor) {
        super(pConstructor, null);

        this.mPropertyMetadata = new Dictionary<string | symbol, PropertyMetadata>();
    }

    /**
     * Get property by key.
     * Creates new property metadata if it not already exists.
     * 
     * @param pPropertyKey - Key of property.
     */
    public getProperty(pPropertyKey: string | symbol): PropertyMetadata {
        // Create new property mapping when no mapping is found.
        if (!this.mPropertyMetadata.has(pPropertyKey)) {
            this.mPropertyMetadata.add(pPropertyKey, new PropertyMetadata(this.injectionConstructor, pPropertyKey));
        }

        return <PropertyMetadata>this.mPropertyMetadata.get(pPropertyKey);
    }
}