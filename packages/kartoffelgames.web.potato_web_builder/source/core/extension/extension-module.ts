import { IDeconstructable } from '@kartoffelgames/core.data';
import { InjectionConstructor } from '@kartoffelgames/core.dependency-injection';
import { AccessMode } from '../../enum/access-mode.enum';
import { UpdateTrigger } from '../../enum/update-trigger.enum';
import { CoreEntity, CoreEntityProcessorConstructor } from '../core_entity/core-entity';
import { ICoreEntityProcessor, IOnDeconstruct, IOnExecute } from '../core_entity/core-entity.interface';

export class ExtensionModule extends CoreEntity<IPwbExtensionModuleProcessor> implements IDeconstructable {
    /**
     * Constructor.
     * @param pParameter - Construction parameter.
     */
    public constructor(pConstructor: IPwbExtensionModuleProcessorConstructor, pParent: CoreEntity | null, pInteractionTrigger: UpdateTrigger) {
        super({
            processorConstructor: pConstructor,
            parent: pParent,
            isolateInteraction: false,
            interactionTrigger: pInteractionTrigger
        });

        // Call execution hook.
        this.call('onExecute', false);
    }

    /**
     * On module desconstruct.
     */
    public deconstruct(): void {
        // Call execution hook.
        this.call('onDeconstruct', false);
    }
}

/*
 * Processor types.
 */
export interface IPwbExtensionModuleProcessor extends ICoreEntityProcessor, Partial<IOnDeconstruct>, Partial<IOnExecute> { }
export interface IPwbExtensionModuleProcessorConstructor extends CoreEntityProcessorConstructor<IPwbExtensionModuleProcessor> {}

/**
 * Register configuration.
 */
export type ExtensionModuleConfiguration = {
    access: AccessMode;
    trigger: UpdateTrigger;
    targetRestrictions: Array<InjectionConstructor>;
};