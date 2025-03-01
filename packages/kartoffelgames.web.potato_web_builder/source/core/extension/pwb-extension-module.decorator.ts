import { type InjectionConstructor, Injector } from '@kartoffelgames/core-dependency-injection';
import { CoreEntityRegister } from '../core_entity/core-entity-register.ts';
import type { AccessMode } from '../enum/access-mode.enum.ts';
import type { UpdateTrigger } from '../enum/update-trigger.enum.ts';
import { ExtensionModule, type ExtensionModuleConfiguration, type IPwbExtensionModuleProcessorConstructor } from './extension-module.ts';

/**
 * AtScript. PWB component extension module.
 * 
 * @param pSettings - Extension settings.
 */
export function PwbExtensionModule(pSettings: ExtensionSettings): any {
    return (pExtensionProcessorConstructor: IPwbExtensionModuleProcessorConstructor) => {

        // Set processor to be injectable
        Injector.Injectable(pExtensionProcessorConstructor);

        // Register module.
        CoreEntityRegister.register<ExtensionModuleConfiguration>(ExtensionModule, pExtensionProcessorConstructor, {
            access: pSettings.access,
            trigger: pSettings.trigger,
            targetRestrictions: pSettings.targetRestrictions
        });
    };
}

type ExtensionSettings = {
    access: AccessMode;
    trigger: UpdateTrigger;
    targetRestrictions: Array<InjectionConstructor>;
};