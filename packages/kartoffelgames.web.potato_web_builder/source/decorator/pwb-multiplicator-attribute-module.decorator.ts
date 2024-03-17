import { Injector } from '@kartoffelgames/core.dependency-injection';
import { GlobalModuleStorage } from '../module/global-module-storage';
import { IPwbInstructionModuleClass } from '../interface/module';

/**
 * AtScript. PWB instruction attribute module.
 * @param pSettings - Module settings.
 */
export function PwbInstructionAttributeModule(pSettings: InstructionModuleSettings): any {
    return (pInstructionModuleConstructor: IPwbInstructionModuleClass) => {

        // Set user class to be injectable
        Injector.Injectable(pInstructionModuleConstructor);

        // Register module.
        new GlobalModuleStorage().addInstructionModule(pInstructionModuleConstructor, {
            constructor: pInstructionModuleConstructor,
            instructionType: pSettings.instructionType
        });
    };
}

type InstructionModuleSettings = {
    instructionType: string;
};