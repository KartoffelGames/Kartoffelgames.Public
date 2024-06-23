/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */

import { Exception } from '@kartoffelgames/core.data';
import { BasePwbTemplateNode } from '../../component/template/nodes/base-pwb-template-node';

/**
 * Template reference.
 * Acts as injection reference but the actual template should be injected instead.
 * 
 * Should never be initialized.
 */
export class ModuleTemplate {
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

export declare interface ModuleTemplate extends BasePwbTemplateNode { }