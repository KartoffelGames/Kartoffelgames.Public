import { Exception } from '@kartoffelgames/core';
import { InjectionConstructor, Metadata } from '@kartoffelgames/core.dependency-injection';
import { IExtensionOnDeconstruct } from '../../core/extension/extension-module';
import { PwbExtensionModule } from '../../core/extension/pwb-extension-module.decorator';
import { ModuleTargetNode } from '../../core/module/injection_reference/module-target-node';
import { AttributeModule } from '../../core/module/attribute_module/attribute-module';
import { AccessMode } from '../../core/enum/access-mode.enum';
import { UpdateTrigger } from '../../core/enum/update-trigger.enum';
import { ComponentEventListenerComponentExtension } from './component-event-listener-component-extension';

@PwbExtensionModule({
    access: AccessMode.Read,
    trigger: UpdateTrigger.Any,
    targetRestrictions: [AttributeModule]
})
export class ComponentEventListenerModuleExtension implements IExtensionOnDeconstruct {
    private readonly mEventListenerList: Array<[string, EventListener]>;
    private readonly mTargetElement: Node;

    /**
     * Constructor.
     * Add each event listener to component events.
     * 
     * @param pModuleProcessorConstructor - Module processor constructor.
     * @param pExtensionTargetModule - Module processor.
     * @param pModuleElementReference - Component html element.
     */
    public constructor(pExtensionTargetModule: AttributeModule, pModuleElementReference: ModuleTargetNode) {
        // Get event metadata.
        const lEventPropertyList: Array<[string, string]> = new Array<[string, string]>();

        let lClass: InjectionConstructor = pExtensionTargetModule.processorConstructor;
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

        // Fallback to component element, when module element reference is not a "html" element.
        this.mTargetElement = pModuleElementReference;

        // Override each property with the corresponding component event emitter.
        for (const lEventProperty of lEventPropertyList) {
            const [lPropertyKey, lEventName] = lEventProperty;

            // Get target event listener function.
            let lEventListener: EventListener = Reflect.get(pExtensionTargetModule.processor, lPropertyKey);
            lEventListener = lEventListener.bind(pExtensionTargetModule.processor);

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