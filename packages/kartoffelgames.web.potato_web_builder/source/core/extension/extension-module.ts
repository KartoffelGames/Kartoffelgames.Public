import type { IDeconstructable } from '@kartoffelgames/core';
import type { InjectionConstructor } from '@kartoffelgames/core-dependency-injection';
import { CoreEntity, CoreEntityProcessor, type CoreEntityProcessorConstructor } from '../core_entity/core-entity.ts';
import type { AccessMode } from '../enum/access-mode.enum.ts';

export class ExtensionModule extends CoreEntity<IPwbExtensionModuleProcessor> implements IDeconstructable {
    /**
     * Constructor.
     * 
     * @param pApplicationContext - Application context.
     * @param pConstructor - Constructor of the extension module.
     * @param pParent - Parent entity.
     * @param pInteractionTrigger - Trigger for the extension module.
     */
    public constructor(pConstructor: IPwbExtensionModuleProcessorConstructor, pParent: CoreEntity) {
        super({
            constructor: pConstructor,
            parent: pParent,
        });

        this.setProcessorInjection(ExtensionModule, this);

        // Call execution hook.
        this.call<IExtensionOnExecute, 'onExecute'>('onExecute');
    }

    /**
     * On module desconstruct.
     */
    public override deconstruct(): void {
        // Call execution hook.
        this.call<IExtensionOnDeconstruct, 'onDeconstruct'>('onDeconstruct');

        super.deconstruct();
    }

    /**
     * Calls processor onUpdate.
     * 
     * @returns false.
     */
    protected onUpdate(): boolean {
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
export interface IPwbExtensionModuleProcessor extends CoreEntityProcessor, Partial<IExtensionOnDeconstruct>, Partial<IExtensionOnExecute> { }
export interface IPwbExtensionModuleProcessorConstructor extends CoreEntityProcessorConstructor<IPwbExtensionModuleProcessor> { }

/**
 * Register configuration.
 */
export type ExtensionModuleConfiguration = {
    access: AccessMode;
    targetRestrictions: Array<InjectionConstructor>;
};