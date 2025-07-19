import { Injection } from '@kartoffelgames/core-dependency-injection';
import { CoreEntityRegister } from '../../core_entity/core-entity-register.ts';
import type { UpdateTrigger } from '../../enum/update-trigger.enum.ts';
import { ExpressionModule, type IPwbExpressionModuleProcessorConstructor } from './expression-module.ts';

/**
 * AtScript. PWB Expression module.
 */
export function PwbExpressionModule(pSettings: ExpressionSettings): any {
    return (pExpressionModuleConstructor: IPwbExpressionModuleProcessorConstructor, pContext: ClassDecoratorContext) => {
        // Set processor to be injectable
        Injection.registerInjectable(pExpressionModuleConstructor, pContext.metadata, 'instanced');

        // Register module.
        CoreEntityRegister.register(ExpressionModule, pExpressionModuleConstructor, {
            trigger: pSettings.trigger
        });
    };
}

type ExpressionSettings = {
    trigger: UpdateTrigger;
};