import { Dictionary } from '@kartoffelgames/core.data';
import { DecorationReplacementHistory } from '../decoration-history/decoration-history';
import { InjectionConstructor } from '../type';
import { ConstructorMetadata } from './constructor-metadata';

/**
 * Static.
 * Metadata storage.
 */
export class Metadata {
    private static readonly mConstructorMetadata: Dictionary<InjectionConstructor, ConstructorMetadata> = new Dictionary<InjectionConstructor, ConstructorMetadata>();

    /**
     * Get metadata of constructor.
     */
    public static get(pConstructor: InjectionConstructor): ConstructorMetadata {
        // Use root constructor to register metadata information.
        const lRegisteredConstructor: InjectionConstructor = DecorationReplacementHistory.getOriginalOf(pConstructor);

        // Create new or get metadata.
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