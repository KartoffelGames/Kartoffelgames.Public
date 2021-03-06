import { Injector } from '@kartoffelgames/core.dependency-injection';
import { ExtensionMode } from '../enum/extension-mode';
import { ExtensionType } from '../enum/extension-type';
import { Extensions } from '../extensions';
import { IPwbExtensionClass } from '../interface/extension';

/**
 * AtScript. PWB component extension.
 */
export function PwbExtension(pSettings: ExtensionSettings): any {
    return (pExtensionConstructor: IPwbExtensionClass) => {

        // Set user class to be injectable
        Injector.Injectable(pExtensionConstructor);

        // Register module.
        Extensions.add(pExtensionConstructor, pSettings.type, pSettings.mode);
    };
}

type ExtensionSettings = {
    type: ExtensionType;
    mode: ExtensionMode;
};