/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */

import { Exception } from '@kartoffelgames/core.data';

/**
 * Target node reference.
 * Acts as injection reference but the actual target node should be injected instead.
 * 
 * Should never be initialized.
 */
export class ModuleTargetNodeReference {
    /**
     * Constructor. Allways throws exception.
     * 
     * @throws {@link Exception}
     * Allways.
     */
    constructor() {
        throw new Exception('Reference should not be instanced.', this);
    }
}

export declare interface ModuleTargetNodeReference extends Node { }