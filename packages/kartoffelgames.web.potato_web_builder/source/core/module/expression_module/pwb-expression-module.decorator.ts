import { Injector } from '@kartoffelgames/core-dependency-injection';
import { UpdateTrigger } from '../../enum/update-trigger.enum.ts';
import { CoreEntityRegister } from '../../core_entity/core-entity-register.ts';
import { ExpressionModule, IPwbExpressionModuleProcessorConstructor } from './expression-module.ts';

/**
 * AtScript. PWB Expression module.
 */
export function PwbExpressionModule(pSettings: ExpressionSettings): any {
    return (pExpressionModuleConstructor: IPwbExpressionModuleProcessorConstructor) => {
        // Set processor to be injectable
        Injector.Injectable(pExpressionModuleConstructor);

        // Register module.
        CoreEntityRegister.register(ExpressionModule, pExpressionModuleConstructor, {
            trigger: pSettings.trigger
        });
    };
}

type ExpressionSettings = {
    trigger: UpdateTrigger;
};