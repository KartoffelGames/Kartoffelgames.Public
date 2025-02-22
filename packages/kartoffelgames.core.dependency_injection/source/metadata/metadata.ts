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
     * const constructorMeta = Metadata.get(Foo).getMetadata('key');
     * const propertyMeta = Metadata.get(Foo).getProperty('prop').getMetadata('key');
     * ```
     */
    public static get(pConstructor: InjectionConstructor): ConstructorMetadata {
        return ConstructorMetadata.fromConstructor(pConstructor);
    }
}