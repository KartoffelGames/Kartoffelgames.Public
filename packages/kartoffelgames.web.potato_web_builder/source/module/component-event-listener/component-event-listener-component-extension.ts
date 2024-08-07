import { Exception } from '@kartoffelgames/core';
import { InjectionConstructor, Metadata } from '@kartoffelgames/core.dependency-injection';
import { Component } from '../../core/component/component';
import { IExtensionOnDeconstruct } from '../../core/extension/extension-module';
import { PwbExtensionModule } from '../../core/extension/pwb-extension-module.decorator';
import { AccessMode } from '../../core/enum/access-mode.enum';
import { UpdateTrigger } from '../../core/enum/update-trigger.enum';
import { Processor } from '../../core/core_entity/processor';

@PwbExtensionModule({
    access: AccessMode.Read,
    trigger: UpdateTrigger.Any,
    targetRestrictions: [Component]
})
export class ComponentEventListenerComponentExtension extends Processor implements IExtensionOnDeconstruct {
    public static readonly METADATA_USER_EVENT_LISTENER_PROPERIES: string = 'pwb:user_event_listener_properties';

    private readonly mEventListenerList: Array<[string, EventListener]>;
    private readonly mTargetElement: HTMLElement;

    /**
     * Constructor.
     * Add each event listener to component events.
     * 
     * @param pComponent - Component processor.
     */
    public constructor(pComponent: Component) {
        super();
        
        // Get event metadata.
        const lEventPropertyList: Array<[string, string]> = new Array<[string, string]>();

        let lClass: InjectionConstructor = pComponent.processorConstructor;
        do {
            // Find all event properties of current class layer and add all to merged property list.
            const lPropertyList: Array<[string, string]> | null = Metadata.get(lClass).getMetadata(ComponentEventListenerComponentExtension.METADATA_USER_EVENT_LISTENER_PROPERIES);
            if (lPropertyList) {
                // Merge all properies into event property list.
                for (const lProperty of lPropertyList) {
                    lEventPropertyList.push(lProperty);

                    // Validate property type: Function.
                    if (Metadata.get(lClass).getProperty(lProperty[0]).type !== Function) {
                        throw new Exception(`Event listener property must be of type Function`, this);
                    }
                }
            }

            // Get next inherited parent class. Exit when no parent was found.
            // eslint-disable-next-line no-cond-assign
        } while (lClass = Object.getPrototypeOf(lClass));

        // Initialize lists.
        this.mEventListenerList = new Array<[string, EventListener]>();

        // Easy access target objects.
        this.mTargetElement = pComponent.element;

        // Override each property with the corresponding component event emitter.
        for (const lEventProperty of lEventPropertyList) {
            const [lPropertyKey, lEventName] = lEventProperty;

            // Get target event listener function.
            let lEventListener: EventListener = Reflect.get(pComponent.processor, lPropertyKey);
            lEventListener = lEventListener.bind(pComponent.processor);

            // Add listener element and save for deconstruct.
            this.mEventListenerList.push([lEventName, lEventListener]);
            this.mTargetElement.addEventListener(lEventName, lEventListener);
        }
    }

    /**
     * Remove all listener.
     */
    public onDeconstruct(): void {
        // Remove all events from target element.
        for (const lListener of this.mEventListenerList) {
            const [lEventName, lFunction] = lListener;
            this.mTargetElement.removeEventListener(lEventName, lFunction);
        }
    }
}

type EventListener = (...pArgs: Array<any>) => any;