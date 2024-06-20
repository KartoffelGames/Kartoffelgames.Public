import { IDeconstructable } from '@kartoffelgames/core.data';
import { CoreEntityProcessorConstructor } from '../core_entity/core-entity';
import { CoreEntityExtendable, CoreEntityExtendableConstructorParameter } from '../core_entity/core-entity-extendable';
import { ModuleConstructorReference } from '../injection-reference/module/module-constructor-reference';
import { ModuleReference } from '../injection-reference/module/module-reference';

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
            interactionTrigger: pParameter.interactionTrigger
        });

        // Create module injection mapping.
        this.setProcessorAttributes(ModuleConstructorReference, pParameter.processorConstructor);
        this.setProcessorAttributes(ModuleReference, this);
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

export type BaseModuleConstructorParameter<TProcessor extends IPwbModuleProcessor> = Omit<CoreEntityExtendableConstructorParameter<TProcessor>, 'isolateInteraction'>;

/**
 * Interfaces.
 */
export interface IBaseModuleOnDeconstruct {
    onDeconstruct(): void;
}
export interface IPwbModuleProcessor extends Partial<IBaseModuleOnDeconstruct> { }
export interface IPwbModuleProcessorConstructor<TModuleProcessor extends IPwbModuleProcessor> extends CoreEntityProcessorConstructor<TModuleProcessor> { }
