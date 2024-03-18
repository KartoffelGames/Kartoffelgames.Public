import { Exception } from '@kartoffelgames/core.data';

/**
 * Module key reference.
 * Acts as injection reference but the actual key string should be injected instead.
 * 
 * Should never be initialized.
 */
export class ModuleKeyReference extends String {
    /**
     * Constructor. Allways throws exception.
     * 
     * @throws {@link Exception}
     * Allways.
     */
    public constructor() {
        super();

        throw new Exception('Reference should not be instanced.', this);
    }
}
