import { Injection } from '@kartoffelgames/core-dependency-injection';
import { CoreEntityRegister } from '../../core_entity/core-entity-register.ts';
import type { AccessMode } from '../../enum/access-mode.enum.ts';
import type { UpdateTrigger } from '../../enum/update-trigger.enum.ts';
import { AttributeModule, type IPwbAttributeModuleProcessorConstructor } from './attribute-module.ts';

/**
 * AtScript. PWB attribute attribute module.
 * 
 * @param pSettings - Module settings.
 */
export function PwbAttributeModule(pSettings: AttributeModuleSettings): any {
    return (pProcessorConstructor: IPwbAttributeModuleProcessorConstructor, pContext: ClassDecoratorContext) => {

        // Set user class to be injectable
        Injection.registerInjectable(pProcessorConstructor, pContext.metadata, 'instanced');

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