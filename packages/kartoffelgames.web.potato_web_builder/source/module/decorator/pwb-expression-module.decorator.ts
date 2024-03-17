import { Injector } from '@kartoffelgames/core.dependency-injection';
import { GlobalModuleStorage } from '../global-module-storage';
import { IPwbExpressionModuleClass } from '../interface/module';

/**
 * AtScript. PWB Expression module.
 * @param pSettings - Module settings.
 */
export function PwbExpressionModule(): any {
    return (pExpressionModuleConstructor: IPwbExpressionModuleClass) => {
        // Set user class to be injectable
        Injector.Injectable(pExpressionModuleConstructor);

        // Register module.
        new GlobalModuleStorage().addExpressionModule(pExpressionModuleConstructor, {
            constructor: pExpressionModuleConstructor
        });
    };
}