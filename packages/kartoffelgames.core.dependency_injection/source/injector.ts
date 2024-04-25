import { Injectable } from './decorator/injectable.decorator';
import { InjectableSingleton } from './decorator/injectable-singleton.decorator';
import { AddMetadata } from './decorator/add-metadata.decorator';

export class Injector {
    /**
     * AtScript.
     * Mark class to be injectable as an instanced object.
     * @param pConstructor - Constructor.
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly Injectable = Injectable;

    /**
     * AtScript.
     * Mark class to be injectable as an singleton object.
     * @param pConstructor - Constructor.
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly InjectableSingleton = InjectableSingleton;

    /**
     * AtScript.
     * Add metadata to class, method, accessor or property
     * @param pMetadataKey - Key of metadata.
     * @param pMetadataValue - Value of metadata.
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly Metadata = AddMetadata;
}