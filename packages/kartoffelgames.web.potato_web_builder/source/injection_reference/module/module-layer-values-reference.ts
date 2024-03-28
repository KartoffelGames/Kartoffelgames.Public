/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */

import { Exception } from '@kartoffelgames/core.data';
import { LayerValues } from '../../component/values/layer-values';

/**
 * Module Layer value reference.
 * Acts as injection reference but the actual Layer value should be injected instead.
 * 
 * Should never be initialized.
 */
export class ModuleLayerValuesReference {
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

export declare interface ModuleLayerValuesReference extends LayerValues { }