import { IDeconstructable } from '@kartoffelgames/core';
import { InjectionConstructor } from '@kartoffelgames/core.dependency-injection';
import { AccessMode } from '../enum/access-mode.enum';
import { UpdateTrigger } from '../enum/update-trigger.enum';
import { CoreEntity, CoreEntityProcessorConstructor } from '../core_entity/core-entity';

export class ExtensionModule extends CoreEntity<IPwbExtensionModuleProcessor> implements IDeconstructable {
    /**
     * Constructor.
     * @param pParameter - Construction parameter.
     */
    public constructor(pConstructor: IPwbExtensionModuleProcessorConstructor, pParent: CoreEntity, pInteractionTrigger: UpdateTrigger) {
        super({
            constructor: pConstructor,
            parent: pParent,
            isolate: false,
            trigger: pInteractionTrigger
        });

        this.setProcessorAttributes(ExtensionModule, this);

        // Call execution hook.
        this.addSetupHook(() => {
            this.call<IExtensionOnExecute, 'onExecute'>('onExecute', false);
        }).addSetupHook(()=>{
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
    public async onUpdate(): Promise<boolean> {
        return this.call<IExtensionOnUpdate, 'onUpdate'>('onUpdate', false) ?? false;
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
export interface IExtensionOnUpdate {
    onUpdate(): boolean;
}
export interface IPwbExtensionModuleProcessor extends Partial<IExtensionOnDeconstruct>, Partial<IExtensionOnExecute> { }
export interface IPwbExtensionModuleProcessorConstructor extends CoreEntityProcessorConstructor<IPwbExtensionModuleProcessor> { }

/**
 * Register configuration.
 */
export type ExtensionModuleConfiguration = {
    access: AccessMode;
    trigger: UpdateTrigger;
    targetRestrictions: Array<InjectionConstructor>;
};