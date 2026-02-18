import type { PropertyMetaDescriptor } from './property-meta-type.ts';

/**
 * Accumulates property meta descriptors for a single class.
 * Stores which properties have UI meta annotations and their descriptors.
 */
export class PropertyMetaMetadata {
    private readonly mProperties: Map<string, PropertyMetaDescriptor>;

    /**
     * Get all property names that have a property meta descriptor.
     */
    public get propertyNames(): Array<string> {
        return new Array(...this.mProperties.keys());
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mProperties = new Map<string, PropertyMetaDescriptor>();
    }

    /**
     * Add a property meta descriptor for a property.
     *
     * @param pPropertyName - The string key of the property.
     * @param pDescriptor - The property meta descriptor.
     */
    public addProperty(pPropertyName: string, pDescriptor: PropertyMetaDescriptor): void {
        this.mProperties.set(pPropertyName, pDescriptor);
    }

    /**
     * Get the property meta descriptor for a specific property.
     *
     * @param pPropertyName - The property key.
     *
     * @returns the property meta descriptor.
     */
    public getDescriptor(pPropertyName: string): PropertyMetaDescriptor {
        return this.mProperties.get(pPropertyName)!;
    }
}
