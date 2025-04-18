import { type ClassAccessorDecorator, Exception } from '@kartoffelgames/core';
import { ComponentRegister } from '../../core/component/component-register.ts';
import type { Component, ComponentProcessor } from '../../core/component/component.ts';
import { ComponentDataLevel } from '../../core/data/component-data-level.ts';

/**
 * AtScript. Id child 
 * @param pIdChildName - Name of id child.
 */
export function PwbChild<TElement extends Element>(pIdChildName: string): ClassAccessorDecorator<any, TElement> {
    return (_pTarget: ClassAccessorDecoratorTarget<any, TElement>, pContext: ClassAccessorDecoratorContext): ClassAccessorDecoratorResult<any, TElement> => {
        // Check if real decorator on static property.
        if (pContext.static) {
            throw new Exception('Event target is not for a static property.', PwbChild);
        }

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

                if (lIdChild instanceof Element) {
                    return lIdChild as TElement;
                } else {
                    throw new Exception(`Can't find child "${pIdChildName}".`, this);
                }
            }
        };
    };
}