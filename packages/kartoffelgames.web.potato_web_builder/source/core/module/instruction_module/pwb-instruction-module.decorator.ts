import { Injector } from '@kartoffelgames/core-dependency-injection';
import { UpdateTrigger } from '../../enum/update-trigger.enum.ts';
import { CoreEntityRegister } from '../../core_entity/core-entity-register.ts';
import { IPwbInstructionModuleProcessorConstructor, InstructionModule } from './instruction-module.ts';

/**
 * AtScript. PWB instruction attribute module.
 * 
 * @param pSettings - Module settings.
 */
export function PwbInstructionModule(pSettings: InstructionModuleSettings): any {
    return (pInstructionModuleConstructor: IPwbInstructionModuleProcessorConstructor) => {

        // Set user class to be injectable
        Injector.Injectable(pInstructionModuleConstructor);

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