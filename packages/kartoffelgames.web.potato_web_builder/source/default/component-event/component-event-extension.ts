import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { InjectionConstructor, Metadata } from '@kartoffelgames/core.dependency-injection';
import { PwbExtension } from '../../decorator/pwb-extension.decorator';
import { ExtensionMode } from '../../enum/extension-mode.enum';
import { ExtensionType } from '../../enum/extension-type.enum';
import { ComponentElementReference } from '../../injection_reference/general/component-element-reference';
import { ExtensionTargetClassReference } from '../../injection_reference/extension-target-class-reference';
import { ExtensionTargetObjectReference } from '../../injection_reference/extension-target-object-reference';
import { ComponentEventEmitter } from './component-event-emitter';

@PwbExtension({
    type: ExtensionType.Component,
    mode: ExtensionMode.Patch
})
export class ComponentEventExtension {
    public static readonly METADATA_USER_EVENT_PROPERIES: string = 'pwb:user_event_properties';

    /**
     * Constructor.
     * Override each event emmiter property with a new pre defined event emmiter.
     * @param pTargetClassReference - User class reference.
     * @param pTargetObjectReference - User object reference.
     * @param pElementReference - Component html element reference.
     */
    public constructor(pTargetClassReference: ExtensionTargetClassReference, pTargetObjectReference: ExtensionTargetObjectReference, pElementReference: ComponentElementReference) {
        // Get event metadata.
        const lEventProperties: Dictionary<string, string> = new Dictionary<string, string>();

        let lClass: InjectionConstructor = pTargetClassReference.value;
        do {
            // Find all event properties of current class layer and add all to merged property list.
            const lEventPropertyList: Dictionary<string, string> | null = Metadata.get(lClass).getMetadata(ComponentEventExtension.METADATA_USER_EVENT_PROPERIES);
            if (lEventPropertyList) {
                // Merge all properies into event properties, do not override.
                for (const [lEventName, lPropertyName] of lEventPropertyList) {
                    if (!lEventProperties.has(lEventName)) {
                        lEventProperties.set(lEventName, lPropertyName);

                        // Validate event emitter property type.
                        if (Metadata.get(lClass).getProperty(lPropertyName).type !== ComponentEventEmitter) {
                            throw new Exception(`Event emitter property must be of type ${ComponentEventEmitter.name}`, this);
                        }
                    }
                }
            }

            // Get next inherited parent class. Exit when no parent was found.
            // eslint-disable-next-line no-cond-assign
        } while (lClass = Object.getPrototypeOf(lClass));

        // Easy access target objects.
        const lTargetObject: object = pTargetObjectReference.value;
        const lTargetElement: HTMLElement = <HTMLElement>pElementReference.value;

        // Override each property with the corresponding component event emitter.
        for (const lEventName of lEventProperties.keys()) {
            const lPropertyKey: string = <string>lEventProperties.get(lEventName);

            // Create component event emitter.
            const lEventEmitter: ComponentEventEmitter<any> = new ComponentEventEmitter(lEventName, lTargetElement);

            // Override property with created component event emmiter getter.
            Object.defineProperty(lTargetObject, lPropertyKey, {
                get: () => {
                    return lEventEmitter;
                }
            });
        }
    }
}