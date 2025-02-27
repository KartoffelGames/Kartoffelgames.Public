import { Dictionary } from "../../../kartoffelgames.core/source/index.ts";
import { InjectionConstructor } from '../type.ts';
import { ConstructorMetadata } from './constructor-metadata.ts';

/**
 * Static.
 * Metadata storage.
 * 
 * @public
 */
export class Metadata {
    private static mMetadataMapping: Dictionary<DecoratorMetadataObject, ConstructorMetadata> = new Dictionary<DecoratorMetadataObject, ConstructorMetadata>();

    /**
     * Initialize metadata.
     * 
     * @param pMetadataObject - Metadata object.
     */
    public static forInternalDecorator(pMetadataObject: DecoratorMetadataObject): ConstructorMetadata {
        return Metadata.mapMetadata(pMetadataObject);
    }

    /**
     * Get metadata of constructor.
     * 
     * @param pTarget - Constructor or decorator metadata object.
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
     * const constructorMeta = Metadata.get(Foo).getMetadata('key');
     * const propertyMeta = Metadata.get(Foo).getProperty('prop').getMetadata('key');
     * ```
     */
    public static get(pTarget: InjectionConstructor): ConstructorMetadata {
        // Check if constructor has a decorator metadata.
        if(!pTarget[Symbol.metadata]) { 
            throw new Error(`Constructor does not have a metadata object. Only classes with decorators initializes a metadata object.`);
        }

        // Read metadata object for constructor.
        const lDecoratorMetadataObject: DecoratorMetadataObject = pTarget[Symbol.metadata]!;

        // Get or create constructor metadata instance.
        return Metadata.mapMetadata(lDecoratorMetadataObject);
    }

    /**
     * Maps a given decorator metadata object to a constructor metadata object.
     * If the metadata object is already mapped, the existing constructor metadata is returned.
     * Otherwise, a new constructor metadata object is created, mapped, and returned.
     *
     * @param pMetadataObject - The decorator metadata object to be mapped.
     * @returns The corresponding constructor metadata object.
     */
    private static mapMetadata(pMetadataObject: DecoratorMetadataObject): ConstructorMetadata {
        // Check if metadata object is already mapped.
        if(Metadata.mMetadataMapping.has(pMetadataObject)) {
            return Metadata.mMetadataMapping.get(pMetadataObject)!;
        }

        // Create new constructor metadata object from decorator metadata.
        const lConstructorMetadata: ConstructorMetadata = new ConstructorMetadata(pMetadataObject);

        // Map metadata object to constructor metadata.
        Metadata.mMetadataMapping.set(pMetadataObject, lConstructorMetadata);

        return lConstructorMetadata;
    }
}