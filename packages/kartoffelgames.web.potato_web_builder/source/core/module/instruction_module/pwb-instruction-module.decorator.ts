import { Injector } from '@kartoffelgames/core.dependency-injection';
import { UpdateTrigger } from '../../enum/update-trigger.enum';
import { CoreEntityRegister } from '../../core_entity/core-entity-register';
import { IPwbInstructionModuleProcessorConstructor, InstructionModule } from './instruction-module';

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