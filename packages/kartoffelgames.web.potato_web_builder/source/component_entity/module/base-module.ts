import { IDeconstructable } from '@kartoffelgames/core.data';
import { BaseComponentEntity } from '../base-component-entity';
import { ModuleConstructorReference } from '../injection-reference/module/module-constructor-reference';
import { ModuleReference } from '../injection-reference/module/module-reference';

export abstract class BaseModule<TModuleProcessor extends IPwbModuleProcessor> extends BaseComponentEntity<TModuleProcessor> implements IDeconstructable {
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
    parent: BaseComponentEntity,
    constructor: IPwbModuleProcessorConstructor<IPwbModuleProcessor>,
};

// Base.
export interface IPwbModuleProcessor { }
export interface IPwbModuleProcessorConstructor<T extends IPwbModuleProcessor> {
    new(...args: Array<any>): T;
}

export interface IPwbModuleOnUpdate<TUpdateResult> {
    /**
     * Called on update.
     */
    onUpdate(): TUpdateResult;
}

export interface IPwbModuleOnDeconstruct {
    /**
     * Cleanup events and other data that does not delete itself.
     */
    onDeconstruct(): void;
}
