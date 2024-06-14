import { Injector } from '@kartoffelgames/core.dependency-injection';
import { GlobalModuleStorage } from '../module/global-module-storage';
import { IPwbExpressionModuleProcessorConstructor } from '../interface/module.interface';
import { UpdateTrigger } from '../enum/update-trigger.enum';

/**
 * AtScript. PWB Expression module.
 */
export function PwbExpressionModule(pExpressionSettings: ExpressionSettings): any {
    return (pExpressionModuleConstructor: IPwbExpressionModuleProcessorConstructor) => {
        // Set processor to be injectable
        Injector.Injectable(pExpressionModuleConstructor);

        // Register module.
        new GlobalModuleStorage().addExpressionModule({
            constructor: pExpressionModuleConstructor
        });
    };
}

type ExpressionSettings = {
    trigger: UpdateTrigger;
};