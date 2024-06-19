import { InjectionConstructor, Injector } from '@kartoffelgames/core.dependency-injection';
import { AccessMode } from '../../enum/access-mode.enum';
import { UpdateTrigger } from '../../enum/update-trigger.enum';
import { IPwbExtensionModuleProcessorConstructor } from './extension-module';
import { GlobalExtensionStorage } from './global-extension-storage';

/**
 * AtScript. PWB component extension module.
 * 
 * @param pSettings - Extension settings.
 */
export function PwbExtensionModule(pSettings: ExtensionSettings): any {
    return (pExtensionConstructor: IPwbExtensionModuleProcessorConstructor) => {

        // Set processor to be injectable
        Injector.Injectable(pExtensionConstructor);

        // Register module.
        new GlobalExtensionStorage().addExtensionModule({
            access: pSettings.access,
            constructor: pExtensionConstructor,
            trigger: pSettings.trigger,
            targetRestrictions: pSettings.targetRestrictions ?? new Array<InjectionConstructor>()
        });
    };
}

type ExtensionSettings = {
    access: AccessMode;
    trigger: UpdateTrigger;
    targetRestrictions?: Array<InjectionConstructor>;
};