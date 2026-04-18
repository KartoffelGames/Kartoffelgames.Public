import { Injection } from '@kartoffelgames/core-dependency-injection';
import { ComponentDataLevel } from '../../core/data/component-data-level.ts';
import { AccessMode } from '../../core/enum/access-mode.enum.ts';

import { PwbAttributeModule } from '../../core/module/attribute_module/pwb-attribute-module.decorator.ts';
import { ModuleAttribute } from '../../core/module/injection_reference/module-attribute.ts';
import { ModuleTargetNode } from '../../core/module/injection_reference/module-target-node.ts';

/**
 * Used with "#IdChildName" like - #PasswordInput.
 */
@PwbAttributeModule({
    access: AccessMode.Write,
    selector: /^#[[\w$]+$/
})
export class PwbChildAttributeModule {
    /**
     * Constructor.
     * @param pTargetNode - Target element.
     * @param pModuleAttribute - Module attribute.
     * @param pComponentScopeValue - Root values of component.
     */
    public constructor(pTargetNode = Injection.use(ModuleTargetNode), pModuleAttribute = Injection.use(ModuleAttribute), pComponentScopeValue = Injection.use(ComponentDataLevel)) {
        // Add current html element to temporary root values. Delete starting #.
        pComponentScopeValue.setTemporaryValue(pModuleAttribute.name.substring(1), pTargetNode);
    }
}