import { Exception } from '@kartoffelgames/core';
import { Metadata } from '@kartoffelgames/core-dependency-injection';
import { ComponentEventListenerComponentExtension } from './component-event-listener-component-extension.ts';
import type { ComponentProcessorConstructor } from '../../core/component/component.ts';

/**
 * Define event for external access.
 * @param pEventName - Name of event.
 */
export function PwbComponentEventListener(pEventName: string): any {
    return (pTarget: object, pPropertyKey: string, _pDescriptor: PropertyDescriptor): void => {
        // Usually Class Prototype. Globaly.
        const lPrototype: object = pTarget;
        const lUserClassConstructor: ComponentProcessorConstructor = <any>lPrototype.constructor;

        // Check if real prototype.
        if (typeof pTarget === 'function') {
            throw new Exception('Event listener is only valid on instanced property', PwbComponentEventListener);
        }

        // Get property list from constructor metadata.
        const lEventPropertyList: Array<[string, string]> = Metadata.get(lUserClassConstructor).getMetadata(ComponentEventListenerComponentExtension.METADATA_USER_EVENT_LISTENER_PROPERIES) ?? new Array<[string, string]>();
        lEventPropertyList.push([pPropertyKey, pEventName]);

        // Set metadata.
        Metadata.get(lUserClassConstructor).setMetadata(ComponentEventListenerComponentExtension.METADATA_USER_EVENT_LISTENER_PROPERIES, lEventPropertyList);
    };
}
