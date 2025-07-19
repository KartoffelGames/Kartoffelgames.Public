import { type ClassMethodDecorator, Exception } from '@kartoffelgames/core';
import { type ConstructorMetadata, Metadata } from '@kartoffelgames/core-dependency-injection';
import { ComponentEventListenerComponentExtension } from './component-event-listener-component-extension.ts';

/**
 * Define event for external access.
 * @param pEventName - Name of event.
 */
export function PwbComponentEventListener<TEvent extends Event>(pEventName: string): ClassMethodDecorator<any, EventListener<TEvent>> {
    return (_pTarget: EventListener<TEvent>, pContext: ClassMethodDecoratorContext): void => {
        // Statics.
        if (pContext.static) {
            throw new Exception('Event target is not for a static property.', PwbComponentEventListener);
        }

        // Read class metadata from decorator metadata object.
        const lClassMetadata: ConstructorMetadata = Metadata.forInternalDecorator(pContext.metadata);

        // Get property list from constructor metadata.
        const lEventPropertyList: Array<[PropertyKey, string]> = lClassMetadata.getMetadata(ComponentEventListenerComponentExtension.METADATA_USER_EVENT_LISTENER_PROPERIES) ?? new Array<[PropertyKey, string]>();
        lEventPropertyList.push([pContext.name, pEventName]);

        // Set metadata.
        lClassMetadata.setMetadata(ComponentEventListenerComponentExtension.METADATA_USER_EVENT_LISTENER_PROPERIES, lEventPropertyList);
    };
}

type EventListener<TEvent extends Event> = (pEvent: TEvent) => any;