import { Injector } from '@kartoffelgames/core.dependency-injection';
import { ModuleAccessType } from '../enum/module-access-type';
import { GlobalModuleStorage } from '../global-module-storage';
import { IPwbAttributeModuleClass } from '../interface/module';

/**
 * AtScript. PWB attribute attribute module.
 * @param pSettings - Module settings.
 */
export function PwbAttributeAttributeModule(pSettings: AttributeModuleSettings): any {
    return (pAttributeModuleConstructor: IPwbAttributeModuleClass) => {

        // Set user class to be injectable
        Injector.Injectable(pAttributeModuleConstructor);

        // Register module.
        new GlobalModuleStorage().addAttributeModule(pAttributeModuleConstructor, {
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