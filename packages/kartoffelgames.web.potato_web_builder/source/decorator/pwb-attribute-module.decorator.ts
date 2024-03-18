import { Injector } from '@kartoffelgames/core.dependency-injection';
import { ModuleAccessType } from '../enum/module-access-type';
import { GlobalModuleStorage } from '../module/global-module-storage';
import { IPwbAttributeModuleProcessorConstructor } from '../interface/module';

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
            constructor: pAttributeModuleConstructor,
            selector: pSettings.selector,
            access: pSettings.access
        });
    };
}

type AttributeModuleSettings = {
    selector: RegExp,
    access: ModuleAccessType;
};