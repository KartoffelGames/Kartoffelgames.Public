import { Exception } from '@kartoffelgames/core.data';
import { InjectionConstructor, Metadata } from '@kartoffelgames/core.dependency-injection';
import { PwbExtensionModule } from '../../decorator/pwb-extension-module.decorator';
import { AccessMode } from '../../enum/access-mode.enum';
import { ExtensionType } from '../../enum/extension-type.enum';
import { ComponentConstructorReference } from '../../injection/references/component/component-constructor-reference';
import { ComponentElementReference } from '../../injection/references/component/component-element-reference';
import { ComponentReference } from '../../injection/references/component/component-reference';
import { ComponentProcessorConstructor } from '../../interface/component.interface';
import { ComponentEventEmitter } from './component-event-emitter';
import { UpdateTrigger } from '../../enum/update-trigger.enum';

@PwbExtensionModule({
    access: AccessMode.Read,
    trigger: UpdateTrigger.Default,
    type: ExtensionType.Component
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