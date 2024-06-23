import { IDeconstructable } from '@kartoffelgames/core.data';
import { InjectionConstructor } from '@kartoffelgames/core.dependency-injection';
import { AccessMode } from '../../enum/access-mode.enum';
import { UpdateTrigger } from '../../enum/update-trigger.enum';
import { CoreEntity, CoreEntityProcessorConstructor } from '../core_entity/core-entity';

export class ExtensionModule extends CoreEntity<IPwbExtensionModuleProcessor> implements IDeconstructable {
    /**
     * Constructor.
     * @param pParameter - Construction parameter.
     */
    public constructor(pConstructor: IPwbExtensionModuleProcessorConstructor, pParent: CoreEntity, pInteractionTrigger: UpdateTrigger) {
        super({
            processorConstructor: pConstructor,
            parent: pParent,
            isolateInteraction: false,
            interactionTrigger: pInteractionTrigger,
            createOnSetup: true
        });

        this.setProcessorAttributes(ExtensionModule, this);

        // Call execution hook.
        this.addSetupHook(() => {
            this.call<IExtensionOnExecute, 'onExecute'>('onExecute', false);
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
}

/*
 * Interfaces.
 */
export interface IExtensionOnDeconstruct {
    onDeconstruct(): void;
}
export interface IExtensionOnExecute {
    onExecute(): boolean;
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