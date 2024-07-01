import { Injector } from '@kartoffelgames/core.dependency-injection';
import { CoreEntityRegister } from '../../core_entity/core-entity-register';
import { AccessMode } from '../../enum/access-mode.enum';
import { UpdateTrigger } from '../../enum/update-trigger.enum';
import { AttributeModule, IPwbAttributeModuleProcessorConstructor } from './attribute-module';

/**
 * AtScript. PWB attribute attribute module.
 * 
 * @param pSettings - Module settings.
 */
export function PwbAttributeModule(pSettings: AttributeModuleSettings): any {
    return (pProcessorConstructor: IPwbAttributeModuleProcessorConstructor) => {

        // Set user class to be injectable
        Injector.Injectable(pProcessorConstructor);

        // Register module.
        CoreEntityRegister.register(AttributeModule, pProcessorConstructor, {
            access: pSettings.access,
            selector: pSettings.selector,
            trigger: pSettings.trigger
        });
    };
}

type AttributeModuleSettings = {
    access: AccessMode;
    selector: RegExp;
    trigger: UpdateTrigger;
};