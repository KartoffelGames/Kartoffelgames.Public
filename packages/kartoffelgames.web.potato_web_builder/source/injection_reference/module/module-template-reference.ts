import { Exception } from '@kartoffelgames/core.data';
import { BasePwbTemplateNode } from '../../component/template/nodes/base-pwb-template-node';

/**
 * Template reference.
 * Acts as injection reference but the actual template should be injected instead.
 * 
 * Should never be initialized.
 */
export class ModuleTemplateReference extends BasePwbTemplateNode {
    /**
     * Constructor. Allways throws exception.
     * 
     * @throws {@link Exception}
     * Allways.
     */
    public constructor() {
        super();

        throw new Exception('Reference should not be instanced.', this);
    }

    /**
     * Clone node.
     * 
     * @throws {@link Error}
     * Allways. Because it is not ment to be called.
     */
    public override clone(): BasePwbTemplateNode {
        throw new Error('Method not implemented.');
    }

    /**
     * Compare two nodes..
     * 
     * @throws {@link Error}
     * Allways. Because it is not ment to be called.
     */
    public override equals(_pBaseNode: BasePwbTemplateNode): boolean {
        throw new Error('Method not implemented.');
    }
}