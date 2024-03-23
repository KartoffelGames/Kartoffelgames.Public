import { Exception } from '@kartoffelgames/core.data';
import { BaseModule } from '../../module/base-module';
import { IPwbModuleProcessor } from '../../interface/module.interface';

/**
 * Module reference.
 * Acts as injection reference but the actual module should be injected instead.
 * 
 * Should never be initialized.
 */
export class ModuleReference extends BaseModule<Node, IPwbModuleProcessor> {
    /**
     * Constructor. Allways throws exception.
     * 
     * @throws {@link Exception}
     * Allways.
     */
    public constructor() {
        super({} as any);
        throw new Exception('Reference should not be instanced.', this);
    }

    /**
     * Update linked targets of module
     * 
     * @throws {@link Error}
     * Allways. Because it is not ment to be called.
     */
    public override update(): boolean {
        throw new Error('Method not implemented.');
    }
}
