import { Exception } from '@kartoffelgames/core.data';
import { InjectionConstructor, Metadata } from '@kartoffelgames/core.dependency-injection';
import { ModuleConstructorReference } from '../../core/injection-reference/module/module-constructor-reference';
import { ModuleReference } from '../../core/injection-reference/module/module-reference';
import { ModuleTargetNodeReference } from '../../core/injection-reference/module/module-target-node-reference';
import { AttributeModule } from '../../core/module/attribute_module/attribute-module';
import { IPwbExtensionModuleOnDeconstruct } from '../../core/extension/extension-module';
import { PwbExtensionModule } from '../../core/extension/pwb-extension-module.decorator';
import { AccessMode } from '../../enum/access-mode.enum';
import { UpdateTrigger } from '../../enum/update-trigger.enum';
import { EventListenerComponentExtension } from './event-listener-component-extension';

@PwbExtensionModule({
    access: AccessMode.Read,
    trigger: UpdateTrigger.Default,
    targetRestrictions: [AttributeModule]
})
export class EventListenerModuleExtension implements IPwbExtensionModuleOnDeconstruct {
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
    public constructor(pModuleProcessorConstructor: ModuleConstructorReference, pModule: ModuleReference, pModuleElementReference: ModuleTargetNodeReference) {
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
        this.mTargetElement = pModuleElementReference;

        // Override each property with the corresponding component event emitter.
        for (const lEventProperty of lEventPropertyList) {
            const [lPropertyKey, lEventName] = lEventProperty;

            // Get target event listener function.
            let lEventListener: EventListener = Reflect.get(pModule.processor, lPropertyKey);
            lEventListener = lEventListener.bind(pModule.processor);

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