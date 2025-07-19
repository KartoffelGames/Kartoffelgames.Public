import { Injection } from '@kartoffelgames/core-dependency-injection';
import { CoreEntityRegister } from '../../core_entity/core-entity-register.ts';
import type { UpdateTrigger } from '../../enum/update-trigger.enum.ts';
import { type IPwbInstructionModuleProcessorConstructor, InstructionModule } from './instruction-module.ts';

/**
 * AtScript. PWB instruction attribute module.
 * 
 * @param pSettings - Module settings.
 */
export function PwbInstructionModule(pSettings: InstructionModuleSettings): any {
    return (pInstructionModuleConstructor: IPwbInstructionModuleProcessorConstructor, pContext: ClassDecoratorContext) => {

        // Set user class to be injectable
        Injection.registerInjectable(pInstructionModuleConstructor, pContext.metadata, 'instanced');

        // Register module.
        CoreEntityRegister.register(InstructionModule, pInstructionModuleConstructor, {
            instructionType: pSettings.instructionType,
            trigger: pSettings.trigger
        });
    };
}

type InstructionModuleSettings = {
    instructionType: string;
    trigger: UpdateTrigger;
};