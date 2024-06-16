import { IDeconstructable } from '@kartoffelgames/core.data';
import { InjectionHierarchyParent } from '../injection/injection-hierarchy-parent';
import { ModuleConstructorReference } from '../injection/references/module/module-constructor-reference';
import { ModuleReference } from '../injection/references/module/module-reference';
import { IPwbModuleProcessor, IPwbModuleProcessorConstructor } from '../interface/module.interface';

export abstract class BaseModule<TModuleProcessor extends IPwbModuleProcessor> extends InjectionHierarchyParent<TModuleProcessor> implements IDeconstructable {
    /**
     * Constructor.
     * @param pParameter - Parameter.
     */
    constructor(pParameter: BaseModuleConstructorParameter) {
        super(pParameter.constructor, pParameter.parent);

        // Create module injection mapping.
        this.setProcessorAttributes(ModuleConstructorReference, pParameter.constructor);
        this.setProcessorAttributes(ModuleReference, this);
    }

    /**
     * Deconstruct module.
     */
    public override deconstruct(): void {
        // Deconstruct extensions.
        super.deconstruct();

        // Deconstruct modules.
        if ('onDeconstruct' in this.processor && typeof this.processor.onDeconstruct === 'function') {
            this.processor.onDeconstruct();
        }
    }

    /**
     * Update module.
     * 
     * @returns True when any update happened, false when all values stayed the same.
     */
    public override update(): boolean {
        // Update extensions first.
        super.update();

        // Then update module.
        return this.onUpdate();
    }

    /**
     * Update module.
     * 
     * @returns True when any update happened, false when all values stayed the same.
     */
    protected abstract onUpdate(): boolean;
}

export type BaseModuleConstructorParameter = {
    parent: InjectionHierarchyParent,
    constructor: IPwbModuleProcessorConstructor<IPwbModuleProcessor>,
};