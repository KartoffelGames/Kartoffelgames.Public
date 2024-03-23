import { Exception } from '@kartoffelgames/core.data';
import { ComponentElement } from '../../interface/component.interface';
import { Component } from '../../component/component';

/**
 * Component element reference.
 * Acts as injection reference but the actual component node should be injected instead.
 * 
 * Should never be initialized.
 */
export class ComponentElementReference extends HTMLElement implements ComponentElement {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public readonly __component__: Component;

    /**
     * Constructor. Allways throws exception.
     * 
     * @throws {@link Exception}
     * Allways.
     */
    constructor() {
        super();
        this.__component__ = null as any;

        throw new Exception('Reference should not be instanced.', this);
    }


}