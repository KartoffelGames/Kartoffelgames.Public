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
     * @param pConstructor - Constructor where all metadata are attached.
     */
    public constructor(pConstructor: InjectionConstructor) {
        super(pConstructor);

        this.mPropertyMetadata = new Dictionary<string | symbol, PropertyMetadata>();
    }

    /**
     * Get property by key.
     * Creates new property metadata if it not already exists.
     * @param pPropertyKey - Key of property.
     */
    public getProperty(pPropertyKey: string | symbol): PropertyMetadata {
        // Create if missing.
        if (!this.mPropertyMetadata.has(pPropertyKey)) {
            this.mPropertyMetadata.add(pPropertyKey, new PropertyMetadata(this.injectionConstructor));
        }

        return <PropertyMetadata>this.mPropertyMetadata.get(pPropertyKey);
    }
}