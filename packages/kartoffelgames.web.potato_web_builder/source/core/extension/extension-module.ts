import { IDeconstructable } from '@kartoffelgames/core';
import { InjectionConstructor } from '@kartoffelgames/core.dependency-injection';
import { PwbDebugLogLevel } from '../configuration/pwb-configuration';
import { CoreEntity, CoreEntityProcessorConstructor } from '../core_entity/core-entity';
import { Processor } from '../core_entity/processor';
import { AccessMode } from '../enum/access-mode.enum';
import { UpdateTrigger } from '../enum/update-trigger.enum';

export class ExtensionModule extends CoreEntity<IPwbExtensionModuleProcessor> implements IDeconstructable {
    /**
     * Constructor.
     * @param pParameter - Construction parameter.
     */
    public constructor(pConstructor: IPwbExtensionModuleProcessorConstructor, pParent: CoreEntity, pInteractionTrigger: UpdateTrigger) {
        super({
            constructor: pConstructor,
            debugLevel: PwbDebugLogLevel.Extention,
            parent: pParent,
            isolate: false,
            trigger: pInteractionTrigger,
            trackConstructorChanges: false
        });

        this.setProcessorAttributes(ExtensionModule, this);

        // Call execution hook.
        this.addSetupHook(() => {
            this.call<IExtensionOnExecute, 'onExecute'>('onExecute', false);
        }).addSetupHook(() => {
            // Forces auto create on setup.
            this.processor;
        });
    }

    /**
     * On module desconstruct.
     */
    public override deconstruct(): void {
        // Call execution hook.
        this.call<IExtensionOnDeconstruct, 'onDeconstruct'>('onDeconstruct', false);

        super.deconstruct();
    }

    /**
     * Calls processor onUpdate.
     * 
     * @returns false.
     */
    public onUpdate(): boolean {
        // No update for you :(
        /* istanbul ignore next */
        return false;
    }
}

/*
 * Interfaces.
 */
export interface IExtensionOnDeconstruct {
    onDeconstruct(): void;
}
export interface IExtensionOnExecute {
    onExecute(): void;
}
export interface IPwbExtensionModuleProcessor extends Processor, Partial<IExtensionOnDeconstruct>, Partial<IExtensionOnExecute> { }
export interface IPwbExtensionModuleProcessorConstructor extends CoreEntityProcessorConstructor<IPwbExtensionModuleProcessor> { }

/**
 * Register configuration.
 */
export type ExtensionModuleConfiguration = {
    access: AccessMode;
    trigger: UpdateTrigger;
    targetRestrictions: Array<InjectionConstructor>;
};