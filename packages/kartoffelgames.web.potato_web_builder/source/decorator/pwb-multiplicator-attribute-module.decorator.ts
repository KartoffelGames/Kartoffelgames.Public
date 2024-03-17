import { Injector } from '@kartoffelgames/core.dependency-injection';
import { GlobalModuleStorage } from '../module/global-module-storage';
import { IPwbInstructionModuleProcessorConstructor } from '../interface/module';

/**
 * AtScript. PWB instruction attribute module.
 * @param pSettings - Module settings.
 */
export function PwbInstructionAttributeModule(pSettings: InstructionModuleSettings): any {
    return (pInstructionModuleConstructor: IPwbInstructionModuleProcessorConstructor) => {

        // Set user class to be injectable
        Injector.Injectable(pInstructionModuleConstructor);

        // Register module.
        new GlobalModuleStorage().addInstructionModule({
            constructor: pInstructionModuleConstructor,
            instructionType: pSettings.instructionType
        });
    };
}

type InstructionModuleSettings = {
    instructionType: string;
};