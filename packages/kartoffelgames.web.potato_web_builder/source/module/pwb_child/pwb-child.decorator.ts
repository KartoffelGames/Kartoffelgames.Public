import { Exception } from '@kartoffelgames/core';
import { ComponentRegister } from '../../core/component/component-register.ts';
import type { Component, ComponentProcessor } from '../../core/component/component.ts';
import { PwbConfiguration } from "../../core/configuration/pwb-configuration.ts";
import { ComponentDataLevel } from '../../core/data/component-data-level.ts';

/**
 * AtScript. Id child 
 * @param pIdChildName - Name of id child.
 */
export function PwbChild(pIdChildName: string) {
    return <TElement extends Element>(_: ClassAccessorDecoratorTarget<any, TElement>, pContext: ClassAccessorDecoratorContext): ClassAccessorDecoratorResult<any, TElement> => {
        // Check if real decorator on static property.
        if (pContext.static) {
            throw new Exception('Event target is not for a static property.', PwbChild);
        }

        // Read global scope.
        const lGlobalScope: typeof globalThis = PwbConfiguration.configuration.scope.window;

        // Define getter accessor that returns id child.
        return {
            get(this: ComponentProcessor) {
                // Get component manager and exit if target is not a component.
                const lComponent: Component = (() => {
                    try {
                        return ComponentRegister.ofProcessor(this).component;
                    } catch {
                        throw new Exception('PwbChild target class is not a component.', this);
                    }
                })();

                // Get root value. This should be the child.
                const lComponentRootValues: ComponentDataLevel = lComponent.getProcessorAttribute(ComponentDataLevel)!;
                const lIdChild: any = lComponentRootValues.data.store[pIdChildName];

                if (lIdChild instanceof lGlobalScope.Element) {
                    return lIdChild as TElement;
                } else {
                    throw new Exception(`Can't find child "${pIdChildName}".`, this);
                }
            }
        };
    };
}