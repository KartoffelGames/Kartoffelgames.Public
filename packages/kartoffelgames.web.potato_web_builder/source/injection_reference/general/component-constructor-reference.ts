import { Exception } from '@kartoffelgames/core.data';

/**
 * Component constructor reference.
 * Acts as injection reference but the actual constructor function should be injected instead.
 * 
 * Should never be initialized.
 */
export class ComponentConstructorReference extends Function {
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
