/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */

import { Exception } from '@kartoffelgames/core.data';
import { ScopedValues } from '../../scoped-values';

/**
 * Component scoped value reference.
 * Acts as injection reference but the actual scoped values should be injected instead.
 * 
 * Should never be initialized.
 */
export class ComponentValuesReference {
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

export declare interface ComponentValuesReference extends ScopedValues { }