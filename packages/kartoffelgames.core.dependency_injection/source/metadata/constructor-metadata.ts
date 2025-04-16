import { Dictionary } from '@kartoffelgames/core';
import { BaseMetadata, type MetadataKey } from './base-metadata.ts';
import { PropertyMetadata } from './property-metadata.ts';

/**
 * Constructor metadata.
 */
export class ConstructorMetadata extends BaseMetadata {
    private static readonly mPrivateMetadataKey: symbol = Symbol('Metadata');

    private readonly mDecoratorMetadataObject: DecoratorMetadataObject;
    private readonly mPropertyMetadata: Dictionary<PropertyKey, PropertyMetadata>;

    /**
     * Constructor.
     * Initialize lists.
     * 
     * @param pDecoratorMetadataObject - Constructor where all metadata should be attached.
     */
    public constructor(pDecoratorMetadataObject: DecoratorMetadataObject) {
        super();

        this.mDecoratorMetadataObject = pDecoratorMetadataObject;
        this.mPropertyMetadata = new Dictionary<PropertyKey, PropertyMetadata>();

        // Attach constructor metadata to decorator metadata object.
        pDecoratorMetadataObject[ConstructorMetadata.mPrivateMetadataKey] = this;
    }

    /**
     * Get metadata of constructor.
     * Searches for metadata in inheritance chain.
     * 
     * @param pMetadataKey - Metadata key.
     * 
     * @typeParam T - Expected type of metadata value. 
     * 
     * @returns set metadata or null when no metadata was attached.
     */
    public getInheritedMetadata<T>(pMetadataKey: MetadataKey): Array<T> {
        const lInheritedMetadata: Array<T> = new Array<T>();

        // Read starting decorator metadata. At this point it should have a metadata object.
        let lDecoratorMetadataObject: DecoratorMetadataObject | null = this.mDecoratorMetadataObject;
        do {
            // Check if metadata is set on this constructor.
            if (Object.hasOwn(lDecoratorMetadataObject, ConstructorMetadata.mPrivateMetadataKey)) {
                // Get metadata from constructor.
                const lConstructorMetadata: ConstructorMetadata = lDecoratorMetadataObject[ConstructorMetadata.mPrivateMetadataKey] as ConstructorMetadata;

                // Check if metadata is set.
                const lMetadataValue: T | null = lConstructorMetadata.getMetadata(pMetadataKey);
                if (lMetadataValue !== null) {
                    lInheritedMetadata.push(lMetadataValue);
                }
            }

            // Read next metadata object.
            lDecoratorMetadataObject = Object.getPrototypeOf(lDecoratorMetadataObject);
        } while (lDecoratorMetadataObject !== null);

        // Reverse array to send data order from Parent to Child.
        return lInheritedMetadata.reverse();
    }

    /**
     * Get property by key.
     * Creates new property metadata if it not already exists.
     * 
     * @param pPropertyKey - Key of property.
     */
    public getProperty(pPropertyKey: PropertyKey): PropertyMetadata {
        // Create new property mapping when no mapping is found.
        if (!this.mPropertyMetadata.has(pPropertyKey)) {
            this.mPropertyMetadata.add(pPropertyKey, new PropertyMetadata());
        }

        return <PropertyMetadata>this.mPropertyMetadata.get(pPropertyKey);
    }
}
