import { Injector } from '@kartoffelgames/core.dependency-injection';
import { GlobalModuleStorage } from '../global-module-storage';
import { UpdateTrigger } from '../../../enum/update-trigger.enum';
import { IPwbInstructionModuleProcessorConstructor } from './instruction-module';

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
        new GlobalModuleStorage().addInstructionModule({
            constructor: pInstructionModuleConstructor,
            instructionType: pSettings.instructionType,
            trigger: pSettings.trigger
        });
    };
}

type InstructionModuleSettings = {
    instructionType: string;
    trigger: UpdateTrigger;
};