import { Exception } from '@kartoffelgames/core';
import type { Component, ComponentProcessor } from '../../core/component/component.ts';
import { ComponentRegister } from '../../core/component/component-register.ts';
import { ComponentDataLevel } from '../../core/data/component-data-level.ts';

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
                    } catch {
                        throw new Exception('PwbChild target class it not a component.', this);
                    }
                })();

                // Get root value. This should be the child.
                const lComponentRootValues: ComponentDataLevel = lComponent.getProcessorAttribute(ComponentDataLevel)!;
                const lIdChild: any = lComponentRootValues.data.store[pIdChildName];

                if (lIdChild instanceof Element) {
                    return lIdChild;
                } else {
                    throw new Exception(`Can't find child "${pIdChildName}".`, this);
                }
            }
        });
    };
}