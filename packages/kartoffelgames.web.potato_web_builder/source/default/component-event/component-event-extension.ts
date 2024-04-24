import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { InjectionConstructor, Metadata } from '@kartoffelgames/core.dependency-injection';
import { PwbExtension } from '../../decorator/pwb-extension.decorator';
import { AccessMode } from '../../enum/access-mode.enum';
import { ExtensionType } from '../../enum/extension-type.enum';
import { ComponentEventEmitter } from './component-event-emitter';
import { ComponentConstructorReference } from '../../injection/references/component/component-constructor-reference';
import { ComponentReference } from '../../injection/references/component/component-reference';
import { ComponentElementReference } from '../../injection/references/component/component-element-reference';

@PwbExtension({
    type: ExtensionType.Component,
    access: AccessMode.Read
})
export class ComponentEventExtension {
    public static readonly METADATA_USER_EVENT_PROPERIES: string = 'pwb:user_event_properties';

    /**
     * Constructor.
     * Override each event emmiter property with a new pre defined event emmiter.
     * 
     * @param pComponentProcessorConstructor - Component processor constructor.
     * @param pComponent - Component processor.
     * @param pElementReference - Component html element.
     */
    public constructor(pComponentProcessorConstructor: ComponentConstructorReference, pComponent: ComponentReference, pElementReference: ComponentElementReference) {
        // Get event metadata.
        const lEventProperties: Dictionary<string, string> = new Dictionary<string, string>();

        let lClass: InjectionConstructor = <InjectionConstructor>pComponentProcessorConstructor;
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
        const lTargetObject: object = pComponent.processor;
        const lTargetElement: HTMLElement = pElementReference;

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