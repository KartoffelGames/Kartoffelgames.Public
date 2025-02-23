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
                lDecoratorMetadataObject = Metadata.initOwnMetadata(pTarget);
            }
        } else {
            // Is allready a decorator metadata object.
            lDecoratorMetadataObject = pTarget;
        }

        return ConstructorMetadata.fromMeta(lDecoratorMetadataObject);
    }

    private static initOwnMetadata(pTarget: InjectionConstructor): DecoratorMetadataObject {
        // Create new metadata object.
        const lDecoratorMetadataObject: DecoratorMetadataObject = {};

        // Read parent constructor.
        const pParentConstructor: InjectionConstructor | null = Object.getPrototypeOf(pTarget);
        if(pParentConstructor !== null && pParentConstructor !== Object){
            // Set metadata of parent as prototype of current metadata object.
            const lParentMetadata = Metadata.initOwnMetadata(pParentConstructor)
            Object.setPrototypeOf(lDecoratorMetadataObject, lParentMetadata)
        }

        // Assign metadata object to constructor.
        pTarget[Symbol.metadata] = lDecoratorMetadataObject;

        return lDecoratorMetadataObject
    }
}