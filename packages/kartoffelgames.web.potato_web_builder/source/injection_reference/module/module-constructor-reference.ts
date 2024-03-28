/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */

import { Exception } from '@kartoffelgames/core.data';

/**
 * Module constructor reference.
 * Acts as injection reference but the actual constructor function should be injected instead.
 * 
 * Should never be initialized.
 */
export class ModuleConstructorReference {
    /**
     * Constructor. Allways throws exception.
     * 
     * @throws {@link Exception}
     * Allways.
     */
    public constructor() {
        throw new Exception('Reference should not be instanced.', this);
    }
}

// eslint-disable-next-line @typescript-eslint/ban-types
export declare interface ModuleConstructorReference extends Function { }