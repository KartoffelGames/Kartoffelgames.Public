import { IDeconstructable } from '@kartoffelgames/core';
import { ScopedValues } from '../scoped-values';
import { CoreEntityProcessorConstructor } from '../core_entity/core-entity';
import { CoreEntityExtendable, CoreEntityExtendableConstructorParameter } from '../core_entity/core-entity-extendable';
import { ModuleValues } from './module-values';

export abstract class BaseModule<TModuleProcessor extends IPwbModuleProcessor> extends CoreEntityExtendable<TModuleProcessor> implements IDeconstructable {
    /**
     * Constructor.
     * @param pParameter - Parameter.
     */
    constructor(pParameter: BaseModuleConstructorParameter<TModuleProcessor>) {
        super({
            processorConstructor: pParameter.processorConstructor,
            parent: pParameter.parent,
            isolateInteraction: false,
            interactionTrigger: pParameter.interactionTrigger,
            createOnSetup: true
        });

        // Create module injection mapping.
        this.setProcessorAttributes(ModuleValues, new ModuleValues(pParameter.values));
    }

    /**
     * Deconstruct module.
     */
    public override deconstruct(): void {
        // Deconstruct extensions.
        super.deconstruct();

        this.call<IBaseModuleOnDeconstruct, 'onDeconstruct'>('onDeconstruct', false);
    }
}

export type BaseModuleConstructorParameter<TProcessor extends IPwbModuleProcessor> = Omit<CoreEntityExtendableConstructorParameter<TProcessor>, 'isolateInteraction'> & {
    values: ScopedValues;
};

/**
 * Interfaces.
 */
export interface IBaseModuleOnDeconstruct {
    onDeconstruct(): void;
}
export interface IPwbModuleProcessor extends Partial<IBaseModuleOnDeconstruct> { }
export interface IPwbModuleProcessorConstructor<TModuleProcessor extends IPwbModuleProcessor> extends CoreEntityProcessorConstructor<TModuleProcessor> { }
