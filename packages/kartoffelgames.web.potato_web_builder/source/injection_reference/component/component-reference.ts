/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */

import { Exception } from '@kartoffelgames/core.data';
import { Component } from '../../component/component';

/**
 * Component reference.
 * Acts as injection reference but the actual component should be injected instead.
 * 
 * Should never be initialized.
 */
export class ComponentReference {
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

export declare interface ComponentReference extends Component { }