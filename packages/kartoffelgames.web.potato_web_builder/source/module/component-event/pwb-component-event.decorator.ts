import { ClassAccessorDecorator, Exception } from '@kartoffelgames/core';
import { ComponentRegister } from '../../core/component/component-register.ts';
import type { Component, ComponentProcessor } from '../../core/component/component.ts';
import { ComponentEventEmitter } from './component-event-emitter.ts';

/**
 * Define event for external access.
 * @param pEventName - Name of event.
 */
export function PwbComponentEvent<TEventEmitter extends ComponentEventEmitter<any>>(pEventName: string): ClassAccessorDecorator<any, TEventEmitter> {
    return (_pTarget: ClassAccessorDecoratorTarget<any, TEventEmitter>, pContext: ClassAccessorDecoratorContext): ClassAccessorDecoratorResult<any, TEventEmitter> => {
        // Metadata is not allowed for statics.
        if (pContext.static) {
            throw new Exception('Event target is not for a static property.', PwbComponentEvent);
        }

        // Create component event emitter.
        let lEventEmitter: TEventEmitter | null = null;

        // Define getter accessor that returns id child.
        return {
            get(this: ComponentProcessor) {
                if (!lEventEmitter) {
                    // Get component manager and exit if target is not a component.
                    const lComponent: Component = (() => {
                        try {
                            return ComponentRegister.ofProcessor(this).component;
                        } catch {
                            throw new Exception('PwbComponentEvent target class is not a component.', this);
                        }
                    })();

                    lEventEmitter = new ComponentEventEmitter(pEventName, lComponent.element) as TEventEmitter;
                }

                // Override property with created component event emmiter getter.
                return lEventEmitter;
            }
        };
    };
}
