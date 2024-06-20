import { Injector } from '@kartoffelgames/core.dependency-injection';
import { AccessMode } from '../../../enum/access-mode.enum';
import { UpdateTrigger } from '../../../enum/update-trigger.enum';
import { CoreEntityRegister } from '../../core_entity/core-entity-register';
import { AttributeModule, IPwbAttributeModuleProcessorConstructor } from './attribute-module';

/**
 * AtScript. PWB attribute attribute module.
 * 
 * @param pSettings - Module settings.
 */
export function PwbAttributeModule(pSettings: AttributeModuleSettings): any {
    return (pAttributeModuleConstructor: IPwbAttributeModuleProcessorConstructor) => {

        // Set user class to be injectable
        Injector.Injectable(pAttributeModuleConstructor);

        // Register module.
        new CoreEntityRegister().register(AttributeModule, pAttributeModuleConstructor, {
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