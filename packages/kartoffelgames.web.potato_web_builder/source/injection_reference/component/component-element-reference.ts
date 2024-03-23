import { Exception } from '@kartoffelgames/core.data';

/**
 * Component element reference.
 * Acts as injection reference but the actual component node should be injected instead.
 * 
 * Should never be initialized.
 */
export class ComponentElementReference extends HTMLElement {
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