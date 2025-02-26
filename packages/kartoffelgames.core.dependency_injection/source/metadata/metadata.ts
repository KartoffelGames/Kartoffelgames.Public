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
    private static mMetadataMapping: Dictionary<InjectionConstructor, DecoratorMetadataObject> = new Dictionary<InjectionConstructor, DecoratorMetadataObject>();

    /**
     * Initialize metadata.
     * 
     * @param pTarget - Constructor or decorator metadata object.
     * @param pMetadata - Metadata object.
     */
    public static init(pTarget: InjectionConstructor, pMetadata: DecoratorMetadataObject): void {
        Metadata.mMetadataMapping.set(pTarget, pMetadata);
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
        if(!Metadata.mMetadataMapping.has(pTarget)) {
            throw new Error(`Metadata not initialized for ${pTarget.name}.`);
        }

        // Read metadata object for constructor.
        const lDecoratorMetadataObject: DecoratorMetadataObject  = Metadata.mMetadataMapping.get(pTarget)!;

        // Create new metadata constructor instance.
        return new ConstructorMetadata(lDecoratorMetadataObject);
    }
}