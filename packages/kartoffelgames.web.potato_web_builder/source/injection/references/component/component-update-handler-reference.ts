/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */

import { Exception } from '@kartoffelgames/core.data';
import { UpdateHandler } from '../../../component/handler/update-handler';

/**
 * Updatehandler reference.
 * Acts as injection reference but the actual UpdateHandler should be injected instead.
 * 
 * Should never be initialized.
 */
export class ComponentUpdateHandlerReference {
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

export declare interface ComponentUpdateHandlerReference extends UpdateHandler { }