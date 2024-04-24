/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */

import { Exception } from '@kartoffelgames/core.data';
import { BaseModule } from '../../../module/base-module';
import { IPwbModuleProcessor } from '../../../interface/module.interface';

/**
 * Module reference.
 * Acts as injection reference but the actual module should be injected instead.
 * 
 * Should never be initialized.
 */
export class ModuleReference {
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

export declare interface ModuleReference extends BaseModule<Node, IPwbModuleProcessor> { }