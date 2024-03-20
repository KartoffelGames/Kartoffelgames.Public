import { Injector } from '@kartoffelgames/core.dependency-injection';
import { ExtensionPriority } from '../enum/extension-priority.enum';
import { ExtensionType } from '../enum/extension-type.enum';
import { GlobalExtensionsStorage } from '../extension/global-extensions-storage';
import { IPwbExtensionProcessorClass } from '../interface/extension.interface';

/**
 * AtScript. PWB component extension.
 */
export function PwbExtension(pSettings: ExtensionSettings): any {
    return (pExtensionConstructor: IPwbExtensionProcessorClass) => {

        // Set user class to be injectable
        Injector.Injectable(pExtensionConstructor);

        // Register module.
        new GlobalExtensionsStorage().add(pExtensionConstructor, pSettings.type, pSettings.mode);
    };
}

type ExtensionSettings = {
    type: ExtensionType;
    priority: ExtensionPriority;
};