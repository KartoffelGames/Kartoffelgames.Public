import { Dictionary } from '@kartoffelgames/core';
import { InjectionConstructor } from '../type.ts';
import { PropertyMetadata } from './property-metadata.ts';
import { BaseMetadata, MetadataKey } from './base-metadata.ts';

/**
 * Constructor metadata.
 */
export class ConstructorMetadata extends BaseMetadata {
    private static readonly mPrivateMetadataKey: symbol = Symbol('Metadata');

    /**
     * Get metadata of constructor.
     * 
     * @param pConstructor - Constructor.
     * 
     * @returns constructor metadata object of constructor.
     * 
     * @example Adding a new and existing key.
     * ```TypeScript
     * @Injector.Metadata('key', 'value')
     * class Foo {
     *     @Injector.Metadata('key', 'value')
     *     public prop: number;
     * }
     * 
     * const constructorMeta = ConstructorMetadata.fromConstructor(Foo).getMetadata('key');
     * const propertyMeta = ConstructorMetadata.fromConstructor(Foo).getProperty('prop').getMetadata('key');
     * ```
     */
    public static fromMeta(pDecoratorMetadataObject: DecoratorMetadataObject): ConstructorMetadata {
        let lConstructorMetadata: ConstructorMetadata | undefined;

        // Check if metadata is set on this constructor and not inherited from parent.
        if (!Object.hasOwn(pDecoratorMetadataObject, ConstructorMetadata.mPrivateMetadataKey)) {
            // Create new metadata object and assign it to decorator metadata.
            lConstructorMetadata = new ConstructorMetadata(pDecoratorMetadataObject);
            pDecoratorMetadataObject[ConstructorMetadata.mPrivateMetadataKey] = lConstructorMetadata;
        }

        // Get metadata from constructor.
        lConstructorMetadata = pDecoratorMetadataObject[ConstructorMetadata.mPrivateMetadataKey] as ConstructorMetadata;

        return lConstructorMetadata;
    }

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
    public getInheritedMetadata<T>(pMetadataKey: MetadataKey): T | null {
        // Read starting decorator metadata. At this point it should have a metadata object.
        let lDecoratorMetadataObject: DecoratorMetadataObject | null = this.mDecoratorMetadataObject;
        do {
            // Unessary check. But just to be sure.
            if(lDecoratorMetadataObject === null) { 
                continue;
            }

            // Check if metadata is set on this constructor.
            if (Object.hasOwn(lDecoratorMetadataObject, ConstructorMetadata.mPrivateMetadataKey)) {
                // Get metadata from constructor.
                const lConstructorMetadata: ConstructorMetadata = lDecoratorMetadataObject[ConstructorMetadata.mPrivateMetadataKey] as ConstructorMetadata;

                // Check if metadata is set.
                const lMetadataValue: T | null = lConstructorMetadata.getMetadata(pMetadataKey);
                if (lMetadataValue !== null) {
                    return lMetadataValue;
                }
            }

            // Read next metadata object.
            lDecoratorMetadataObject = Object.getPrototypeOf(lDecoratorMetadataObject);
        } while (lDecoratorMetadataObject !== null);

        // No inherited metadata found.
        return null;
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
