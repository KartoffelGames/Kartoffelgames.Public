import { IDeconstructable } from '@kartoffelgames/core';
import { ScopedValues } from '../scoped-values';
import { CoreEntityProcessorConstructor } from '../core_entity/core-entity';
import { CoreEntityExtendable, CoreEntityExtendableConstructorParameter } from '../core_entity/core-entity-extendable';
import { ModuleValues } from './module-values';
import { PwbDebugLogLevel } from '../../debug/pwb-debug';
import { Processor } from '../core_entity/processor';

export abstract class BaseModule<TModuleProcessor extends IPwbModuleProcessor> extends CoreEntityExtendable<TModuleProcessor> implements IDeconstructable {
    /**
     * Constructor.
     * @param pParameter - Parameter.
     */
    constructor(pParameter: BaseModuleConstructorParameter<TModuleProcessor>) {
        super({
            constructor: pParameter.constructor,
            debugLevel: PwbDebugLogLevel.Module,
            parent: pParameter.parent,
            isolate: false,
            trigger: pParameter.trigger,
            trackConstructorChanges: false
        });

        // Create module injection mapping.
        this.setProcessorAttributes(ModuleValues, new ModuleValues(pParameter.values));

        this.addSetupHook(() => {
            // Forces auto create on setup.
            this.processor;
        });
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

export type BaseModuleConstructorParameter<TProcessor extends IPwbModuleProcessor> = Omit<Omit<Omit<CoreEntityExtendableConstructorParameter<TProcessor>, 'trackConstructorChanges'>, 'debugLevel'>, 'isolateInteraction'> & {
    values: ScopedValues;
};

/**
 * Interfaces.
 */
export interface IBaseModuleOnDeconstruct {
    onDeconstruct(): void;
}
export interface IPwbModuleProcessor extends Processor, Partial<IBaseModuleOnDeconstruct> { }
export interface IPwbModuleProcessorConstructor<TModuleProcessor extends IPwbModuleProcessor> extends CoreEntityProcessorConstructor<TModuleProcessor> { }
