import { Injector } from '@kartoffelgames/core.dependency-injection';
import { ModuleAccessType } from '../enum/module-access-type';
import { ModuleType } from '../enum/module-type';
import { IPwbExpressionModuleClass } from '../interface/module';
import { Modules } from '../modules';

/**
 * AtScript. PWB Expression module.
 * @param pSettings - Module settings.
 */
export function PwbExpressionModule(): any {
    return (pExpressionModuleConstructor: IPwbExpressionModuleClass) => {
        // Set user class to be injectable
        Injector.Injectable(pExpressionModuleConstructor);

        // Register module.
        Modules.add(pExpressionModuleConstructor, {
            type: ModuleType.Expression,
            access: ModuleAccessType.Write
        });
    };
}