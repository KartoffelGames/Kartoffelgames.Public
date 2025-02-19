import { IDeconstructable } from '@kartoffelgames/core';
import { DataLevel } from '../data/data-level.ts';
import { CoreEntityProcessorConstructor } from '../core_entity/core-entity.ts';
import { CoreEntityExtendable, CoreEntityExtendableConstructorParameter } from '../core_entity/core-entity-extendable.ts';
import { ModuleDataLevel } from '../data/module-data-level.ts';
import { PwbDebugLogLevel } from '../configuration/pwb-configuration.ts';
import { Processor } from '../core_entity/processor.ts';

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
        this.setProcessorAttributes(ModuleDataLevel, new ModuleDataLevel(pParameter.values));

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
    values: DataLevel;
};

/**
 * Interfaces.
 */
export interface IBaseModuleOnDeconstruct {
    onDeconstruct(): void;
}
export interface IPwbModuleProcessor extends Processor, Partial<IBaseModuleOnDeconstruct> { }
export interface IPwbModuleProcessorConstructor<TModuleProcessor extends IPwbModuleProcessor> extends CoreEntityProcessorConstructor<TModuleProcessor> { }
