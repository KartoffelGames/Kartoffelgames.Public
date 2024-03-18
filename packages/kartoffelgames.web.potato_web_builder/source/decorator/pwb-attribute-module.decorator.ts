import { Injector } from '@kartoffelgames/core.dependency-injection';
import { ModuleAccessMode } from '../enum/module-access-mode.enum';
import { GlobalModuleStorage } from '../module/global-module-storage';
import { IPwbAttributeModuleProcessorConstructor } from '../interface/module.interface';

/**
 * AtScript. PWB attribute attribute module.
 * @param pSettings - Module settings.
 */
export function PwbAttributeModule(pSettings: AttributeModuleSettings): any {
    return (pAttributeModuleConstructor: IPwbAttributeModuleProcessorConstructor) => {

        // Set user class to be injectable
        Injector.Injectable(pAttributeModuleConstructor);

        // Register module.
        new GlobalModuleStorage().addAttributeModule({
            access: pSettings.access,
            constructor: pAttributeModuleConstructor,
            selector: pSettings.selector
        });
    };
}

type AttributeModuleSettings = {
    selector: RegExp,
    access: ModuleAccessMode;
};