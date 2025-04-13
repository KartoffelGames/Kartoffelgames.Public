import type { IDeconstructable } from '@kartoffelgames/core';
import { PwbApplicationDebugLoggingType } from '../../application/pwb-application-debug-logging-type.enum.ts';
import { CoreEntityExtendable, type CoreEntityExtendableConstructorParameter } from '../core_entity/core-entity-extendable.ts';
import type { CoreEntityProcessorConstructor } from '../core_entity/core-entity.ts';
import type { Processor } from '../core_entity/processor.ts';
import type { DataLevel } from '../data/data-level.ts';
import { ModuleDataLevel } from '../data/module-data-level.ts';

export abstract class BaseModule<TModuleProcessor extends IPwbModuleProcessor> extends CoreEntityExtendable<TModuleProcessor> implements IDeconstructable {
    /**
     * Constructor.
     * 
     * @param pParameter - Parameter.
     */
    constructor(pParameter: BaseModuleConstructorParameter<TModuleProcessor>) {
        super({
            applicationContext: pParameter.applicationContext,
            constructor: pParameter.constructor,
            loggingType: PwbApplicationDebugLoggingType.Module,
            parent: pParameter.parent,
            isolate: false,
            trigger: pParameter.trigger,
            trackConstructorChanges: false
        });

        // Create module injection mapping.
        this.setProcessorAttributes(ModuleDataLevel, new ModuleDataLevel(pParameter.values));

        this.addSetupHook(() => {
            // Forces auto create on setup.
            const _ = this.processor;
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

export type BaseModuleConstructorParameter<TProcessor extends IPwbModuleProcessor> = Omit<Omit<Omit<CoreEntityExtendableConstructorParameter<TProcessor>, 'trackConstructorChanges'>, 'loggingType'>, 'isolateInteraction'> & {
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
