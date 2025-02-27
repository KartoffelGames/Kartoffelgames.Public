import { Injectable } from './decorator/injectable.decorator.ts';
import { InjectableSingleton } from './decorator/injectable-singleton.decorator.ts';

export class Injector {
    /**
     * AtScript.
     * Mark class to be injectable as an instanced object.
     * 
     * @param pConstructor - Constructor.
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly Injectable = Injectable;

    /**
     * AtScript.
     * Mark class to be injectable as an singleton object.
     * 
     * @param pConstructor - Constructor.
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly InjectableSingleton = InjectableSingleton;
}