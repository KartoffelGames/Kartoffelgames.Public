import { Dictionary } from '@kartoffelgames/core';
import { DecorationReplacementHistory } from '../decoration-history/decoration-history';
import { InjectionConstructor } from '../type';
import { ConstructorMetadata } from './constructor-metadata';

/**
 * Static.
 * Metadata storage.
 * 
 * @public
 */
export class Metadata {
    private static readonly mConstructorMetadata: Dictionary<InjectionConstructor, ConstructorMetadata> = new Dictionary<InjectionConstructor, ConstructorMetadata>();

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
        // Use root constructor to register metadata information.
        const lRegisteredConstructor: InjectionConstructor = DecorationReplacementHistory.getOriginalOf(pConstructor);

        // Create new or read existing metadata.
        let lMetadata: ConstructorMetadata;
        if (this.mConstructorMetadata.has(lRegisteredConstructor)) {
            lMetadata = <ConstructorMetadata>Metadata.mConstructorMetadata.get(lRegisteredConstructor);
        } else {
            lMetadata = new ConstructorMetadata(lRegisteredConstructor);
            Metadata.mConstructorMetadata.add(lRegisteredConstructor, lMetadata);
        }

        return lMetadata;
    }
}