import { Exception } from '@kartoffelgames/core.data';

/**
 * Target node reference.
 * Acts as injection reference but the actual target node should be injected instead.
 * 
 * Should never be initialized.
 */
export class ModuleTargetNodeReference extends Node {
    /**
     * Constructor. Allways throws exception.
     * 
     * @throws {@link Exception}
     * Allways.
     */
    constructor() {
        super();

        throw new Exception('Reference should not be instanced.', this);
    }
}