import { Exception } from '@kartoffelgames/core.data';
import { InjectionConstructor, Metadata } from '@kartoffelgames/core.dependency-injection';
import { Component } from '../../core/component/component';
import { PwbExtensionModule } from '../../core/extension/pwb-extension-module.decorator';
import { AccessMode } from '../../enum/access-mode.enum';
import { UpdateTrigger } from '../../enum/update-trigger.enum';
import { ComponentConstructorReference } from '../../core/injection-reference/component/component-constructor-reference';
import { ComponentElementReference } from '../../core/injection-reference/component/component-element-reference';
import { ComponentReference } from '../../core/injection-reference/component/component-reference';
import { ComponentProcessorConstructor } from '../../core/component/component.interface';
import { ComponentEventEmitter } from './component-event-emitter';

@PwbExtensionModule({
    access: AccessMode.Read,
    trigger: UpdateTrigger.Default,
    targetRestrictions: [Component]
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
        // Find all event properties of current class layer and add all to merged property list.
        const lEventPropertyMapList: Array<Array<[string, string, ComponentProcessorConstructor]>> = Metadata.get(<InjectionConstructor>pComponentProcessorConstructor).getInheritedMetadata(ComponentEventExtension.METADATA_USER_EVENT_PROPERIES);
        for (const lEventPropertyList of lEventPropertyMapList) {
            for (const [lEventName, lPropertyKey, lConstructor] of lEventPropertyList) {
                // Validate event emitter property type.
                if (Metadata.get(lConstructor).getProperty(lPropertyKey).type !== ComponentEventEmitter) {
                    throw new Exception(`Event emitter property must be of type ${ComponentEventEmitter.name}`, this);
                }

                // Create component event emitter.
                const lEventEmitter: ComponentEventEmitter<any> = new ComponentEventEmitter(lEventName, pElementReference);

                // Override property with created component event emmiter getter.
                Object.defineProperty(pComponent.processor, lPropertyKey, {
                    get: () => {
                        return lEventEmitter;
                    }
                });
            }
        }
    }
}