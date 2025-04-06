import { Exception } from '@kartoffelgames/core';
import { Metadata } from '@kartoffelgames/core-dependency-injection';
import { ComponentEventExtension } from './component-event-extension.ts';
import type { ComponentProcessorConstructor } from '../../core/component/component.ts';

/**
 * Define event for external access.
 * @param pEventName - Name of event.
 */
export function PwbComponentEvent(pEventName: string): any {
    return (pTarget: object, pPropertyKey: string, _pDescriptor: PropertyDescriptor): void => { // TODO: DECORATOR REWORK NEEDED.
        // Usually Class Prototype. Globaly.
        const lPrototype: object = pTarget;
        const lUserClassConstructor: ComponentProcessorConstructor = <any>lPrototype.constructor;

        // Check if real prototype.
        if (typeof pTarget === 'function') {
            throw new Exception('Event target is not for an instanced property.', PwbComponentEvent);
        }

        // Get property list from constructor metadata.
        const lEventProperties: Array<[string, string, ComponentProcessorConstructor]> = Metadata.get(lUserClassConstructor).getMetadata(ComponentEventExtension.METADATA_USER_EVENT_PROPERIES) ?? Array<[string, string, ComponentProcessorConstructor]>();
        lEventProperties.push([pEventName, pPropertyKey, lUserClassConstructor]);

        // Set metadata.
        Metadata.get(lUserClassConstructor).setMetadata(ComponentEventExtension.METADATA_USER_EVENT_PROPERIES, lEventProperties);
    };
}
