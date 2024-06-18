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
        super({
            processorConstructor: pParameter.constructor,
            parent: pParameter.parent,
            manualUpdate: true,
            isolatedInteraction: false,
            includeExtensions: pParameter.includeExtensions,
            trackProcessor: false
        });

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
}

export type BaseModuleConstructorParameter = {
    parent: BaseComponentEntity;
    constructor: IPwbModuleProcessorConstructor<IPwbModuleProcessor>;
    includeExtensions: boolean;
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
