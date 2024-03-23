import { Injector } from '@kartoffelgames/core.dependency-injection';
import { GlobalModuleStorage } from '../module/global-module-storage';
import { IPwbExpressionModuleProcessorConstructor } from '../interface/module.interface';

/**
 * AtScript. PWB Expression module.
 * @param pSettings - Module settings.
 */
export function PwbExpressionModule(): any {
    return (pExpressionModuleConstructor: IPwbExpressionModuleProcessorConstructor) => {
        // Set processor to be injectable
        Injector.Injectable(pExpressionModuleConstructor);

        // Register module.
        new GlobalModuleStorage().addExpressionModule({
            constructor: pExpressionModuleConstructor
        });
    };
}