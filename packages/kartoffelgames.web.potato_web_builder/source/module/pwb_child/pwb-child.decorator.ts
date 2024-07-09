import { Exception } from '@kartoffelgames/core';
import { Component, ComponentProcessor } from '../../core/component/component';
import { ComponentRegister } from '../../core/component/component-register';
import { ScopedValues } from '../../core/data/scoped-values';
import { ComponentScopedValues } from '../../core/data/component-scoped-values';

/**
 * AtScript. Id child 
 * @param pIdChildName - Name of id child.
 */
export function PwbChild(pIdChildName: string): any {
    return (pTarget: object, pPropertyKey: string) => {
        // Check if real decorator on static property.
        if (typeof pTarget === 'function') {
            throw new Exception('Event target is not for a static property.', PwbChild);
        }

        // Define getter accessor that returns id child.
        Object.defineProperty(pTarget, pPropertyKey, {
            get(this: ComponentProcessor) {
                // Get component manager and exit if target is not a component.
                const lComponent: Component = (() => {
                    try {
                        return ComponentRegister.ofProcessor(this).component;
                    } catch (_err) {
                        throw new Exception('PwbChild target class it not a component.', this);
                    }
                })();

                // Get root value. This should be the child.
                const lComponentRootValues: ScopedValues = lComponent.getProcessorAttribute(ComponentScopedValues)!;
                const lIdChild: any = lComponentRootValues.store[pIdChildName];

                if (lIdChild instanceof Element) {
                    return lIdChild;
                } else {
                    throw new Exception(`Can't find child "${pIdChildName}".`, this);
                }
            }
        });
    };
}