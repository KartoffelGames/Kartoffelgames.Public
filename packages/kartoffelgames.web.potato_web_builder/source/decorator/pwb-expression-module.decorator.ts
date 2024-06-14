import { Injector } from '@kartoffelgames/core.dependency-injection';
import { GlobalModuleStorage } from '../module/global-module-storage';
import { IPwbExpressionModuleProcessorConstructor } from '../interface/module.interface';
import { UpdateTrigger } from '../enum/update-trigger.enum';

/**
 * AtScript. PWB Expression module.
 */
export function PwbExpressionModule(pSettings: ExpressionSettings): any {
    return (pExpressionModuleConstructor: IPwbExpressionModuleProcessorConstructor) => {
        // Set processor to be injectable
        Injector.Injectable(pExpressionModuleConstructor);

        // Register module.
        new GlobalModuleStorage().addExpressionModule({
            constructor: pExpressionModuleConstructor,
            trigger: pSettings.trigger
        });
    };
}

type ExpressionSettings = {
    trigger: UpdateTrigger;
};