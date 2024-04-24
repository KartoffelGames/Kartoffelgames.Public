/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */

import { Exception } from '@kartoffelgames/core.data';
import { ComponentElement } from '../../../interface/component.interface';

/**
 * Component element reference.
 * Acts as injection reference but the actual component node should be injected instead.
 * 
 * Should never be initialized.
 */
export class ComponentElementReference {
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

// eslint-disable-next-line @typescript-eslint/ban-types
export declare interface ComponentElementReference extends HTMLElement, ComponentElement { }