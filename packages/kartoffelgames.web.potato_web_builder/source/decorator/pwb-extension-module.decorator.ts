import { Injector } from '@kartoffelgames/core.dependency-injection';
import { AccessMode } from '../enum/access-mode.enum';
import { ExtensionType } from '../enum/extension-type.enum';
import { UpdateTrigger } from '../enum/update-trigger.enum';
import { IPwbExtensionModuleProcessorConstructor } from '../interface/extension.interface';
import { GlobalModuleStorage } from '../module/global-module-storage';

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
        new GlobalModuleStorage().addExtensionModule({
            access: pSettings.access,
            constructor: pExtensionConstructor,
            trigger: pSettings.trigger,
            type: pSettings.type
        });
    };
}

type ExtensionSettings = {
    access: AccessMode;
    trigger: UpdateTrigger;
    type: ExtensionType;
};