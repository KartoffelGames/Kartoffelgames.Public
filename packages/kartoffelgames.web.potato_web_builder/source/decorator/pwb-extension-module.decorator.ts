import { Injector } from '@kartoffelgames/core.dependency-injection';
import { AccessMode } from '../enum/access-mode.enum';
import { ExtensionType } from '../enum/extension-type.enum';
import { GlobalExtensionsStorage } from '../extension/global-extensions-storage';
import { IPwbExtensionModuleProcessorClass } from '../interface/extension.interface';
import { UpdateTrigger } from '../enum/update-trigger.enum';

/**
 * AtScript. PWB component extension module.
 * 
 * @param pSettings - Extension settings.
 */
export function PwbExtensionModule(pSettings: ExtensionSettings): any {
    return (pExtensionConstructor: IPwbExtensionModuleProcessorClass) => {

        // Set processor to be injectable
        Injector.Injectable(pExtensionConstructor);

        // Register module.
        new GlobalExtensionsStorage().addExtensionModule(pExtensionConstructor, pSettings.type, pSettings.access);
    };
}

type ExtensionSettings = {
    access: AccessMode;
    trigger: UpdateTrigger;
    type: ExtensionType;
};