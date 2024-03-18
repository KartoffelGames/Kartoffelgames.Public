import { Exception } from '@kartoffelgames/core.data';

/**
 * Module value reference.
 * Acts as injection reference but the actual value string should be injected instead.
 * 
 * Should never be initialized.
 */
export class ModuleValueReference extends String  {
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