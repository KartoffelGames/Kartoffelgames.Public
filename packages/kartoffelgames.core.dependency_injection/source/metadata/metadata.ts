import { InjectionConstructor } from '../type.ts';
import { ConstructorMetadata } from './constructor-metadata.ts';

/**
 * Static.
 * Metadata storage.
 * 
 * @public
 */
export class Metadata {
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
    public static get(pTarget: InjectionConstructor | DecoratorMetadataObject): ConstructorMetadata {
        // Get metadata object.
        let lDecoratorMetadataObject: DecoratorMetadataObject | null;
        if (typeof pTarget === 'function') {
            // Read metadata from constructor.
            lDecoratorMetadataObject = pTarget[Symbol.metadata];
            if (!lDecoratorMetadataObject) {
                throw new Error(`No metadata found on constructor.`);
            }
        } else {
            // Is allready a decorator metadata object.
            lDecoratorMetadataObject = pTarget;
        }

        return ConstructorMetadata.fromMeta(lDecoratorMetadataObject);
    }
}