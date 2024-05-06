import { Exception } from '@kartoffelgames/core.data';
import { InjectionConstructor, Metadata } from '@kartoffelgames/core.dependency-injection';
import { ChangeDetection } from '@kartoffelgames/web.change-detection';
import { PwbExtension } from '../../decorator/pwb-extension.decorator';
import { AccessMode } from '../../enum/access-mode.enum';
import { ExtensionType } from '../../enum/extension-type.enum';
import { IPwbExtensionOnDeconstruct } from '../../interface/extension.interface';
import { EventListenerComponentExtension } from './event-listener-component-extension';
import { ModuleConstructorReference } from '../../injection/references/module/module-constructor-reference';
import { ModuleReference } from '../../injection/references/module/module-reference';
import { ModuleTargetNodeReference } from '../../injection/references/module/module-target-node-reference';
import { ComponentElementReference } from '../../injection/references/component/component-element-reference';

@PwbExtension({
    type: ExtensionType.Module,
    access: AccessMode.Read
})
export class EventListenerModuleExtension implements IPwbExtensionOnDeconstruct {
    private readonly mEventListenerList: Array<[string, EventListener]>;
    private readonly mTargetElement: Node;

    /**
     * Constructor.
     * Add each event listener to component events.
     * 
     * @param pModuleProcessorConstructor - Module processor constructor.
     * @param pModule - Module processor.
     * @param pModuleElementReference - Component html element.
     */
    public constructor(pModuleProcessorConstructor: ModuleConstructorReference, pModule: ModuleReference, pModuleElementReference: ModuleTargetNodeReference, pComponentElementReference: ComponentElementReference) {
        // Get event metadata.
        const lEventPropertyList: Array<[string, string]> = new Array<[string, string]>();

        let lClass: InjectionConstructor = <InjectionConstructor>pModuleProcessorConstructor;
        do {
            // Find all event properties of current class layer and add all to merged property list.
            const lPropertyList: Array<[string, string]> | null = Metadata.get(lClass).getMetadata(EventListenerComponentExtension.METADATA_USER_EVENT_LISTENER_PROPERIES);
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

        // Fallback to component element, when module element reference is not a "html" element.
        if (pModuleElementReference instanceof Element) {
            this.mTargetElement = pModuleElementReference;
        } else {
            this.mTargetElement = pComponentElementReference;
        }

        // Override each property with the corresponding component event emitter.
        for (const lEventProperty of lEventPropertyList) {
            const [lPropertyKey, lEventName] = lEventProperty;

            // Get target event listener function.
            let lEventListener: EventListener = Reflect.get(pModule.processor, lPropertyKey);
            lEventListener = ChangeDetection.getUntrackedObject(lEventListener).bind(pModule.processor);

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